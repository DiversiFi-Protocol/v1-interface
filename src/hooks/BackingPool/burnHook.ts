import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { erc20Abi, formatGwei, maxUint256, parseUnits, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient, useReadContracts } from 'wagmi';

import IBackingPool from '@/abi/IBackingPool';
import { chain, chainId } from '@/constants/chain';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { EMPTY_ARR } from '@/constants/objects';
import { BACKED_TOKEN, SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import { useAppSelector } from '@/state/appTypes';
import { selectShouldAllowMaxApprovals } from '@/state/formSettingsSelector';

import { isTruthy } from '@/lib/isTruthy';
import { MustBigNumber } from '@/lib/numbers';
import { queryClient } from '@/lib/queryClient';
import { sleep } from '@/lib/sleep';

import { useEthereumPrice } from '../useEthereumPrice';
import { useAllAssetScaledReserves, useGetTotalScaledReserves } from './usePoolReserves';

export type BurnStep = {
  type: 'network' | 'approve' | 'burn';
  execute: (signer: WalletClient) => Promise<{ success: boolean; error?: unknown }>;
};

export function useBurnSteps({ amount }: { amount: string }) {
  const walletChainId = useChainId();
  const { address } = useAccount();
  const client = usePublicClient({
    chainId,
  });

  const allowMaxApproval = useAppSelector(selectShouldAllowMaxApprovals);

  const allowanceContracts = useMemo(() => {
    return SUPPORTED_RESERVE_ASSETS.map((asset) => ({
      address: asset.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, BACKING_POOL_ADDRESS],
    }));
  }, [address]);

  const allowances = useReadContracts({
    contracts: allowanceContracts,
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      staleTime: 5_000,
    },
  });

  async function getStepsForBurn() {
    const steps: BurnStep[] = [];
    const notifId = crypto.randomUUID();

    if (!address) {
      throw new Error('burnHook: No account address found');
    }

    // Step 1. Check network
    if (walletChainId !== chainId) {
      steps.push({
        type: 'network',
        execute: async (signer: WalletClient) => {
          try {
            await signer.switchChain({
              id: chainId,
            });
            // Wait for the chain to be switched
            await sleep(2_000);

            return {
              success: true,
            };
          } catch {
            try {
              await signer.addChain({
                chain,
              });
              // Wait for external wallet to update chains
              await sleep(2_000);

              return {
                success: true,
              };
            } catch (error) {
              console.error(error);
              toast.error('Failed to switch network', {
                id: notifId,
              });

              return {
                success: false,
                error,
              };
            }
          }
        },
      });
    }

    // Step 2. Token Approval
    const amountBigInt = parseUnits(amount, BACKED_TOKEN.decimals);
    const needsApproval = (allowances.data ?? EMPTY_ARR)
      .map((allowance, idx) => {
        if (allowance.result == null) {
          return undefined;
        }

        const currentAllowance = allowance.result as bigint;
        const asset = SUPPORTED_RESERVE_ASSETS[idx];
        const amountNeededBN = MustBigNumber(amount).div(3);
        const amountNeededBigInt = parseUnits(amountNeededBN.toString(), asset.decimals);

        if (currentAllowance < amountNeededBigInt) {
          return {
            asset,
            amountNeededBigInt,
          };
        }
      })
      .filter(isTruthy);

    if (needsApproval.length > 0) {
      needsApproval.forEach(({ asset, amountNeededBigInt }) => {
        steps.push({
          type: 'approve',
          execute: async (signer: WalletClient) => {
            try {
              const txHash = await signer.writeContract({
                address: asset.address,
                abi: erc20Abi,
                functionName: 'approve',
                args: [BACKING_POOL_ADDRESS, allowMaxApproval ? maxUint256 : amountNeededBigInt],
                chain,
                account: address,
              });

              const receipt = await client!.waitForTransactionReceipt({ hash: txHash });

              if (receipt.status !== 'success') {
                throw new Error('burnHook: Approval failed');
              }

              toast.success(`${asset.symbol} Token approval has been submitted`, {
                id: notifId,
                action: {
                  label: 'View tx',
                  onClick: () => {
                    window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
                  },
                },
              });

              queryClient.invalidateQueries({
                queryKey: allowances.queryKey,
              });

              return {
                success: true,
              };
            } catch (error) {
              console.error(error);
              toast.error(`${asset.symbol} Token approval has failed`, {
                id: notifId,
              });

              return {
                success: false,
                error,
              };
            }
          },
        });
      });
    }

    // Step 3. burn
    steps.push({
      type: 'burn',
      execute: async (signer: WalletClient) => {
        try {
          // Execute the burn
          const txHash = await signer.writeContract({
            address: BACKING_POOL_ADDRESS,
            abi: IBackingPool,
            functionName: 'burn',
            args: [amountBigInt, '0x'],
            chain,
            account: address,
          });

          const receipt = await client!.waitForTransactionReceipt({ hash: txHash });
          if (receipt.status !== 'success') {
            throw new Error('burnHook: burn failed');
          }

          toast.success('Burn has been submitted', {
            id: notifId,
            action: {
              label: 'View tx',
              onClick: () => {
                window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
              },
            },
          });

          return {
            success: true,
          };
        } catch (error) {
          console.error(error);
          toast.error('Burn has failed', {
            id: notifId,
          });

          return {
            success: false,
            error,
          };
        }
      },
    });

    return steps;
  }

  return useQuery({
    enabled: !!client && !!address && amount.trim() !== '' && !Number.isNaN(Number(amount)),
    queryKey: ['burnSteps', address, amount],
    queryFn: getStepsForBurn,
  });
}

export function useSimulateBurn({ amount }: { amount: string }) {
  const { address } = useAccount();
  const { data: ethPrice } = useEthereumPrice();

  const client = usePublicClient({
    chainId,
  });

  async function simulateBurn() {
    if (!client || !address || amount.trim() === '') {
      throw new Error('simulateburnGivenIn: Invalid input');
    }

    const amountBigInt = parseUnits(amount, BACKED_TOKEN.decimals);

    const gas = await client.estimateContractGas({
      address: BACKING_POOL_ADDRESS,
      abi: IBackingPool,
      functionName: 'burn',
      args: [amountBigInt, '0x'],
      account: address,
    });

    const networkCost = ethPrice.price
      ? MustBigNumber(formatGwei(gas)).times(ethPrice.price).toFixed(2)
      : undefined;

    return {
      amountIn: amount,
      networkCost,
    };
  }

  return useQuery({
    enabled: !!client && amount.trim() !== '',
    queryKey: ['simulateBurn', address, amount],
    queryFn: simulateBurn,
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}

export function useBurnWithdrawalAmounts({ burnAmount }: { burnAmount: string }) {
  const { totalScaledReserves } = useGetTotalScaledReserves();
  const { scaledReserves } = useAllAssetScaledReserves();

  return useMemo(() => {
    if (totalScaledReserves == null || scaledReserves == null) {
      return undefined;
    }

    return scaledReserves.map(({ amount, address, decimals, symbol }) => {
      const withdrawalAmount = MustBigNumber(burnAmount)
        .times(amount)
        .div(totalScaledReserves)
        .toFixed(4);

      return {
        address,
        decimals,
        symbol,
        withdrawalAmount,
      };
    });
  }, [burnAmount, totalScaledReserves, scaledReserves]);
}

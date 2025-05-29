import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { erc20Abi, formatGwei, formatUnits, maxUint256, parseUnits, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient } from 'wagmi';

import IBackingPool from '@/abi/IBackingPool';
import { chain, chainId } from '@/constants/chain';
import { envVar } from '@/constants/environment';
import { SupportedAsset } from '@/constants/tokens';

import { MustBigNumber } from '@/lib/numbers';
import { sleep } from '@/lib/sleep';

import { useEthereumPrice } from '../useEthereumPrice';

export type SwapStep = {
  type: 'network' | 'approve' | 'swap';
  execute: (signer: WalletClient) => Promise<void>;
};

export function useSwapSteps({
  assetIn,
  assetOut,
  amount,
  allowMaxApproval,
  minAmountOut,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
  allowMaxApproval?: boolean;
  minAmountOut?: string;
}) {
  const { address: assetInAddress, decimals: assetInDecimals } = assetIn;
  const { address: assetOutAddress, decimals: assetOutDecimals } = assetOut;
  const walletChainId = useChainId();
  const { address } = useAccount();
  const client = usePublicClient({
    chainId,
  });

  async function getStepsForSwap() {
    const steps = [];
    const notifId = crypto.randomUUID();

    if (!address) {
      throw new Error('swapHook: No account address found');
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
    const allowance = await client!.readContract({
      address: assetInAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, envVar.backingPoolAddress],
    });

    const amountBigInt = parseUnits(amount, assetInDecimals);

    if (allowance < amountBigInt) {
      steps.push({
        type: 'approve',
        execute: async (signer: WalletClient) => {
          try {
            const txHash = await signer.writeContract({
              address: assetInAddress,
              abi: erc20Abi,
              functionName: 'approve',
              args: [envVar.backingPoolAddress, allowMaxApproval ? maxUint256 : amountBigInt],
              chain,
              account: address,
            });

            const receipt = await client!.waitForTransactionReceipt({ hash: txHash });
            if (receipt.status !== 'success') {
              throw new Error('swapHook: Approval failed');
            }

            toast.success('Token approval has been submitted', {
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
            toast.error('Token approval has failed', {
              id: notifId,
            });

            return {
              success: false,
              error,
            };
          }
        },
      });
    }

    // Step 3. Swap
    const minAmountOutBigInt = minAmountOut ? parseUnits(minAmountOut, assetOutDecimals) : 0n;

    steps.push({
      type: 'swap',
      execute: async (signer: WalletClient) => {
        try {
          // Execute the swap
          const txHash = await signer.writeContract({
            address: envVar.backingPoolAddress,
            abi: IBackingPool,
            functionName: 'swapGivenIn',
            args: [address, assetInAddress, assetOutAddress, amountBigInt, minAmountOutBigInt],
            chain,
            account: address,
          });

          const receipt = await client!.waitForTransactionReceipt({ hash: txHash });
          if (receipt.status !== 'success') {
            throw new Error('swapHook: Swap failed');
          }

          toast.success('Swap has been submitted', {
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
          toast.error('Swap has failed', {
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
    enabled: !!client && !!address && amount.trim() !== '',
    queryKey: ['swapSteps', assetInAddress, assetOutAddress, address, amount],
    queryFn: getStepsForSwap,
    refetchInterval: 10_000,
    staleTime: 10_000,
  });
}

export function useSimulateSwapGivenIn({
  assetIn,
  assetOut,
  amount,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
}) {
  const { address: assetInAddress, decimals: assetInDecimals } = assetIn;
  const { address: assetOutAddress, decimals: assetOutDecimals } = assetOut;
  const { address } = useAccount();
  const { data: ethPrice } = useEthereumPrice();

  const client = usePublicClient({
    chainId,
  });

  async function simulateSwap() {
    if (!client || !address || amount.trim() === '') {
      throw new Error('simulateSwapGivenIn: Invalid input');
    }

    const amountBigInt = parseUnits(amount, assetInDecimals);
    const simulate = await client.simulateContract({
      address: envVar.backingPoolAddress,
      abi: IBackingPool,
      functionName: 'swapGivenIn',
      args: [address, assetInAddress, assetOutAddress, amountBigInt, 0n],
    });

    const gas = await client.estimateContractGas({
      address: envVar.backingPoolAddress,
      abi: IBackingPool,
      functionName: 'swapGivenIn',
      args: [address, assetInAddress, assetOutAddress, amountBigInt, 0n],
    });

    const networkCost = ethPrice.price
      ? MustBigNumber(formatGwei(gas)).times(ethPrice.price).toFixed(2)
      : undefined;

    if (simulate.result == null) {
      return undefined;
    }

    const amountOut = formatUnits(simulate.result[0], assetOutDecimals);
    const fee = formatUnits(simulate.result[1], assetOutDecimals);

    return {
      amountIn: amount,
      assetIn,
      amountOut,
      assetOut,
      networkCost,
      fee,
    };
  }

  return useQuery({
    enabled: !!client && amount.trim() !== '',
    queryKey: ['simulateSwapGivenIn', assetInAddress, assetOutAddress, amount],
    queryFn: simulateSwap,
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}

export function useSimulateSwapGivenOut({
  assetIn,
  assetOut,
  amount,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
}) {
  const { address: assetInAddress, decimals: assetInDecimals } = assetIn;
  const { address: assetOutAddress, decimals: assetOutDecimals } = assetOut;
  const { address } = useAccount();
  const { data: ethPrice } = useEthereumPrice();

  const client = usePublicClient({
    chainId,
  });

  async function simulateSwap() {
    if (!address || amount.trim() === '') {
      throw new Error('simulateSwapGivenOut: Invalid input');
    }

    if (!client) {
      throw new Error('simulateSwapGivenOut: No client found');
    }

    const amountBigInt = parseUnits(amount, assetOutDecimals);
    const simulate = await client.simulateContract({
      address: envVar.backingPoolAddress,
      abi: IBackingPool,
      functionName: 'swapGivenOut',
      args: [address, assetInAddress, assetOutAddress, amountBigInt, 0n],
    });

    const gas = await client.estimateContractGas({
      address: envVar.backingPoolAddress,
      abi: IBackingPool,
      functionName: 'swapGivenOut',
      args: [address, assetInAddress, assetOutAddress, amountBigInt, 0n],
    });

    const networkCost = ethPrice.price
      ? MustBigNumber(formatGwei(gas)).times(ethPrice.price).toFixed(2)
      : undefined;
    if (simulate.result == null) {
      return undefined;
    }

    const amountOut = formatUnits(simulate.result[0], assetInDecimals);
    const fee = formatUnits(simulate.result[1], assetInDecimals);

    return {
      amountIn: amount,
      assetIn,
      amountOut,
      assetOut,
      networkCost,
      fee,
    };
  }

  return useQuery({
    enabled: !!client && amount.trim() !== '',
    queryKey: ['simulateSwapGivenOut', assetInAddress, assetOutAddress, amount],
    queryFn: simulateSwap,
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}

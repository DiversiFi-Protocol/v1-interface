import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { erc20Abi, formatGwei, formatUnits, maxUint256, parseUnits, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient } from 'wagmi';

import { chain, chainId } from '@/constants/chain';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SupportedAsset } from '@/constants/tokens';

import { MustBigNumber } from '@/lib/numbers';
import { sleep } from '@/lib/sleep';
import { prepareSwapExactInputSingle } from '@/lib/uniswapUtils';

import { useEthereumPrice } from '../useEthereumPrice';

export type SwapStep = {
  type: 'network' | 'approve' | 'swap';
  execute: (signer: WalletClient) => Promise<{ success: boolean; error?: unknown }>;
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
    const steps: SwapStep[] = [];
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
      args: [address, BACKING_POOL_ADDRESS],
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
              args: [BACKING_POOL_ADDRESS, allowMaxApproval ? maxUint256 : amountBigInt],
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

    const swapData = prepareSwapExactInputSingle({
      caller: address,
      chain,
      inputToken: assetInAddress,
      outputToken: assetOutAddress,
      exactInput: amountBigInt,
      minimumOutput: minAmountOutBigInt,
    });

    steps.push({
      type: 'swap',
      execute: async (signer: WalletClient) => {
        try {
          // Execute the swap
          const txHash = await signer.writeContract(
            swapData,
          );

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
  minAmountOut,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
  minAmountOut?: string;
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
    const minAmountOutBigInt = minAmountOut ? parseUnits(minAmountOut, assetOutDecimals) : 0n;

    console.log("???")
    const swapData = prepareSwapExactInputSingle({
      caller: address,
      chain,
      inputToken: assetInAddress,
      outputToken: assetOutAddress,
      exactInput: amountBigInt,
      minimumOutput: minAmountOutBigInt,
    });

    console.log("swapData", swapData);

    const simulate = await client.simulateContract(
      swapData,
    );

    console.log('simulate', simulate);
    const gas = await client.estimateContractGas(swapData);

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

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { erc20Abi, formatGwei, formatUnits, maxUint256, parseUnits, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient } from 'wagmi';

import { chain, chainId } from '@/constants/chain';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SupportedAsset } from '@/constants/tokens';

import { useAppSelector } from '@/state/appTypes';
import { selectShouldAllowMaxApprovals } from '@/state/formSettingsSelector';

import { MustBigNumber } from '@/lib/numbers';
import { sleep } from '@/lib/sleep';
import { prepareQuoteExactInputSingle, prepareSwapExactInputSingle } from '@/lib/uniswapUtils';

import { useEthereumPrice } from '../useEthereumPrice';

export type SwapStep = {
  type: 'network' | 'approve' | 'swap';
  execute: (signer: WalletClient) => Promise<{ success: boolean; error?: unknown }>;
};

export function useSwapSteps({
  assetIn,
  assetOut,
  amount,
  minAmountOut,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
  minAmountOut?: bigint;
}) {
  const { address: assetInAddress, decimals: assetInDecimals } = assetIn;
  const { address: assetOutAddress } = assetOut;
  const allowMaxApproval = useAppSelector(selectShouldAllowMaxApprovals);
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
    const swapData = prepareSwapExactInputSingle({
      caller: address,
      chain,
      inputToken: assetInAddress,
      outputToken: assetOutAddress,
      exactInput: amountBigInt,
      minimumOutput: minAmountOut ?? 0n, // minAmountOut should never be undefined due to the query's enabled condition
    });

    steps.push({
      type: 'swap',
      execute: async (signer: WalletClient) => {
        try {
          // Execute the swap
          const txHash = await signer.writeContract(swapData);

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
    enabled: !!client && !!address && amount.trim() !== '' && minAmountOut != null,
    queryKey: ['swapSteps', assetInAddress, assetOutAddress, address, amount],
    queryFn: getStepsForSwap,
    refetchInterval: 10_000,
    staleTime: 10_000,
  });
}

export function useGetSwapQuote({
  assetIn,
  assetOut,
  amount,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
}) {
  const { data: ethPrice } = useEthereumPrice();
  const client = usePublicClient({
    chainId,
  });

  async function getQuote() {
    if (!client || amount.trim() === '') {
      throw new Error('simulateSwapGivenIn: Invalid input');
    }

    const quoteReadParams = prepareQuoteExactInputSingle({
      inputToken: assetIn.address,
      outputToken: assetOut.address,
      exactInput: parseUnits(amount, assetIn.decimals),
    });

    const quote = await client.readContract(quoteReadParams);
    const [amountOutBigInt, gasUsedBigInt] = quote as [bigint, bigint];
    const amountOut = formatUnits(amountOutBigInt, assetOut.decimals);

    const networkCost = ethPrice.price
      ? MustBigNumber(formatGwei(gasUsedBigInt)).times(ethPrice.price).toFixed(2)
      : undefined;

    return {
      amountIn: amount,
      assetIn,
      amountOut,
      assetOut,
      networkCost,
      fee: MustBigNumber(amountOut).times(0.0001).toFixed(2),
      amountOutBigInt,
    };
  }

  return useQuery({
    enabled: !!client && amount.trim() !== '',
    queryKey: ['swapQuote', assetIn.address, assetOut.address, amount],
    queryFn: getQuote,
    staleTime: 20_000,
    refetchInterval: 20_000,
  });
}

import IBackingPool from '@/abi/IBackingPool';
import { chain, chainId } from '@/constants/chain';
import { envVar } from '@/constants/environment';
import { SupportedAsset } from '@/constants/tokens';
import { sleep } from '@/lib/sleep';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { erc20Abi, maxUint256, parseUnits, WalletClient } from 'viem';
import { useAccount, useChainId, usePublicClient } from 'wagmi';

export type SwapStep = {
  type: 'network' | 'approve' | 'swap';
  execute: (signer: WalletClient) => Promise<void>;
};

export function useSwapSteps({
  assetIn,
  assetOut,
  amount,
  allowMaxApproval,
}: {
  assetIn: SupportedAsset;
  assetOut: SupportedAsset;
  amount: string;
  allowMaxApproval?: boolean;
}) {
  const { address: assetInAddress, decimals: assetInDecimals } = assetIn;
  const { address: assetOutAddress } = assetOut;
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
    steps.push({
      type: 'swap',
      execute: async (signer: WalletClient) => {
        try {
          // Simulate the swap
          const simulate = await client!.simulateContract({
            address: envVar.backingPoolAddress,
            abi: IBackingPool,
            functionName: 'swapGivenIn',
            args: [address, assetInAddress, assetOutAddress, amountBigInt, 0n],
          });

          const minAmountOut = simulate.result;

          // Execute the swap
          const txHash = await signer.writeContract({
            address: envVar.backingPoolAddress,
            abi: IBackingPool,
            functionName: 'swapGivenIn',
            args: [address, assetInAddress, assetOutAddress, amountBigInt, minAmountOut],
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
  }

  return useQuery({
    enabled: !!client && !!address && amount.trim() !== '',
    queryKey: [assetInAddress, assetOutAddress, address, amount],
    queryFn: getStepsForSwap,
    refetchInterval: 5_000,
    staleTime: 5_000,
  });
}

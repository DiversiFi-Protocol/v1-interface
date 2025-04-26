import IBackingPoolAbi from '@/abi/IBackingPool';
import { toast } from 'sonner';
import { Address, zeroAddress } from 'viem';
import { useAccount, useSimulateContract, useWriteContract } from 'wagmi';

export function useSwap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const swap = async (
    inputAsset: Address,
    outputAsset: Address,
    inputAmount: bigint,
    minOutput: bigint
  ) => {
    try {
      if (address == null) {
        throw new Error('No account connected');
      }

      const txHash = await writeContractAsync({
        abi: IBackingPoolAbi,
        address: zeroAddress,
        functionName: 'swapGivenIn',
        args: [address, inputAsset, outputAsset, inputAmount, minOutput],
      });

      toast.success('Swap has been submitted', {
        action: {
          label: 'View tx',
          onClick: () => {
            window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
          },
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Swap has failed');
    }
  };

  return swap;
}

export function useSimulateSwap({
  inputAsset,
  outputAsset,
  inputAmount,
  minOutput,
}: {
  inputAsset?: Address;
  outputAsset?: Address;
  inputAmount?: bigint;
  minOutput?: bigint;
}) {
  const { address } = useAccount();

  const swapSimulation = useSimulateContract({
    abi: IBackingPoolAbi,
    address: zeroAddress,
    functionName: 'swapGivenIn',
    args: [address!, inputAsset!, outputAsset!, inputAmount!, minOutput!],
    account: address,
    query: {
      enabled: !!address && !!inputAsset && !!outputAsset && !!inputAmount && !!minOutput,
    },
  });

  return swapSimulation;
}

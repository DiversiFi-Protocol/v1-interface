import IBackingPoolAbi from '@/abi/IBackingPool';
import { toast } from 'sonner';
import { Address, zeroAddress } from 'viem';
import { useWriteContract } from 'wagmi';
export function useSwap() {
  const { writeContractAsync } = useWriteContract();

  const swap = async (
    recipient: Address,
    inputAsset: Address,
    outputAsset: Address,
    inputAmount: bigint,
    minOutput: bigint
  ) => {
    try {
      const txHash = await writeContractAsync({
        abi: IBackingPoolAbi,
        address: zeroAddress,
        functionName: 'swapGivenIn',
        args: [recipient, inputAsset, outputAsset, inputAmount, minOutput],
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

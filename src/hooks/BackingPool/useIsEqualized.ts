import { useReadContract } from 'wagmi';

import IBackingPoolAbi from '@/abi/IBackingPool';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';

export function useIsEqualized() {
  return useReadContract({
    address: BACKING_POOL_ADDRESS,
    abi: IBackingPoolAbi,
    functionName: 'getIsEqualized',
    query: {
      refetchInterval: 30_000,
    },
  });
}

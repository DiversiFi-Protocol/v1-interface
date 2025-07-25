import { useEffect, useRef } from 'react';

import { useReadContract } from 'wagmi';

import IBackingPoolAbi from '@/abi/IBackingPool';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';

import { queryClient } from '@/lib/queryClient';

export function useIsEqualized() {
  const isEqualizedQuery = useReadContract({
    address: BACKING_POOL_ADDRESS,
    abi: IBackingPoolAbi,
    functionName: 'getIsEqualized',
    query: {
      refetchInterval: 30_000,
    },
  });

  const isEqualized = isEqualizedQuery.data;
  const isEqualizedRef = useRef(isEqualized);

  useEffect(() => {
    const needsInvalidation = isEqualized !== isEqualizedRef.current;

    if (needsInvalidation) {
      queryClient.invalidateQueries({
        queryKey: ['readContract'],
      });
    }

    isEqualizedRef.current = isEqualized;
  }, [isEqualized]);

  return isEqualizedQuery;
}

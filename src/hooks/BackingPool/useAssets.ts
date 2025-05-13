import { Address } from 'viem';
import { useReadContract } from 'wagmi';

import IBackingPool from '@/abi/IBackingPool';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';

export function useGetAssetParams(assetAddress?: Address) {
  return useReadContract({
    address: BACKING_POOL_ADDRESS,
    abi: IBackingPool,
    functionName: 'getAssetParams',
    args: [assetAddress!],
    query: {
      enabled: !!assetAddress,
    },
  });
}

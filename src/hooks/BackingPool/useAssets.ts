import { Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

import IBackingPool from '@/abi/IBackingPool';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

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

function getAssetBalanceContracts() {
  return SUPPORTED_RESERVE_ASSETS.map(
    (asset) =>
      ({
        address: BACKING_POOL_ADDRESS,
        abi: IBackingPool,
        functionName: 'getAssetParams',
        args: [asset.address],
      }) as const
  );
}

export function useGetAssetParamsForAllAssets() {
  return useReadContracts({
    contracts: getAssetBalanceContracts(),
    query: {
      select: (data) => {
        return data.map(({ result, status }) => {
          if (status === 'success') {
            return {
              ...result,
              targetAllocation: Number(result.targetAllocation) / 2 ** 88,
            };
          }

          return undefined;
        });
      },
    },
  });
}

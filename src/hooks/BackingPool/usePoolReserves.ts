import { useMemo } from 'react';

import { formatUnits } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

import IBackingPool from '@/abi/IBackingPool';
import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { NORMALIZED_ASSET_DECIMALS, SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

const QUERY_CONFIG = {
  refetchInterval: 10_000,
  staleTime: 10_000,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
};

export function useGetTotalScaledReserves() {
  const { data, isLoading, isError, isFetching } = useReadContract({
    address: BACKING_POOL_ADDRESS,
    abi: IBackingPool,
    functionName: 'getTotalReservesScaled',
    query: QUERY_CONFIG,
  });

  return {
    totalScaledReserves: data ? formatUnits(data, NORMALIZED_ASSET_DECIMALS) : '',
    isLoading,
    isError,
    isFetching,
  };
}

function getSpecificScaledReservesContracts() {
  return SUPPORTED_RESERVE_ASSETS.map(
    (a) =>
      ({
        address: BACKING_POOL_ADDRESS,
        abi: IBackingPool,
        functionName: 'getSpecificReservesScaled',
        args: [a.address],
      }) as const
  );
}

export function useAllAssetScaledReserves() {
  const scaledReservesQuery = useReadContracts({
    contracts: getSpecificScaledReservesContracts(),
    query: QUERY_CONFIG,
  });

  const scaledReserves = useMemo(() => {
    return scaledReservesQuery.data?.map(({ result, status }, idx) => {
      const asset = SUPPORTED_RESERVE_ASSETS[idx];

      if (status === 'success') {
        return {
          amount: formatUnits(result, NORMALIZED_ASSET_DECIMALS),
          ...asset,
        };
      }

      return {
        amount: '',
        ...asset,
      };
    });
  }, [scaledReservesQuery.data]);

  return {
    scaledReserves,
    isLoading: scaledReservesQuery.isLoading,
    isFetching: scaledReservesQuery.isFetching,
    isError: scaledReservesQuery.isError,
  };
}

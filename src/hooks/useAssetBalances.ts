import { ALL_SUPPORTED_TOKENS } from '@/constants/tokens';
import { useMemo } from 'react';
import { Address, erc20Abi, formatUnits } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';

const QUERY_CONFIG = {
  refetchInterval: 10_000,
  staleTime: 10_000,
};

function getAssetBalanceContracts(walletAddress: Address | undefined) {
  if (!walletAddress) return [];

  return ALL_SUPPORTED_TOKENS.map(
    (asset) =>
      ({
        address: asset.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [walletAddress],
      }) as const
  );
}

export function useAssetBalances() {
  const { address } = useAccount();

  const balanceQuery = useReadContracts({
    contracts: getAssetBalanceContracts(address),
    query: {
      enabled: !!address,
      ...QUERY_CONFIG,
    },
  });

  const balances = useMemo(() => {
    const assetBalances = balanceQuery.data?.map(({ result, status }, idx) => {
      const asset = ALL_SUPPORTED_TOKENS[idx];

      if (status === 'success') {
        return {
          balance: formatUnits(result, asset.decimals),
          ...asset,
        };
      }
      return {
        balance: '',
        ...asset,
      };
    });

    return assetBalances;
  }, [balanceQuery.data]);

  return {
    balances,
    isFetching: balanceQuery.isFetching,
    isLoading: balanceQuery.isLoading,
    isError: balanceQuery.isError,
  };
}

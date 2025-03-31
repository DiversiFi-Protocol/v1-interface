import { TOKEN_ADDRESSES } from '@/constants/tokens';
import { useMemo } from 'react';
import { mainnet } from 'viem/chains';
import { useAccount, useBalance } from 'wagmi';

export const useStableBalances = () => {
  const { address } = useAccount();

  const queryConfig = useMemo(() => {
    return {
      enabled: !!address,
      refetchInterval: 10_000,
      staleTime: 10_000,
    };
  }, [address]);

  const daiQuery = useBalance({
    address,
    token: TOKEN_ADDRESSES.DAI[mainnet.id],
    ...queryConfig,
  });

  const usdcQuery = useBalance({
    address,
    token: TOKEN_ADDRESSES.USDC[mainnet.id],
    ...queryConfig,
  });

  const usdtQuery = useBalance({
    address,
    token: TOKEN_ADDRESSES.USDT[mainnet.id],
    ...queryConfig,
  });

  return {
    daiQuery,
    usdcQuery,
    usdtQuery,
  };
};

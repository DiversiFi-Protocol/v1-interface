import IBackingPoolAbi from '@/abi/IBackingPool';
import { TOKEN_ADDRESSES } from '@/constants/tokens';
import { zeroAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { useBalance, useReadContract } from 'wagmi';

// TODO: Add backing pool address
export function useInsuranceFund() {
  const insuranceFundQuery = useReadContract({
    address: zeroAddress,
    abi: IBackingPoolAbi,
    functionName: 'getInsuranceFund',
    query: {
      enabled: false,
    },
  });

  const insuranceFundAddress = insuranceFundQuery.data;

  const insuranceFundBalanceQuery = useBalance({
    address: insuranceFundAddress,
    token: TOKEN_ADDRESSES.USDC[mainnet.id],
    query: {
      enabled: !!insuranceFundAddress,
    },
  });

  return {
    insuranceFundQuery,
    insuranceFundBalanceQuery,
  };
}

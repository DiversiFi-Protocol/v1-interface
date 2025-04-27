import IBackingPoolAbi from '@/abi/IBackingPool';
import { zeroAddress } from 'viem';
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
    token: zeroAddress, // TODO: Add token address
    query: {
      enabled: false,
    },
  });

  return {
    insuranceFundQuery,
    insuranceFundBalanceQuery,
  };
}

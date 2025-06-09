import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
];

export interface TokenBalanceProps {
  tokenAddress: `0x${string}`;
  walletAddress: `0x${string}`;
  symbol: string;
  decimals: number;
}

export default function TokenBalance({
  tokenAddress,
  walletAddress,
  symbol,
  decimals,
}: TokenBalanceProps) {
  const [formattedBalance, setFormattedBalance] = useState<string | null>(null);

  const { data, isError, isLoading, error } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
    query: {
      refetchInterval: 10_000,
      staleTime: 10_000,
      refetchOnWindowFocus: true,
    },
  });

  useEffect(() => {
    if (typeof data === 'bigint') {
      setFormattedBalance(formatUnits(data, decimals));
    } else {
      setFormattedBalance(null);
    }
  }, [data, decimals]);

  if (isLoading) return <p>Loading balance...</p>;
  if (isError) return <p>Failed to fetch balance: {error?.message}</p>;
  if (formattedBalance === null) return <p>No balance data</p>;

  return (
    <p>
      Balance: {formattedBalance} {symbol}
    </p>
  );
}

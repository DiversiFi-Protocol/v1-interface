import { useAccount } from 'wagmi';

import TokenBalance from './TokenBalance';

export default function MultiTokenBalances() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return <p>Please connect your wallet to view balances.</p>;
  }
  return (
    <div>
      <TokenBalance
        tokenAddress="0x6B175474E89094C44Da98b954EedeAC495271d0F" // DAI
        walletAddress={address}
        symbol="DFiUSD"
        decimals={18}
      />
      <TokenBalance
        tokenAddress="0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" // USDC
        walletAddress={address}
        symbol="TK0"
        decimals={18}
      />
      <TokenBalance
        tokenAddress="0xdAC17F958D2ee523a2206206994597C13D831ec7" // USDT
        walletAddress={address}
        symbol="TK1"
        decimals={20}
      />
      <TokenBalance
        tokenAddress="0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2" // WETH
        walletAddress={address}
        symbol="TK2"
        decimals={6}
      />
    </div>
  );
}

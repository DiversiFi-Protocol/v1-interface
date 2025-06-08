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
        tokenAddress="0x2cEe63EFE079630b420Ed8fdF53c0a5c9aa880F2" // DAI
        walletAddress={address}
        symbol="DFiUSD"
        decimals={18}
      />
      <TokenBalance
        tokenAddress="0xa814D1722125151c1BcD363E79a60d59BFb8F53e" // USDC
        walletAddress={address}
        symbol="TK0"
        decimals={18}
      />
      <TokenBalance
        tokenAddress="0x1537e0CD1eAC6Dc732d0847139d9eACAEc323Db0" // USDT
        walletAddress={address}
        symbol="TK1"
        decimals={20}
      />
      <TokenBalance
        tokenAddress="0x8E9c43c72ab3a49Fdd242e5BB44B337e94979dd1" // WETH
        walletAddress={address}
        symbol="TK2"
        decimals={6}
      />
    </div>
  );
}

import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

import { injected, metaMask, walletConnect } from 'wagmi/connectors';

import { envVar } from '@/constants/environment';
import { queryClient } from '@/lib/queryClient';

const showHardhat = import.meta.env.MODE === 'development';

const alchemyMainnet = 'https://eth-mainnet.g.alchemy.com/v2/YOUR_MAINNET_KEY';
const alchemySepolia = 'https://eth-sepolia.g.alchemy.com/v2/7GwBcdnuSTJywivj2pPW4';

const chains = showHardhat
  ? ([hardhat, sepolia, mainnet] as const)
  : ([sepolia, mainnet] as const);

const connectors = [
  injected(),
  metaMask(),
  walletConnect({
    projectId: envVar.walletConnectProjectId || '',
  }),
];

const transports = {
  [hardhat.id]: http('http://127.0.0.1:8545/'),
  [sepolia.id]: http(alchemySepolia),
  [mainnet.id]: http(alchemyMainnet),
};

const config = createConfig({
  chains,
  connectors,
  transports,
  ssr: true,
});

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

import { envVar } from '@/constants/environment';

import { queryClient } from '@/lib/queryClient';

const showHardhat = import.meta.env.MODE === 'development';
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY;

const alchemyMainnet = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
const alchemySepolia = `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`;

const wagmiConfig: Pick<Parameters<typeof createConfig>[0], 'chains' | 'transports'> = showHardhat
  ? {
      chains: [mainnet, sepolia, hardhat],
      transports: {
        [hardhat.id]: http('http://127.0.0.1:8545/'),
        [sepolia.id]: http(alchemySepolia),
        [mainnet.id]: http(alchemyMainnet),
      },
    }
  : {
      chains: [ mainnet, sepolia],
      transports: {
        [sepolia.id]: http(alchemySepolia),
        [mainnet.id]: http(alchemyMainnet),
      },
    };

const config = createConfig(
  getDefaultConfig({
    appName: 'DiversiFi',
    appDescription: 'Tokenized assets for DiversiFi-ing your portfolio',
    appUrl: 'https://app.diversifi.tech',
    walletConnectProjectId: envVar.walletConnectProjectId || '',
    ...wagmiConfig,
  })
);

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

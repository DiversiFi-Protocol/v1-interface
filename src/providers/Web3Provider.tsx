import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';

import { envVar } from '@/constants/environment';

import { queryClient } from '@/lib/queryClient';

const showHardhat = import.meta.env.MODE === 'development';

const alchemyMainnet = 'https://eth-mainnet.g.alchemy.com/v2/7GwBcdnuSTJywivj2pPW4';
const alchemySepolia = 'https://eth-sepolia.g.alchemy.com/v2/7GwBcdnuSTJywivj2pPW4';

const wagmiConfig: Pick<Parameters<typeof createConfig>[0], 'chains' | 'transports'> = showHardhat
  ? {
      chains: [sepolia, hardhat, mainnet],
      transports: {
        [hardhat.id]: http('http://127.0.0.1:8545/'),
        [sepolia.id]: http(alchemySepolia),
        [mainnet.id]: http(alchemyMainnet),
      },
    }
  : {
      chains: [sepolia],
      transports: {
        [sepolia.id]: http(alchemySepolia),
      },
    };

const config = createConfig(
  getDefaultConfig({
    appName: 'DiversiFi',
    appDescription: 'Tokenized assets for DiversiFi-ing your portfolio',
    appUrl: 'https://diversifi.tech',
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

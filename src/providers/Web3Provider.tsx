import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';

import { envVar } from '@/constants/environment';

import { queryClient } from '@/lib/queryClient';

const showHardhat = import.meta.env.MODE === 'development';

const wagmiConfig: Pick = showHardhat
  ? {
      chains: [mainnet, sepolia, hardhat],
      transports: {
        [hardhat.id]: http('http://127.0.0.1:8545/'),
        [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/'),
        [mainnet.id]: http(),
      },
    }
  : {
      chains: [mainnet, sepolia],
      transports: {
        [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/'),
        [mainnet.id]: http(),
      },
    };

const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'DiversiFi Interface',
    // Optional links
    appDescription: 'DiversiFi Interface',
    appUrl: '',
    // Your alchemy/infura api key
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

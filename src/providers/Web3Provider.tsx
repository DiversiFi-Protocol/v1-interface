import { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';

import { envVar } from '@/constants/environment';

import { queryClient } from '@/lib/queryClient';

const showHarhat = import.meta.env.MODE === 'development';

const wagmiConfig: Pick<Parameters<typeof createConfig>[0], 'chains' | 'transports'> = showHarhat
  ? {
      chains: [mainnet, sepolia, hardhat],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [hardhat.id]: http('http://127.0.0.1:8545/'),
      },
    }
  : {
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    };

const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'USD1 Interface',
    // Optional links
    appDescription: 'USD1 Interface',
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

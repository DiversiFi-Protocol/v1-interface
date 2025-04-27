import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { hardhat, mainnet } from 'wagmi/chains';

const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'USD1 Interface',
    // Optional links
    appDescription: 'USD1 Interface',
    appUrl: '',
    // Chains you want to support
    chains: [mainnet, hardhat],
    // Your alchemy/infura api key
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
    transports: {
      [mainnet.id]: http(),
      [hardhat.id]: http('http://127.0.0.1:8545/'),
    },
  })
);

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

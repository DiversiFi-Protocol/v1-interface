import { createContext, useContext, useEffect } from 'react';

import type { Chain } from 'viem';
import { useChainId, useSwitchChain } from 'wagmi';

import { envVar } from '@/constants/environment';

type ChainContextType = {
  chain: number;
  supportedChains: readonly Chain[];
  switchChain: ({ chainId }: { chainId: number }) => void;
};

const ChainContext = createContext<ChainContextType | undefined>(undefined);

const DEFAULT_CHAIN_ID = envVar.chainId;

export const ChainProvider = ({ children }: { children: React.ReactNode }) => {
  const chainId = useChainId();
  const { chains: supportedChains, switchChain } = useSwitchChain();

  // If the chain is not supported, set it to the default chainId
  useEffect(() => {
    if (!supportedChains.some((chain) => chain.id === chainId)) {
      switchChain({ chainId: DEFAULT_CHAIN_ID });
    }
  }, [chainId, supportedChains, switchChain]);

  return (
    <ChainContext.Provider value={{ chain: chainId, supportedChains, switchChain }}>
      {children}
    </ChainContext.Provider>
  );
};

export const useChainLocal = () => {
  const context = useContext(ChainContext);
  if (!context) {
    throw new Error('useChainLocal must be used within a ChainProvider');
  }

  return context;
};

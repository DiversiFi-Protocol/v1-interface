// Context provider for theme
import { createContext, useContext, useEffect, useMemo } from 'react';

import { useAccount, useDisconnect, useReadContract } from 'wagmi';

import chainalysisOracleAbi from '@/abi/chainalysisOracle';

const ComplianceContext = createContext<boolean | undefined>(undefined);

export const ComplianceProvider = ({ children }: { children: React.ReactNode }) => {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const shouldQuery = isConnected && !!address;

  const isSanctionedQuery = useReadContract({
    query: {
      enabled: shouldQuery,
    },
    address: '0x40C57923924B5c5c5455c48D93317139ADDaC8fb', // Chainalysis Oracle Mainnet address
    abi: chainalysisOracleAbi,
    functionName: 'isSanctioned',
    args: [address!],
  });

  const isSanctioned = useMemo(() => {
    return shouldQuery ? isSanctionedQuery.data : undefined;
  }, [isSanctionedQuery.data, shouldQuery]);

  console.log(isSanctionedQuery.data, isSanctioned, shouldQuery);

  useEffect(() => {
    if (isSanctioned && isConnected) {
      disconnect();
    }
  }, [isSanctioned, isConnected, disconnect]);

  return <ComplianceContext.Provider value={isSanctioned}>{children}</ComplianceContext.Provider>;
};

import { useMemo } from 'react';

import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import { ExternalLinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Address, erc20Abi, formatUnits, maxUint256 } from 'viem';
import { useAccount, useReadContracts, useWalletClient } from 'wagmi';

import { envVar } from '@/constants/environment';
import { TOKEN_DECIMALS } from '@/constants/numbers';
import { EMPTY_ARR } from '@/constants/objects';
import { ALL_SUPPORTED_TOKENS } from '@/constants/tokens';

import { useAssetBalances } from '@/hooks/useAssetBalances';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { truncateAddress } from '@/lib/addressUtils';
import { isEmptyObj } from '@/lib/isEmptyObj';
import { isTruthy } from '@/lib/isTruthy';
import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';
import { queryClient } from '@/lib/queryClient';

export default function AllowancePage() {
  const { address } = useAccount();
  const signer = useWalletClient();

  const allowanceContracts = useMemo(() => {
    return ALL_SUPPORTED_TOKENS.map((asset) => ({
      address: asset.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, envVar.backingPoolAddress],
    }));
  }, [address]);

  const allowances = useReadContracts({
    contracts: allowanceContracts,
    query: {
      enabled: !!address,
      refetchInterval: 5_000,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 5_000,
    },
  });

  const { balances, isLoading: isBalancesLoading } = useAssetBalances();
  const mapOfBalances = useMemo(() => {
    return objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address, a]));
  }, [balances]);

  const data: Array<{
    symbol: string;
    address: Address;
    balance: string;
    allowance: string;
    decimals: number;
  }> = useMemo(() => {
    if (allowances.data == null || mapOfBalances == null || isEmptyObj(mapOfBalances)) {
      return [];
    }

    return (
      allowances.data
        .map((allowance, idx) => {
          if (allowance.status !== 'success') {
            return undefined;
          }

          const asset = ALL_SUPPORTED_TOKENS[idx];
          const allowanceBigInt = allowance.result as bigint;
          const assetAndBalance = mapOfBalances[asset.address];
          const isMax = allowanceBigInt === maxUint256;
          return {
            ...assetAndBalance,
            allowance: isMax ? 'Max' : formatUnits(allowanceBigInt, assetAndBalance.decimals),
          };
        })
        .filter(isTruthy) ?? []
    );
  }, [allowances.data, mapOfBalances]);

  const revokeAllowance = async (assetAddress: Address) => {
    if (!signer.data) {
      toast.error('No signer found');
      return;
    }

    const txHash = await signer.data.writeContract({
      address: assetAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [envVar.backingPoolAddress, 0n],
    });

    toast.success('Allowance revoked', {
      action: {
        label: 'View tx',
        onClick: () => {
          window.open(`https://etherscan.io/tx/${txHash}`, '_blank');
        },
      },
    });

    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: allowances.queryKey,
      });
    }, 2_000);
  };

  const isLoading = allowances.isLoading || isBalancesLoading;

  return (
    <SingleColumnLayout>
      <h3 className="text-2xl font-bold py-4 px-4">Allowances</h3>
      <Card className="">
        <div className="grid grid-cols-5 p-4 border-b border-border border-solid">
          <span>Asset</span>
          <span>Address</span>
          <span>Balance</span>
          <span>Allowance</span>
          <span className="flex justify-end">Actions</span>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : (
          data.map((d) => (
            <div
              className="grid grid-cols-5 p-4 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border [&:not(:last-child)]:border-solid"
              key={d.address}
            >
              <span>{d.symbol}</span>
              <span>
                <a
                  className="row gap-1"
                  href={`https://etherscan.io/address/${d.address}`}
                  target="_blank"
                >
                  {truncateAddress(d.address)}
                  <ExternalLinkIcon className="w-4 h-4" />
                </a>
              </span>
              <span>{MustBigNumber(d.balance).toFixed(TOKEN_DECIMALS)}</span>
              <span>{d.allowance}</span>
              <span className="flex justify-end">
                <Button disabled={d.allowance === '0'} onClick={() => revokeAllowance(d.address)}>
                  Revoke
                </Button>
              </span>
            </div>
          ))
        )}
      </Card>
    </SingleColumnLayout>
  );
}

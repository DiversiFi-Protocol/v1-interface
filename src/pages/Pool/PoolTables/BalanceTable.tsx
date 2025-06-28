import { useCallback, useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLinkIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Address, erc20Abi, formatUnits, maxUint256 } from 'viem';
import { useAccount, useWalletClient, useReadContracts } from 'wagmi';

import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { EMPTY_ARR } from '@/constants/objects';
import { ALL_SUPPORTED_TOKENS } from '@/constants/tokens';

import { useAssetBalances } from '@/hooks/useAssetBalances';

import AssetIcon from '@/components/AssetIcon';
import { DataTableColumnHeader } from '@/components/DataTable/ColumnHeader';
import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';

import { truncateAddress } from '@/lib/addressUtils';
import { isEmptyObj } from '@/lib/isEmptyObj';
import { isTruthy } from '@/lib/isTruthy';
import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';
import { queryClient } from '@/lib/queryClient';

type BalanceTableRow = {
  symbol: string;
  address: Address;
  balance: string;
  allowance: string;
  decimals: number;
};

export function BalanceTable() {
  const { address } = useAccount();
  const signer = useWalletClient();

  const allowanceContracts = useMemo(() => {
    return ALL_SUPPORTED_TOKENS.map((asset) => ({
      address: asset.address,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, BACKING_POOL_ADDRESS],
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

  const revokeAllowance = useCallback(
    async (assetAddress: Address) => {
      if (!signer.data) {
        toast.error('No signer found');
        return;
      }

      const txHash = await signer.data.writeContract({
        address: assetAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BACKING_POOL_ADDRESS, 0n],
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
    },
    [signer, allowances.queryKey]
  );

  const isLoading = allowances.isLoading || isBalancesLoading;

  const columns: ColumnDef<BalanceTableRow>[] = useMemo(
    () => [
      {
        accessorKey: 'symbol',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Asset" />,
        cell: ({ row }) => {
          const symbol = row.getValue<string>('symbol');
          return (
            <div className="row gap-2 font-mono">
              <AssetIcon asset={symbol} />
              {symbol}
            </div>
          );
        },
      },
      {
        accessorKey: 'address',
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
        cell: ({ row }) => {
          return (
            <div>
              <a
                className="row gap-1 font-mono"
                href={`https://etherscan.io/address/${row.getValue('address')}`}
                target="_blank"
              >
                {truncateAddress(row.getValue('address'))}
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            </div>
          );
        },
      },
      {
        accessorKey: 'balance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
        cell: ({ row }) => {
          return (
            <div className="font-mono">{MustBigNumber(row.getValue('balance')).toFixed(2)}</div>
          );
        },
      },
      {
        accessorKey: 'allowance',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Allowance" />,
        cell: ({ row }) => {
          return <div className="font-mono">{row.getValue('allowance')}</div>;
        },
      },
      {
        accessorKey: 'actions',
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
        cell: ({ row }) => {
          const actions = [];

          if (
            row.getValue<string>('allowance') !== 'Max' &&
            MustBigNumber(row.getValue<string>('allowance')).gt(0)
          ) {
            actions.push(
              <Button
                disabled={signer == null}
                onClick={() => revokeAllowance(row.original.address)}
              >
                Revoke
              </Button>
            );
          }

          return <div>{actions}</div>;
        },
      },
    ],
    [signer, revokeAllowance]
  );

  return (
    <div className="border border-solid border-border rounded-md">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={data} />
      )}
    </div>
  );
}

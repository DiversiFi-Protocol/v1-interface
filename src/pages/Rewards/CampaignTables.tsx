import { useMemo, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { formatUnits } from 'viem';

import { MerklCampaign } from '@/constants/merkl';
import { DFI_MERKL_POINT_TOKEN } from '@/constants/tokens';

import AssetIcon from '@/components/AssetIcon';
import { DataTableColumnHeader } from '@/components/DataTable/ColumnHeader';
import { DataTable } from '@/components/DataTable/DataTable';
import { IconSelect, Select } from '@/components/ui/select';

import { merklClient } from '@/lib/merkl';
import { formatNumber } from '@/lib/numbers';
import { cn } from '@/lib/tw';

type CampaignStatusLabel = 'Live' | 'Upcoming' | 'Ended';

const STATUS_OPTIONS: readonly ('All' | CampaignStatusLabel)[] = [
  'All',
  'Live',
  'Upcoming',
  'Ended',
] as const;

function campaignStatus(startSec: number, endSec: number): CampaignStatusLabel {
  const nowSec = Date.now() / 1000;
  if (nowSec < startSec) return 'Upcoming';
  if (nowSec > endSec) return 'Ended';
  return 'Live';
}

function useLiveCampaigns() {
  return useQuery({
    queryKey: ['merkl-live-campaigns'],
    queryFn: async () => {
      const response = await merklClient.campaigns.get({
        query: { tokenAddress: DFI_MERKL_POINT_TOKEN.address },
      });
      if (response.status !== 200) {
        throw new Error(`Failed to fetch campaigns: ${response.error}`);
      }
      return response.data as unknown as MerklCampaign[];
    },
    refetchInterval: 1000 * 60 * 60,
  });
}

const columns: ColumnDef<MerklCampaign>[] = [
  {
    id: 'pool',
    header: 'Pool',
    accessorFn: (row) => row.params?.symbolCurrency0 ?? '',
    enableSorting: false,
    cell: ({ row }) => {
      const { symbolCurrency0, symbolCurrency1 } = row.original.params ?? {};
      if (!symbolCurrency0 || !symbolCurrency1) {
        return <div className="font-medium">{row.original.campaignId}</div>;
      }
      return (
        <div className="row items-center gap-2 font-medium">
          <div className="row items-center -space-x-1.5">
            <AssetIcon asset={symbolCurrency0} size="sm" />
            <AssetIcon asset={symbolCurrency1} size="sm" />
          </div>
          <span>
            {symbolCurrency0} / {symbolCurrency1}
          </span>
        </div>
      );
    },
  },
  {
    id: 'chain',
    header: 'Chain',
    accessorFn: (row) => row.chain?.name ?? '',
    enableSorting: false,
    cell: ({ row }) => {
      const { name, icon } = row.original.chain ?? {};
      return (
        <div className="row items-center gap-2">
          {icon && <img src={icon} alt={name} className="w-4 h-4" />}
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: (row) => campaignStatus(row.startTimestamp, row.endTimestamp),
    enableSorting: false,
    cell: ({ row }) => {
      const status = campaignStatus(row.original.startTimestamp, row.original.endTimestamp);
      return (
        <div
          className={cn(
            'rounded-full px-2 py-1 text-xs w-fit',
            status === 'Live' && 'text-green-500 bg-green-500/10',
            status === 'Upcoming' && 'text-yellow-500 bg-yellow-500/10',
            status === 'Ended' && 'text-red-500 bg-red-500/10'
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: 'apr',
    accessorKey: 'apr',
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="APR" />,
    cell: ({ row }) => {
      const apr = row.original.apr;
      if (apr == null) return <div>-</div>;
      return (
        <div>
          {formatNumber({
            value: apr / 100,
            type: 'percent',
            options: { maximumFractionDigits: 2 },
          })}
        </div>
      );
    },
  },
  {
    id: 'dailyRewards',
    accessorKey: 'dailyRewards',
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Daily rewards" />,
    cell: ({ row }) => {
      const daily = row.original.dailyRewards;
      if (daily == null) return <div>-</div>;
      return <div>{formatNumber({ value: daily, options: { maximumFractionDigits: 2 } })} Pts</div>;
    },
  },
  {
    id: 'amount',
    enableSorting: true,
    accessorFn: (row) => {
      if (!row.amount || !row.rewardToken) return 0;
      return Number(formatUnits(BigInt(row.amount), row.rewardToken.decimals));
    },
    sortingFn: 'basic',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total rewards" />,
    cell: ({ row }) => {
      const { amount, rewardToken } = row.original;
      if (!amount || !rewardToken) return <div>-</div>;
      const formatted = formatUnits(BigInt(amount), rewardToken.decimals);
      return (
        <div>{formatNumber({ value: formatted, options: { maximumFractionDigits: 2 } })} Pts</div>
      );
    },
  },
  {
    id: 'startTimestamp',
    accessorKey: 'startTimestamp',
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start" />,
    cell: ({ row }) => (
      <div>{new Date(row.original.startTimestamp * 1000).toLocaleDateString()}</div>
    ),
  },
  {
    id: 'endTimestamp',
    accessorKey: 'endTimestamp',
    enableSorting: true,
    header: ({ column }) => <DataTableColumnHeader column={column} title="End" />,
    cell: ({ row }) => <div>{new Date(row.original.endTimestamp * 1000).toLocaleDateString()}</div>,
  },
];

type Props = {
  title: string;
  campaignIds?: Set<string>;
  emptyMessage?: string;
  showFilters?: boolean;
};

export default function CampaignTables({
  title,
  campaignIds,
  emptyMessage,
  showFilters = false,
}: Props) {
  const { data, isLoading } = useLiveCampaigns();

  const [poolFilter, setPoolFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | CampaignStatusLabel>('All');

  const scopedData = useMemo(() => {
    if (!data) return [];
    if (!campaignIds) return data;
    return data.filter((c) => campaignIds.has(c.campaignId));
  }, [data, campaignIds]);

  const poolOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of scopedData) {
      const s0 = c.params?.symbolCurrency0;
      const s1 = c.params?.symbolCurrency1;
      if (s0) set.add(s0);
      if (s1) set.add(s1);
    }
    return [
      { value: 'All', label: 'All pools' },
      ...Array.from(set)
        .sort()
        .map((sym) => ({
          value: sym,
          label: sym,
          icon: <AssetIcon asset={sym} size="sm" />,
        })),
    ];
  }, [scopedData]);

  const rows = useMemo(() => {
    return scopedData.filter((c) => {
      if (poolFilter !== 'All') {
        const s0 = c.params?.symbolCurrency0;
        const s1 = c.params?.symbolCurrency1;
        if (s0 !== poolFilter && s1 !== poolFilter) return false;
      }
      if (statusFilter !== 'All') {
        if (campaignStatus(c.startTimestamp, c.endTimestamp) !== statusFilter) return false;
      }
      return true;
    });
  }, [scopedData, poolFilter, statusFilter]);

  return (
    <div className="grid gap-2">
      <div className="row items-center justify-between p-1 gap-4 flex-wrap">
        <h2 className="text-lg font-semibold">{title}</h2>

        {showFilters && !isLoading && scopedData.length > 0 && (
          <div className="row items-center gap-2 flex-wrap">
            <label className="row items-center gap-2 text-sm text-muted-foreground">
              Pool
              <IconSelect
                options={poolOptions}
                value={poolFilter}
                onChange={setPoolFilter}
              />
            </label>
            <label className="row items-center gap-2 text-sm text-muted-foreground">
              Status
              <Select
                options={STATUS_OPTIONS as readonly string[]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | CampaignStatusLabel)}
              />
            </label>
          </div>
        )}
      </div>

      <div className="border border-solid border-border rounded-md">
        {isLoading ? (
          <div className="flex justify-center items-center h-full min-h-[12.5rem]">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : rows.length === 0 && emptyMessage ? (
          <div className="flex justify-center items-center h-full min-h-[6rem] text-sm text-muted-foreground p-4">
            {emptyMessage}
          </div>
        ) : (
          <DataTable columns={columns} data={rows} />
        )}
      </div>
    </div>
  );
}

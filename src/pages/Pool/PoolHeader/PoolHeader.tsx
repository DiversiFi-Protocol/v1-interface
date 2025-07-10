import { Copy, Forward, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import { useGetTotalScaledReserves } from '@/hooks/BackingPool/usePoolReserves';
import { useBreakpoints } from '@/hooks/useBreakpoints';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { truncateAddress } from '@/lib/addressUtils';
import { formatNumber } from '@/lib/numbers';
import { cn } from '@/lib/tw';

export default function PoolHeader() {
  const { isTablet } = useBreakpoints();

  const { totalScaledReserves, isLoading: totalScaledReservesLoading } =
    useGetTotalScaledReserves();

  const totalReservesFormatted = formatNumber({
    value: totalScaledReserves,
    type: 'number',
    options: {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  });

  const onCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${label} to clipboard`);
  };

  return (
    <Card className="p-6 gap-2 flexColumn">
      <div className={cn('row justify-between', isTablet && 'flexColumn items-start gap-2')}>
        <div className="row gap-2">
          <AssetIcon asset="DFiUSD" size="lg" />
          <h1 className="text-2xl font-bold">DFiUSD Pool</h1>
          <a
            className="row gap-1 whitespace-nowrap"
            href={`https://etherscan.io/address/${BACKING_POOL_ADDRESS}`}
            target="_blank"
          >
            {truncateAddress(BACKING_POOL_ADDRESS)}
          </a>
          <Button
            className="[&_svg]:size-4 size-5 min-w-5 min-h-5 p-0"
            variant="ghost"
            size="icon"
            onClick={() => onCopy(BACKING_POOL_ADDRESS, 'pool address')}
          >
            <Copy />
          </Button>

          <Button
            className="[&_svg]:size-5 size-5 min-w-5 min-h-5 p-0"
            variant="ghost"
            size="icon"
            onClick={() => onCopy(window.location.href, 'pool link')}
          >
            <Forward />
          </Button>
        </div>

        <div className="row relative">
          {SUPPORTED_RESERVE_ASSETS.map((asset, idx) => (
            <div
              key={asset.symbol}
              className={cn(
                'bg-background row gap-2 rounded-3xl border-border border-[1px] border-solid py-1 px-3 relative',
                idx !== 0 && 'pl-8',
                idx !== SUPPORTED_RESERVE_ASSETS.length - 1 && '-mr-6'
              )}
              style={{ zIndex: SUPPORTED_RESERVE_ASSETS.length - idx }}
            >
              <AssetIcon asset={asset.symbol} />
              <span>{asset.symbol}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="row gap-2">
        <h2 className="text-lg font-semibold">Pool Details</h2>
        <div className="row gap-2">
          <span className="text-muted-foreground">Total Reserves</span>
          <span className="font-semibold">
            {totalScaledReservesLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              `${totalReservesFormatted}`
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}

import { Clipboard, Forward } from 'lucide-react';
import { toast } from 'sonner';

import { BACKING_POOL_ADDRESS } from '@/constants/contracts';
import { SUPPORTED_RESERVE_ASSETS } from '@/constants/tokens';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { truncateAddress } from '@/lib/addressUtils';
import { cn } from '@/lib/tw';

export default function PoolHeader() {
  const onCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied pool address to clipboard');
  };

  return (
    <Card className="p-6">
      <div className="row justify-between">
        <div className="row gap-2">
          <h1 className="text-2xl font-bold">USD1 Pool</h1>
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
            onClick={() => onCopy(BACKING_POOL_ADDRESS)}
          >
            <Clipboard />
          </Button>

          <Button
            className="[&_svg]:size-5 size-5 min-w-5 min-h-5 p-0"
            variant="ghost"
            size="icon"
            onClick={() => onCopy(BACKING_POOL_ADDRESS)}
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
          <span className="text-muted-foreground">Utilization</span>
          <span className="font-semibold">100%</span>
        </div>
      </div>
    </Card>
  );
}

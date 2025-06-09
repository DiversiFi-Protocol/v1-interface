import { BackpackIcon } from 'lucide-react';

import { useAssetBalances } from '@/hooks/useAssetBalances';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { MustBigNumber } from '@/lib/numbers';

export function InventoryPopover({ className }: { className?: string }) {
  const { balances } = useAssetBalances();

  const inventory = (
    <div className="flexColumn gap-1">
      {balances?.map((balance) => (
        <div key={balance.address} className="row gap-4 justify-between">
          <div className="row gap-2">
            <AssetIcon asset={balance.symbol} />
            <span className="font-mono">{balance.symbol}:</span>
          </div>
          <span className="font-mono">{MustBigNumber(balance.balance).toFormat(4)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className} disabled={balances == null} variant="ghost">
          <BackpackIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border border-solid border-accent px-4 py-2 w-fit text-xs">
        {inventory}
      </PopoverContent>
    </Popover>
  );
}

// Implement a dialog that allows the user to select a token

import AssetIcon from '@/components/AssetIcon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EMPTY_ARR } from '@/constants/objects';
import { ALL_SUPPORTED_TOKENS, SupportedAsset } from '@/constants/tokens';
import { useAssetBalances } from '@/hooks/useAssetBalances';
import { MustBigNumber } from '@/lib/numbers';
import { objectFromEntries } from '@/lib/objectHelpers';
import { useMemo, useState } from 'react';

function TokenSelectDialogItem({
  asset,
  setOpen,
  balance,
  onSelectToken,
}: {
  asset: SupportedAsset;
  setOpen: (open: boolean) => void;
  balance?: string;
  onSelectToken: (token: SupportedAsset) => void;
}) {
  return (
    <button
      key={asset.symbol}
      className="relative row size-[100px] border border-border gap-2 justify-center"
      onClick={() => {
        onSelectToken(asset);
        setOpen(false);
      }}
    >
      <div className="flexColumn items-center gap-1">
        <AssetIcon size="md" asset={asset.symbol} />
        {asset.symbol}
      </div>
      {balance && (
        <div className="row gap-2 bg-background absolute bottom-0 right-0 mb-[-0.5rem] mr-[-1rem] text-xs px-1">
          <span>{balance}</span>
        </div>
      )}
    </button>
  );
}

export default function TokenSelectDialog({
  children,
  onSelectToken,
}: {
  children: React.ReactNode;
  onSelectToken: (token: SupportedAsset) => void;
}) {
  const [open, setOpen] = useState(false);
  const { balances } = useAssetBalances();

  const mapOfBalances = useMemo(() => {
    return objectFromEntries((balances ?? EMPTY_ARR).map((a) => [a.address, a]));
  }, [balances]);

  const { tokensWithBalance, tokensWithoutBalance } = useMemo(() => {
    const tokensWithBalance: SupportedAsset[] = [];
    const tokensWithoutBalance: SupportedAsset[] = [];

    ALL_SUPPORTED_TOKENS.forEach((asset) => {
      if (MustBigNumber(mapOfBalances[asset.address]?.balance).gt(0)) {
        tokensWithBalance.push(asset);
      } else {
        tokensWithoutBalance.push(asset);
      }
    });

    return { tokensWithBalance, tokensWithoutBalance };
  }, [mapOfBalances]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Token</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-4 mb-4">
          {tokensWithBalance.map((asset) => (
            <TokenSelectDialogItem
              key={asset.symbol}
              asset={asset}
              setOpen={setOpen}
              balance={MustBigNumber(mapOfBalances[asset.address]?.balance).toFormat(2, {
                decimalSeparator: '.',
                groupSeparator: ',',
                groupSize: 3,
              })}
              onSelectToken={onSelectToken}
            />
          ))}

          {tokensWithoutBalance.length > 0 && (
            <div className="flex w-full flex-wrap gap-4 mt-2 mb-4 border-border border-t-2 pt-4 border-dashed">
              {tokensWithoutBalance.map((asset) => (
                <TokenSelectDialogItem
                  key={asset.symbol}
                  asset={asset}
                  setOpen={setOpen}
                  onSelectToken={onSelectToken}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

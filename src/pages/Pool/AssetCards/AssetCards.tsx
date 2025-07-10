import { Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SUPPORTED_RESERVE_ASSETS, SupportedAsset } from '@/constants/tokens';

import { useGetAssetParams } from '@/hooks/BackingPool/useAssets';
import {
  useAllAssetScaledReserves,
  useGetTotalScaledReserves,
} from '@/hooks/BackingPool/usePoolReserves';

// import { useGetAssetParams } from '@/hooks/BackingPool/useAssets';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { truncateAddress } from '@/lib/addressUtils';
import { formatNumber, MustBigNumber } from '@/lib/numbers';

function AssetCard({
  asset,
  onCopy,
}: {
  asset: SupportedAsset;
  onCopy: (address: string) => void;
}) {
  const { data: assetParamsData, isLoading } = useGetAssetParams(asset.address);
  const { scaledReserves, isLoading: scaledReservesLoading } = useAllAssetScaledReserves();
  const { totalScaledReserves, isLoading: totalScaledReservesLoading } =
    useGetTotalScaledReserves();

  const scaledReserve = scaledReserves?.find(({ symbol }) => symbol === asset.symbol);
  const scaledReserveAmount = scaledReserve?.amount;
  const scaledReserveAmountFormatted = formatNumber({
    value: scaledReserveAmount,
    type: 'number',
    options: {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  });

  const currentAllocationBN = MustBigNumber(scaledReserveAmount).div(totalScaledReserves);
  const currentAllocationFormatted = formatNumber({
    value: currentAllocationBN.toFixed(2),
    type: 'percent',
    options: {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  });

  const targetAllocation = assetParamsData?.targetAllocation
    ? Number(assetParamsData.targetAllocation) / 2 ** 88
    : 0;

  const targetAllocationBN = MustBigNumber(targetAllocation);
  const targetAllocationFormatted = targetAllocationBN.times(100).toFixed(2);

  return (
    <Card key={asset.symbol} className="flex-1">
      <CardHeader className="flex flex-row items-center gap-2">
        <AssetIcon size="xl" asset={asset.symbol} />
        <div className="flexColumn gap-1">
          <CardTitle className="flex flex-row gap-1">{asset.symbol}</CardTitle>
          <CardDescription className="row gap-1">
            <a href={`https://etherscan.io/address/${asset.address}`} target="_blank">
              {truncateAddress(asset.address)}
            </a>
            <Button
              className="[&_svg]:size-3 size-5 min-w-5 min-h-5 p-0"
              variant="ghost"
              size="icon"
              onClick={() => onCopy(asset.address)}
            >
              <Copy />
            </Button>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flexColumn gap-2 whitespace-nowrap text-sm">
          <div className="row gap-2 justify-between">
            <span className="text-muted-foreground">Current Reserve</span>
            <span className="font-semibold font-mono">
              {scaledReservesLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `${scaledReserveAmountFormatted}`
              )}
            </span>
          </div>

          <div className="row gap-2 justify-between">
            <span className="text-muted-foreground">Current Pool Allocation</span>
            <span className="font-semibold font-mono">
              {scaledReservesLoading || totalScaledReservesLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `${currentAllocationFormatted}`
              )}
            </span>
          </div>

          <div className="row gap-2 justify-between">
            <span className="text-muted-foreground">Target Pool Allocation</span>
            <span className="font-semibold font-mono">
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                `${targetAllocationFormatted}%`
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AssetCards() {
  const onCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied token address to clipboard');
  };
  return (
    <div className="grid gap-1">
      <div className="flexColumn gap-1">
        <h2 className="text-lg font-semibold p-1">Reserve Assets</h2>
        {SUPPORTED_RESERVE_ASSETS.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} onCopy={onCopy} />
        ))}
      </div>
    </div>
  );
}

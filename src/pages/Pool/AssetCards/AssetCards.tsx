import { CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatUnits } from 'viem';

import { SUPPORTED_RESERVE_ASSETS, SupportedAsset } from '@/constants/tokens';

import { useGetAssetParams } from '@/hooks/BackingPool/useAssets';

// import { useGetAssetParams } from '@/hooks/BackingPool/useAssets';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { truncateAddress } from '@/lib/addressUtils';
import { formatNumber } from '@/lib/numbers';

function AssetCard({
  asset,
  onCopy,
}: {
  asset: SupportedAsset;
  onCopy: (address: string) => void;
}) {
  const { data: assetParamsData, isLoading } = useGetAssetParams(asset.address);

  const targetAllocation = formatUnits(
    assetParamsData?.targetAllocation ?? 0n,
    assetParamsData?.decimals ?? 0
  );
  const formattedTargetAllocation = formatNumber({
    value: targetAllocation,
    type: 'number',
    options: {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  });

  return (
    <Card key={asset.symbol} className="flex-1">
      <CardHeader className="flex flex-row items-center gap-2">
        <AssetIcon size="xl" asset={asset.symbol} />
        <div className="flexColumn gap-1">
          <CardTitle className="flex flex-row gap-1">
            {asset.symbol}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="row gap-1 hover:border-transparent cursor-help p-0">
                  <CheckCircle2 className="size-4 text-green-500" />
                  <CheckCircle2 className="size-4 text-green-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Deposits: Enabled</p>
                  <p>Swaps: Enabled</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
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
            <span className="text-muted-foreground">Target Allocation</span>
            <span className="font-semibold font-mono">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : formattedTargetAllocation}
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
    <div className="grid gap-4">
      <div className="flexColumn gap-4">
        <h2 className="text-lg font-semibold">Reserve Assets</h2>
        {SUPPORTED_RESERVE_ASSETS.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} onCopy={onCopy} />
        ))}
      </div>
    </div>
  );
}

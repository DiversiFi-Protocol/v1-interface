import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';

import { ALL_SUPPORTED_TOKENS } from '@/constants/tokens';

import AssetIcon from '@/components/AssetIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { truncateAddress } from '@/lib/addressUtils';

export default function AssetCards() {
  const onCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Copied address to clipboard');
  };
  return (
    <div className="grid">
      <div className="row gap-4 overflow-x-auto">
        {ALL_SUPPORTED_TOKENS.map((asset) => (
          <Card key={asset.symbol} className="flex-1">
            <CardHeader className="flex flex-row gap-2">
              <AssetIcon size="xl" asset={asset.symbol} />
              <div className="flexColumn gap-1">
                <CardTitle>{asset.symbol}</CardTitle>
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
                    <Clipboard />
                  </Button>
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="row gap-2 items-center">
              <span>stable coin stable coin stable coin take me away</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

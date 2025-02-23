import { cn } from '@/lib/utils';

type AssetIconSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AssetIconSize, string> = {
  sm: 'w-4 h-4 min-w-4 min-h-4',
  md: 'w-6 h-6 min-w-6 min-h-6',
  lg: 'w-8 h-8 min-w-8 min-h-8',
  xl: 'w-10 h-10 min-w-10 min-h-10',
};

interface AssetIconProps {
  asset: string;
  size?: AssetIconSize;
  className?: string;
}

export default function AssetIcon({ asset, size = 'sm', className }: AssetIconProps) {
  const assetPath = (() => {
    switch (asset) {
      case 'USDC':
        return '/usdc.png';
      case 'USDT':
        return '/usdt.png';
      case 'DAI':
        return '/dai.png';
      default:
        return null;
    }
  })();

  if (!assetPath) return null;

  return <img src={assetPath} alt={asset} className={cn(sizeClasses[size], className)} />;
}

import { cn } from '@/lib/tw';

type AssetIconSize = 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<AssetIconSize, string> = {
  sm: 'w-4 h-4 min-w-4 min-h-4 text-[0.65rem]',
  md: 'w-6 h-6 min-w-6 min-h-6 text-sm',
  lg: 'w-8 h-8 min-w-8 min-h-8 text-md',
  xl: 'w-10 h-10 min-w-10 min-h-10 text-lg',
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
        return '/currencies/usdc.png';
      case 'USDT':
        return '/currencies/usdt.png';
      case 'DAI':
        return '/currencies/dai.png';
      case 'DFIUSD':
        return '/currencies/dfiusd.png';
      default:
        return null;
    }
  })();

  if (!assetPath) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          'bg-foreground text-background rounded-full flex justify-center items-center',
          className
        )}
      >
        <span>{asset?.[0]}</span>
      </div>
    );
  }
  return (
    <img
      src={assetPath}
      alt={asset}
      className={cn(sizeClasses[size], 'bg-foreground rounded-full', className)}
    />
  );
}

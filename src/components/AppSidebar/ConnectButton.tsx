import { ConnectKitButton } from 'connectkit';

import { truncateAddress } from '@/lib/addressUtils';
import { cn } from '@/lib/tw';

export const ConnectButton = ({ className }: { className?: string }) => {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <button
            className={cn('w-full row gap-2 overflow-hidden text-left font-mono', className)}
            onClick={show}
          >
            <div
              className={cn(
                'rounded-full  size-2 min-w-2 min-h-2',
                isConnected ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            {isConnected && address ? truncateAddress(address) : 'Connect'}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};

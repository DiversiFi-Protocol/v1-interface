import { MessageCircleWarningIcon } from 'lucide-react';

import { useIsEqualized } from '@/hooks/BackingPool/useIsEqualized';

import { cn } from '@/lib/tw';

export function PoolInfoBanner({ className }: { className?: string }) {
  const { data: isEqualized } = useIsEqualized();

  if (isEqualized == null || isEqualized) {
    return null;
  }

  return (
    <div
      className={cn(
        'row gap-2 border-solid border border-destructive text-destructive p-2 bg-destructive/15',
        className
      )}
    >
      <MessageCircleWarningIcon />
      The pool is undergoing an asset allocation change
    </div>
  );
}

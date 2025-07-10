import { AlertTriangleIcon, ArrowRightIcon } from 'lucide-react';

import { useIsEqualized } from '@/hooks/BackingPool/useIsEqualized';

import { cn } from '@/lib/tw';

import { AllocationChangeDialog } from './AllocationChangeDialog';

export function AllocationChangeBanner({ className }: { className?: string }) {
  const { data: isEqualized } = useIsEqualized();

  if (isEqualized == null || isEqualized) {
    return null;
  }

  return (
    <div
      className={cn(
        'row justify-between border-solid border border-destructive text-destructive p-2 bg-destructive/15',
        className
      )}
    >
      <span className="row gap-2">
        <AlertTriangleIcon />
        The pool is undergoing an asset allocation change
      </span>
      <AllocationChangeDialog>
        <a className="row gap-1 text-foreground text-xs cursor-pointer hover:text-foreground">
          View Progress <ArrowRightIcon className="size-3" />
        </a>
      </AllocationChangeDialog>
    </div>
  );
}

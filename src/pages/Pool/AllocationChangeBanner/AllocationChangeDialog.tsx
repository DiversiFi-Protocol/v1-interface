import { useState } from 'react';

import { AlertTriangleIcon, ArrowDownIcon, ArrowRightIcon } from 'lucide-react';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import AllocationPieChart from '../PoolCharts/AllocationPieChart';

export function AllocationChangeDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const { isMobile } = useBreakpoints();

  const content = isMobile ? (
    <div className="flexColumn gap-2 justify-center items-center">
      <div className="w-full">
        <AllocationPieChart type="current" />
      </div>
      <ArrowDownIcon className="size-6" />
      <div className="w-full">
        <AllocationPieChart type="target" />
      </div>
    </div>
  ) : (
    <div className="row gap-2">
      <div className="w-1/2">
        <AllocationPieChart type="current" />
      </div>
      <ArrowRightIcon className="size-4" />
      <div className="w-1/2">
        <AllocationPieChart type="target" />
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="row gap-2">
            <AlertTriangleIcon /> Pool Allocation Change
          </DialogTitle>
          <DialogDescription>This pool is undergoing an asset allocation change.</DialogDescription>
        </DialogHeader>
        {content}
        <p className="border-t-2 border-dashed border-muted pt-2">
          The current allocation has drifted from the target allocation resulting in the need of
          equalizations to bring the pool back to the target allocation.
        </p>
      </DialogContent>
    </Dialog>
  );
}

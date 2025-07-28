import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import BurnForm from './BurnForm';

export function BurnDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Burn</DialogTitle>
          <DialogDescription>
            By burning the backed token, you will receive all reserve assets in denominations
            determined by their current allocation percentage.
          </DialogDescription>
        </DialogHeader>

        <BurnForm withCard={false} />
      </DialogContent>
    </Dialog>
  );
}

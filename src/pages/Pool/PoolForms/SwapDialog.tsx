import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import SwapForm from './SwapForm';

export function SwapDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Swap</DialogTitle>
          <DialogDescription>Swap between reserve assets and the backed token.</DialogDescription>
        </DialogHeader>

        <SwapForm hideHeader withCard={false} />
      </DialogContent>
    </Dialog>
  );
}

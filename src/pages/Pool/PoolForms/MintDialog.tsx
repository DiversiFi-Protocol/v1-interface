import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import MintForm from './MintForm';

export function MintDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mint</DialogTitle>
          <DialogDescription>
            When you mint, you'll exchange your individual tokens for a DiversiFi tokens that
            represents a basket of all these assets. The amount of each token you provide will be
            based on the target proportions in the pool.
          </DialogDescription>
        </DialogHeader>

        <MintForm withCard={false} />
      </DialogContent>
    </Dialog>
  );
}

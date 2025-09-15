import { ScrollIcon, TerminalSquareIcon } from 'lucide-react';

import { cn } from '@/lib/tw';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function TermsPopover({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn('hover:underline text-xs', className)}>
          Terms
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-solid border-accent p-0 w-fit rounded-md text-xs">
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="/terms/GeneralTerms"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-4 h-4" />
          General Terms
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="/terms/DFiUSDTerms"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-4 h-4" />
          DFiUSD Terms
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="/terms/DFiUSDMintUserTerms"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-4 h-4" />
          DFiUSD Mint User Agreement
        </a>
      </PopoverContent>
    </Popover>
  );
}

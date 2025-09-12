import { ScrollIcon, TerminalSquareIcon } from 'lucide-react';

import { cn } from '@/lib/tw';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function LearnPopover({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn('hover:underline text-xs', className)}>
          Learn
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-solid border-accent p-0 w-fit rounded-md text-xs">
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="https://docs.diversifi.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TerminalSquareIcon className="text-muted-foreground w-4 h-4" />
          Documentation
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="/docs/whitepaper.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-4 h-4" />
          Whitepaper
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="/docs/diversifi-audit.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-4 h-4" />
          Audit
        </a>
      </PopoverContent>
    </Popover>
  );
}

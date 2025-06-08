import { ScrollIcon, TerminalSquareIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function LearnPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="hover:underline">
          Learn
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-solid border-accent p-1 w-fit">
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 rounded-sm hover:no-underline"
          href="https://docs.diversifi.tech"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TerminalSquareIcon className="text-muted-foreground w-6 h-6" />
          Documentation
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 rounded-sm hover:no-underline"
          href="/docs/whitepaper.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ScrollIcon className="text-muted-foreground w-6 h-6" />
          Whitepaper
        </a>
      </PopoverContent>
    </Popover>
  );
}

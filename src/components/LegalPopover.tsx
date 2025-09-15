import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { cn } from '@/lib/tw';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function LegalPopover({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn('hover:underline text-xs', className)}>
          Terms
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-solid border-accent p-0 w-fit rounded-md text-xs">
        <Link
          to={PageRoutes.Terms}
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
        >
          Terms
        </Link>
        <Link
          to={PageRoutes.MintAgreement}
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
        >
          Mint Agreement
        </Link>
        <Link
          to={PageRoutes.DfiUsdTerms}
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
        >
          DFiUSD Terms
        </Link>
      </PopoverContent>
    </Popover>
  );
}

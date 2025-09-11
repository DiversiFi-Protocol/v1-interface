import DiscordIcon from '@/assets/social/discord.svg';
import XIcon from '@/assets/social/x.svg';

import { cn } from '@/lib/tw';

import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function SocialPopover({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn('hover:underline text-xs', className)}>
          Social
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border border-solid border-accent p-0 w-fit rounded-md text-xs">
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="https://x.com/0xDiversiFi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <XIcon className="text-muted-foreground w-4 h-4" />
          X/Twitter
        </a>
        <a
          className="row gap-4 w-full text-popover-foreground hover:text-popover-foreground hover:bg-foreground/10 p-2 hover:no-underline"
          href="https://discord.gg/wcCvAmwpy5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon className="text-muted-foreground w-4 h-4" />
          Discord
        </a>
      </PopoverContent>
    </Popover>
  );
}

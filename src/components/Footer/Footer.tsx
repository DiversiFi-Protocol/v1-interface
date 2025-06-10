import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import DiscordIcon from '@/assets/social/discord.svg';

import { ChainSelectorPopover } from './ChainSelectorPopover';
import { LearnPopover } from './LearnPopover';

export function Footer() {
  const { isMobile } = useBreakpoints();

  const learnMore = isMobile ? (
    <LearnPopover />
  ) : (
    <>
      <a href="https://docs.diversifi.tech" target="_blank" rel="noopener noreferrer">
        Documentation
      </a>
      <a href="/docs/whitepaper.pdf" target="_blank" rel="noopener noreferrer">
        Whitepaper
      </a>
    </>
  );

  return (
    <footer className="h-[var(--footer-height)] fixed bottom-0 left-0 right-0 bg-background text-foreground border-t-[1px] border-solid border-border z-50">
      <div className="row h-full justify-between px-2">
        <div>
          <ChainSelectorPopover />
        </div>
        <div className="row px-6 text-xs gap-4">
          <a href="https://discord.gg/wcCvAmwpy5" target="_blank" rel="noopener noreferrer">
            {isMobile ? <DiscordIcon className="size-4" /> : 'Discord'}
          </a>
          {learnMore}
          <Link to={PageRoutes.Terms}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}

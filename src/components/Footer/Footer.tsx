import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { ChainSelectorPopover } from './ChainSelectorPopover';
import { LearnPopover } from './LearnPopover';
import { SocialPopover } from './SocialPopover';

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

  const social = isMobile ? (
    <SocialPopover />
  ) : (
    <>
      <a
        className="px-2 py-1"
        href="https://x.com/0xDiversiFi"
        target="_blank"
        rel="noopener noreferrer"
      >
        X/Twitter
      </a>
      <a
        className="px-2 py-1"
        href="https://discord.gg/wcCvAmwpy5"
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord
      </a>
    </>
  );

  return (
    <footer className="h-[var(--footer-height)] fixed bottom-0 left-0 right-0 bg-background text-foreground border-t-[1px] border-solid border-border z-50">
      <div className="row h-full justify-between px-2">
        <div>
          <ChainSelectorPopover />
        </div>
        <div className="row px-6 text-xs gap-2">
          {social}
          {learnMore}
          <Link className="py-2 px-4" to={PageRoutes.Terms}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { LearnPopover } from '@/components/LearnPopover';
import { SocialPopover } from '@/components/SocialPopover';

import { TermsPopover } from '../TermsPopover';
import { ChainSelectorPopover } from './ChainSelectorPopover';

export function Footer() {
  const { isMobile } = useBreakpoints();

  const terms = isMobile ? (
    <TermsPopover />
  ) : (
    <>
      <a href="/terms/GeneralTerms" target="_blank" rel="noopener noreferrer">
        General Terms
      </a>
      <a href="/terms/DFiUSDTerms" target="_blank" rel="noopener noreferrer">
        DFiUSD Terms
      </a>
      <a href="/terms/DFiUSDMintUserTerms" target="_blank" rel="noopener noreferrer">
        DFiUSD Mint User Agreement
      </a>
    </>
  );

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
      <a href="/docs/diversifi-audit.pdf" target="_blank" rel="noopener noreferrer">
        Audit
      </a>
    </>
  );

  const social = isMobile ? (
    <SocialPopover />
  ) : (
    <>
      <a
        className="py-1"
        href="https://x.com/0xDiversiFi"
        target="_blank"
        rel="noopener noreferrer"
      >
        X/Twitter
      </a>
      <a
        className="py-1"
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
          {terms}
        </div>
      </div>
    </footer>
  );
}

import { LearnPopover } from '@/components/LearnPopover';
import { LegalPopover } from '@/components/LegalPopover';
import { SocialPopover } from '@/components/SocialPopover';

import { ChainSelectorPopover } from './ChainSelectorPopover';

export function Footer() {
  return (
    <footer className="h-[var(--footer-height)] fixed bottom-0 left-0 right-0 bg-background text-foreground border-t-[1px] border-solid border-border z-50">
      <div className="row h-full justify-between px-2">
        <div>
          <ChainSelectorPopover />
        </div>
        <div className="row px-6 text-xs gap-2">
          <SocialPopover />
          <LearnPopover />
          <LegalPopover />
        </div>
      </div>
    </footer>
  );
}

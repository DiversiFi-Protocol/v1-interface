import { ReactNode } from 'react';

import { cn } from '@/lib/tw';

export default function SingleColumnLayout({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn('flex h-[var(--main-height)]', className)}>
      <div
        className={cn(
          'flex-1 h-[var(--main-height)] overflow-y-auto bg-background relative',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

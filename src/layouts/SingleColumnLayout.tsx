import { ReactNode } from 'react';

import { cn } from '@/lib/tw';

export default function SingleColumnLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-[var(--main-height)]', className)}>
      <div className="flex-1 h-[var(--main-height)] overflow-y-auto bg-background relative">
        {children}
      </div>
    </div>
  );
}

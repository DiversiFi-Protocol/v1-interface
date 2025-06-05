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
    <div className={cn('flex h-full', className)}>
      <div className="flex-1 h-[calc(100vh-var(--navbar-height))] overflow-y-auto bg-background">
        {children}
      </div>
    </div>
  );
}

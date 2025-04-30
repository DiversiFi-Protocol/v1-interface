import { ReactNode } from 'react';

export default function SingleColumnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="flex-1 h-[calc(100vh-var(--navbar-height))] overflow-y-auto bg-background">
        {children}
      </div>
    </div>
  );
}

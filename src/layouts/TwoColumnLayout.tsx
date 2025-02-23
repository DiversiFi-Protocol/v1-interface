import { ReactNode } from 'react';

interface TwoColumnLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

export default function TwoColumnLayout({ main, sidebar }: TwoColumnLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="flex-1 h-[calc(100vh-var(--navbar-height))] overflow-y-auto bg-background">
        {main}
      </div>
      <div className="w-[25rem] flex-shrink-0 h-[calc(100vh-var(--navbar-height))] overflow-y-auto bg-card border-l border-border">
        {sidebar}
      </div>
    </div>
  );
}

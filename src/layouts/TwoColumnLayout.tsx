import { ReactNode } from 'react';

interface TwoColumnLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
}

export default function TwoColumnLayout({ main, sidebar }: TwoColumnLayoutProps) {
  return (
    <div className="flex h-full">
      <div className="flex-1 bg-background">
        {main}
        <div className="md:hidden">{sidebar}</div>
      </div>
      <div className="hidden md:block w-[30rem] overflow-y-auto flex-shrink-0 bg-background border-l border-border">
        {sidebar}
      </div>
    </div>
  );
}

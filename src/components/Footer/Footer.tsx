import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

export function Footer() {
  return (
    <footer className="h-[var(--footer-height)] fixed bottom-0 left-0 right-0 bg-background text-foreground border-t-[1px] border-solid border-border z-50">
      <div className="row h-full justify-between px-8">
        <div></div>
        <div>
          <Link to={PageRoutes.Terms}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}

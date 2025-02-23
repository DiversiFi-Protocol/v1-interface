import { ConnectKitButton } from 'connectkit';
import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[var(--navbar-height)] bg-card text-card-foreground border-b z-50">
      <div className="flex-1 mx-4 h-full flex items-center justify-between">
        <ul className="flex space-x-4">
          <li>
            <Link to={PageRoutes.Home} className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </li>
          <li>
            <Link to={PageRoutes.About} className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </li>
          <li>
            <Link to={PageRoutes.Pool} className="text-muted-foreground hover:text-foreground">
              Pool
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}

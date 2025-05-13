import { ConnectKitButton } from 'connectkit';
import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[var(--navbar-height)] text-foreground border-b z-50">
      <div className="flex-1 mx-4 h-full flex items-center justify-between">
        <ul className="row space-x-4">
          <li>
            <Link
              to={PageRoutes.Home}
              className="text-foreground hover:text-foreground font-bold text-xl"
            >
              DiversiFi
            </Link>
          </li>
          <li>
            <Link to={PageRoutes.Pool} className="text-foreground hover:text-foreground">
              Swap
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-2">
          <a href="https://docs.diversifi.tech" target="_blank" rel="noopener noreferrer">
            <Button className="rounded-3xl" variant="ghost">
              Learn
            </Button>
          </a>
          <ThemeToggle />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}

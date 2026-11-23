import { ConnectKitButton } from 'connectkit';
import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { useBreakpoints } from '@/hooks/useBreakpoints';

export default function Navbar() {
  const { isMobile } = useBreakpoints();

  const logoImg = isMobile ? (
    <img src="/brand/diversifi-mark.svg" alt="DiversiFi" className="w-7 h-7" />
  ) : (
    <img src="/brand/diversifi-lockup.svg" alt="DiversiFi" className="w-auto h-6" />
  );

  return (
    <nav className="fixed top-0 left-0 right-0 h-[var(--navbar-height)] bg-background text-foreground border-b z-50">
      <div className="flex-1 mx-4 h-full flex items-center">
        <ul className="row space-x-4 flex-1">
          <li>
            <Link
              to={PageRoutes.Home}
              className="row gap-2 text-foreground hover:text-foreground font-bold text-xl"
            >
              {logoImg}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}

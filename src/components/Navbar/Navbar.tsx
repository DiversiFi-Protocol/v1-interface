import { useMemo } from 'react';

import { ConnectKitButton } from 'connectkit';
import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useTheme } from '@/providers/ThemeProvider';

import ThemeToggle from '../ThemeToggle';

export default function Navbar() {
  const { theme } = useTheme();
  const { isMobile } = useBreakpoints();

  const logoImg = useMemo(() => {
    if (isMobile) {
      return <img src="/brand/diversifi-logo.png" alt="DiversiFi" className="w-8 min-w-8 h-auto" />;
    }

    const logoSrc = theme === 'dark' ? '/brand/diversifi-dark.png' : '/brand/diversifi-light.png';

    return <img src={logoSrc} alt="DiversiFi" className="w-auto min-w-10 h-10" />;
  }, [theme, isMobile]);

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
          <ThemeToggle />
          <ConnectKitButton />
        </div>
      </div>
    </nav>
  );
}

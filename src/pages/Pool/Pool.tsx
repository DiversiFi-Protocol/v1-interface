import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import { Outlet, useMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { PoolRoutes } from '@/constants/routes';

import { cn } from '@/lib/tw';

export default function Pool() {
  const match = useMatch(PoolRoutes.Swap);

  if (match == null) {
    return (
      <SingleColumnLayout className="px-4">
        {
          <div className="justify-start my-2 ml-auto mr-auto max-w-[500px] row text-2xl font-bold [&_a]:hover:no-underline">
            <NavLink to={PoolRoutes.Mint} className={navLinkClass}>
              Mint
            </NavLink>
            <NavLink to={PoolRoutes.Burn} className={navLinkClass}>
              Burn
            </NavLink>
          </div>
        }
        <Outlet />
      </SingleColumnLayout>
    );
  }

  return (
    <SingleColumnLayout>
      <Outlet />
    </SingleColumnLayout>
  );
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'text-muted-foreground hover:text-foreground px-6 py-1',
    isActive && 'text-foreground border-b-[2px] border-accent border-solid'
  );
}

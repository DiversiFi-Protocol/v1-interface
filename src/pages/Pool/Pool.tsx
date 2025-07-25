import SingleColumnLayout from '@/layouts/SingleColumnLayout';
import { InfoIcon } from 'lucide-react';
import { Outlet, useMatch } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

import { PoolRoutes } from '@/constants/routes';

import { useBreakpoints } from '@/hooks/useBreakpoints';

import { Button } from '@/components/ui/button';

import { cn } from '@/lib/tw';

import { AllocationChangeBanner } from './AllocationChangeBanner/AllocationChangeBanner';
import { FormSettingsPopover } from './FormSettingsPopover';
import PoolInfoDrawer from './PoolInfoDrawer/PoolInfoDrawer';

export default function Pool() {
  const match = useMatch(PoolRoutes.Swap);
  const { isTablet } = useBreakpoints();

  if (match == null) {
    return (
      <SingleColumnLayout className="px-4">
        <AllocationChangeBanner />
        {
          <div className="justify-start my-2 ml-auto mr-auto max-w-[500px] row text-2xl font-bold [&_a]:hover:no-underline">
            <NavLink to={PoolRoutes.Mint} className={navLinkClass}>
              Mint
            </NavLink>
            <NavLink to={PoolRoutes.Burn} className={navLinkClass}>
              Burn
            </NavLink>
            <NavLink to={PoolRoutes.Swap} className={navLinkClass}>
              Swap
            </NavLink>

            <FormSettingsPopover className="ml-auto" />
            <PoolInfoDrawer>
              <Button variant="secondary" size="icon" className="rounded-[50%]">
                <InfoIcon />
              </Button>
            </PoolInfoDrawer>
          </div>
        }

        <Outlet />
      </SingleColumnLayout>
    );
  }

  return (
    <div className="flexColumn gap-0.5">
      <AllocationChangeBanner className={cn(isTablet ? 'mx-4' : 'my-2 rounded-md')} />
      <Outlet />
    </div>
  );
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'text-muted-foreground hover:text-foreground px-6 py-1',
    isActive && 'text-foreground border-b-[2px] border-accent border-solid'
  );
}

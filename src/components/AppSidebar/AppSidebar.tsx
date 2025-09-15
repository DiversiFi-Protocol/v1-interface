import { Link } from 'react-router-dom';

import { PageRoutes } from '@/constants/routes';

import { useTheme } from '@/providers/ThemeProvider';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

import { LearnPopover } from '../LearnPopover';
import { LegalPopover } from '../LegalPopover';
import { SocialPopover } from '../SocialPopover';
import { TermsPopover } from '../TermsPopover';
import ThemeToggle from '../ThemeToggle';
import { ConnectButton } from './ConnectButton';

export function AppSidebar() {
  const { theme } = useTheme();

  const pools = [
    {
      title: 'DFiUSD',
      url: PageRoutes.Home,
    },
  ];

  const accountItems = [
    {
      title: 'Settings',
      url: PageRoutes.Account,
    },
  ];

  return (
    <Sidebar className="border-r-1 border-border border-solid">
      <SidebarHeader className="px-4 py-2 mb-4">
        <Link to={PageRoutes.Home}>
          <img
            src={theme === 'dark' ? '/brand/logo-text-light.svg' : '/brand/logo-text-dark.svg'}
            alt="DiversiFi"
            className="w-auto min-w-8 h-8"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <span className="text-sm font-medium text-muted-foreground px-2">Pools</span>
              {pools.map((pool) => (
                <SidebarMenuItem key={pool.title}>
                  <SidebarMenuButton asChild>
                    <Link to={pool.url} className="hover:no-underline">
                      <span>{pool.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <span className="text-sm font-medium text-muted-foreground px-2 mt-4">Account</span>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="hover:no-underline">
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-border pt-0 pb-[1px] pl-0 pr-0 flexColumn gap-[1px]">
        <div className="row bg-sidebar p-2 justify-evenly">
          <TermsPopover className="text-center h-auto text-xs font-normal text-muted-foreground flex-1 p-0 border-r border-t-0 border-b-0 border-l-0 hover:brightness-100 rounded-none border-border border-solid hover:text-sidebar-accent-foreground" />
          <LearnPopover className="text-center h-auto text-xs font-normal text-muted-foreground flex-1 p-0 border-r border-t-0 border-b-0 border-l-0 hover:brightness-100 rounded-none border-border border-solid hover:text-sidebar-accent-foreground" />
          <SocialPopover className="text-center h-auto text-xs font-normal text-muted-foreground flex-1 p-0 rounded-none hover:text-sidebar-accent-foreground hover:brightness-100" />
        </div>
        <div className="row gap-[1px]">
          <div className="bg-sidebar h-full row flex-1 overflow-hidden hover:bg-sidebar/80">
            <ConnectButton className="w-full h-full p-2" />
          </div>
          <div className="bg-sidebar h-full row hover:bg-sidebar/80">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

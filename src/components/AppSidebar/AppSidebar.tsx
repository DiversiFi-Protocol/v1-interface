import { Link } from 'react-router-dom';

import { PageRoutes, PoolRoutes } from '@/constants/routes';

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

import ThemeToggle from '../ThemeToggle';
import { ConnectButton } from './ConnectButton';

export function AppSidebar() {
  const { theme } = useTheme();

  const pools = [
    {
      title: 'DFiUSD',
      url: PoolRoutes.Swap,
    },
  ];

  const accountItems = [
    {
      title: 'Settings',
      url: PageRoutes.Account,
    },
  ];

  return (
    <Sidebar className="border-r-1 border-border border-solid [&_a]:hover:no-underline">
      <SidebarHeader className="px-4 py-2 mb-4">
        <a href="https://diversifi.tech">
          <img
            src={theme === 'dark' ? '/brand/logo-text-light.svg' : '/brand/logo-text-dark.svg'}
            alt="DiversiFi"
            className="w-auto min-w-8 h-8"
          />
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <span className="text-sm font-medium text-muted-foreground px-2">Pools</span>
              {pools.map((pool) => (
                <SidebarMenuItem key={pool.title}>
                  <SidebarMenuButton asChild>
                    <Link to={pool.url}>
                      <span>{pool.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <span className="text-sm font-medium text-muted-foreground px-2 mt-4">Account</span>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-border p-[1px] pr-0">
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

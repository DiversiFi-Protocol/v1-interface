import { Book, Lock, PieChart, Settings, TerminalSquare } from 'lucide-react';

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

export function AppSidebar({
  hideProtocol = true,
  hideSocial = true,
}: {
  hideProtocol?: boolean;
  hideSocial?: boolean;
}) {
  const { theme } = useTheme();

  const pools = [
    {
      title: 'DFiUSD',
      url: PoolRoutes.Swap,
      icon: PieChart,
    },
  ];

  const accountItems = [
    {
      title: 'Manage Allowances',
      url: PageRoutes.Allowance,
      icon: Lock,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
    },
  ];

  const protocolItems = [
    {
      title: 'Documentation',
      url: 'https://docs.diversifi.tech',
      icon: TerminalSquare,
    },
    {
      title: 'Whitepaper',
      url: '/docs/whitepaper.pdf',
      icon: Book,
    },
  ];

  const socialItems = [
    {
      title: 'X/Twitter',
      url: 'https://x.com/0xDiversiFi',
    },
    {
      title: 'Discord',
      url: 'https://discord.gg/wcCvAmwpy5',
    },
  ];

  return (
    <Sidebar className="border-r-1 border-border border-solid [&_a]:hover:no-underline">
      <SidebarHeader className="px-4 py-2 mb-4">
        <a href={PageRoutes.Home}>
          <img
            src={theme === 'dark' ? '/brand/diversifi-dark.png' : '/brand/diversifi-light.png'}
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
                    <a href={pool.url}>
                      {/* <pool.icon /> */}
                      <span>{pool.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <span className="text-sm font-medium text-muted-foreground px-2 mt-4">Account</span>
              {accountItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {/* <item.icon /> */}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {!hideProtocol && (
                <span className="text-sm font-medium text-muted-foreground px-2 mt-4">
                  Protocol
                </span>
              )}
              {!hideProtocol &&
                protocolItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {/* <item.icon /> */}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {!hideSocial && (
                <span className="text-sm font-medium text-muted-foreground px-2 mt-4">Social</span>
              )}
              {!hideSocial &&
                socialItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {/* <item.icon /> */}
                        <span>{item.title}</span>
                      </a>
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

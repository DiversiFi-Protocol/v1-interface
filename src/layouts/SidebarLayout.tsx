import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/AppSidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function SidebarLayout() {
  return (
    <div className="min-h-screen w-screen overflow-y-auto">
      <main className="mt-[var(--navbar-height)] mb-[var(--footer-height)] min-h-[var(--main-height)]">
        <SidebarProvider>
          <AppSidebar />
          <div className="max-w-[1400px] w-full mx-auto px-4">
            <Outlet />
          </div>
        </SidebarProvider>
      </main>
    </div>
  );
}

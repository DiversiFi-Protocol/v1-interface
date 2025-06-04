import { Outlet } from 'react-router-dom';

import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout() {
  return (
    <div className="min-w-[100vw] overflow-hidden">
      <Navbar />
      <main className="mt-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] max-w-[1400px] mx-auto overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen min-w-[100vw]">
      <Navbar />
      <main className="mt-[var(--navbar-height)] h-[calc(100vh-var(--navbar-height))] max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

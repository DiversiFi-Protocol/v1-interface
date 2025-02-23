import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen min-w-[100vw]">
      <Navbar />
      <main className="mt-[var(--navbar-height)] min-h-[calc(100vh-var(--navbar-height))]">
        <Outlet />
      </main>
    </div>
  );
}

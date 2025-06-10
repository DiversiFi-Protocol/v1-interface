import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout() {
  return (
    <div className="min-w-[100vw] overflow-hidden">
      <Navbar />
      <main className="mt-[var(--navbar-height)] mb-[var(--footer-height)] h-[var(--main-height)] max-w-[1400px] mx-auto overflow-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

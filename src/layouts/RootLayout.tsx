import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout() {
  return (
    <div className="min-h-screen w-screen overflow-y-auto">
      <Navbar />
      <main className="mt-[var(--navbar-height)] mb-[var(--footer-height)] min-h-[var(--main-height)]">
        <div className="max-w-[1400px] mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

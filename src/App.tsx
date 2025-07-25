import { Suspense, lazy, useEffect, useState } from 'react';

import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Navigate, Route, Routes } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import { PageRoutes, PoolRoutes } from './constants/routes';
import { useBreakpoints } from './hooks/useBreakpoints';
import RootLayout from './layouts/RootLayout';
import SidebarLayout from './layouts/SidebarLayout';
import Terms from './pages/Terms/Terms';

const Allowance = lazy(() => import('./pages/Allowance/Allowance'));
const Home = lazy(() => import('./pages/Home/Home'));
const Swap = lazy(() => import('./pages/Pool/Swap'));
const Mint = lazy(() => import('./pages/Pool/Mint'));
const Burn = lazy(() => import('./pages/Pool/Burn'));
const Pool = lazy(() => import('./pages/Pool/Pool'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [init, setInit] = useState(false);
  const { isTablet } = useBreakpoints();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          path={PageRoutes.Home}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home particlesReady={init} />
            </Suspense>
          }
        />
      </Route>
      <Route element={isTablet ? <RootLayout /> : <SidebarLayout />}>
        <Route
          path={PageRoutes.Pool}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Pool />
            </Suspense>
          }
        >
          <Route
            path={PoolRoutes.Swap}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Swap />
              </Suspense>
            }
          />
          <Route
            path={PoolRoutes.Mint}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Mint />
              </Suspense>
            }
          />
          <Route
            path={PoolRoutes.Burn}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Burn />
              </Suspense>
            }
          />
          <Route path={PageRoutes.Pool} element={<Navigate to={PoolRoutes.Swap} replace />} />
        </Route>
        <Route
          path={PageRoutes.Allowance}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Allowance />
            </Suspense>
          }
        />
        <Route
          path={PageRoutes.Terms}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Terms />
            </Suspense>
          }
        />
        <Route
          path={PageRoutes.NotFound}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;

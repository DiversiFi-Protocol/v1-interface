import { Suspense, lazy, useEffect, useState } from 'react';

import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Route, Routes } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import { PageRoutes, PoolRoutes } from './constants/routes';
import RootLayout from './layouts/RootLayout';

const Allowance = lazy(() => import('./pages/Allowance/Allowance'));
const Home = lazy(() => import('./pages/Home'));
const Pool = lazy(() => import('./pages/Pool/Pool'));
const Mint = lazy(() => import('./pages/Pool/Mint'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const [init, setInit] = useState(false);

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
        <Route path={PageRoutes.Pool}>
          <Route
            path={PageRoutes.Pool}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Pool />
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

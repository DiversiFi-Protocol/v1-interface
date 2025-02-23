import { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import { PageRoutes } from './constants/routes';
import RootLayout from './layouts/RootLayout';
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Pool = lazy(() => import('./pages/Pool/Pool'));
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
        <Route
          path={PageRoutes.About}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path={PageRoutes.Pool}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Pool />
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

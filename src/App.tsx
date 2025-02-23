import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LoadingSpinner from './components/LoadingSpinner';
import { PageRoutes } from './constants/routes';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Pool = lazy(() => import('./pages/Pool'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route
          path={PageRoutes.Home}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
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

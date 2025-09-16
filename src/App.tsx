import { Suspense, lazy } from 'react';

import { Route, Routes } from 'react-router-dom';

import LoadingSpinner from './components/LoadingSpinner';
import { PageRoutes, TermsRoutes } from './constants/routes';
import { useBreakpoints } from './hooks/useBreakpoints';
import RootLayout from './layouts/RootLayout';
import SidebarLayout from './layouts/SidebarLayout';
import Blocked from './pages/Blocked';
import DFiUSDMintUserTermsPage from './pages/Terms/DFiUSDMintUserTermsPage';
import DFIUSDTermsPage from './pages/Terms/DFiUSDTermsPage';
import GeneralTermsPage from './pages/Terms/GeneralTermsPage';

const Swap = lazy(() => import('./pages/Pool/Swap'));
const Pool = lazy(() => import('./pages/Pool/Pool'));
const Settings = lazy(() => import('./pages/Account/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { isTablet } = useBreakpoints();

  return (
    <Routes>
      <Route element={<RootLayout />}></Route>
      <Route element={isTablet ? <RootLayout /> : <SidebarLayout />}>
        <Route
          path={PageRoutes.Home}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Pool />
            </Suspense>
          }
        >
          <Route
            path={PageRoutes.Home}
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Swap />
              </Suspense>
            }
          />
        </Route>
        <Route
          path={PageRoutes.Account}
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Settings />
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
      <Route
        path={PageRoutes.Blocked}
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <Blocked />
          </Suspense>
        }
      />
      <Route
        path={TermsRoutes.GeneralTerms}
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <GeneralTermsPage />
          </Suspense>
        }
      />
      <Route
        path={TermsRoutes.DFiUSDMintUserTerms}
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <DFiUSDMintUserTermsPage />
          </Suspense>
        }
      />
      <Route
        path={TermsRoutes.DFiUSDTerms}
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <DFIUSDTermsPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;

import { StrictMode } from 'react';

import { Loader2 } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

import { store, persistor } from '@/state/store';

import App from './App.tsx';
import './index.css';
import { ChainProvider } from './providers/ChainProvider.tsx';
import { ThemeProvider } from './providers/ThemeProvider.tsx';
import Web3Provider from './providers/Web3Provider';

// Set dark mode by default
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        }
        persistor={persistor}
      >
        <ThemeProvider>
          <Web3Provider>
            <ChainProvider>
              <BrowserRouter>
                <App />
                <Toaster richColors />
              </BrowserRouter>
            </ChainProvider>
          </Web3Provider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);

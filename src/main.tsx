import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';
import Web3Provider from './providers/Web3Provider';

// Set dark mode by default
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
      <BrowserRouter>
        <App />
        <Toaster richColors />
      </BrowserRouter>
    </Web3Provider>
  </StrictMode>
);

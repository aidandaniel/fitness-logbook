import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import { insforge } from './lib/insforge';
import { DarkModeProvider } from './contexts/DarkModeContext';
import App from './App.tsx';
import './index.css';

// Handle OAuth redirects from root domain to base path
// This catches redirects that land on aidandaniel.github.io/ instead of aidandaniel.github.io/fitness-logbook/
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  const hasOAuthParams = urlParams.has('access_token') || urlParams.has('code') || urlParams.has('error');
  const isRootDomain = window.location.pathname === '/' && window.location.hostname === 'aidandaniel.github.io';
  
  if (isRootDomain && hasOAuthParams) {
    // Redirect to base path with the same query parameters
    const basePath = '/fitness-logbook';
    const newUrl = `${basePath}${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(newUrl);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <DarkModeProvider>
      <InsforgeProvider client={insforge}>
        <App />
      </InsforgeProvider>
    </DarkModeProvider>
  </StrictMode>
);

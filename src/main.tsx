import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InsforgeProvider } from '@insforge/react';
import { insforge } from './lib/insforge';
import { DarkModeProvider } from './contexts/DarkModeContext';
import App from './App.tsx';
import './index.css';

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

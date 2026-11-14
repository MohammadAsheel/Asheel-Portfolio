import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializePalette } from '@/lib/palette';
import '@/styles/global.css';
import App from './App';

initializePalette();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

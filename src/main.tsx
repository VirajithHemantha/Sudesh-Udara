import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import Admin from './Admin';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path.replace(/\/+$/, '') === '/admin' ? <Admin /> : <App />}
  </StrictMode>,
);

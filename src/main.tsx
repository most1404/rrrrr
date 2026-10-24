import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ScanProvider } from './core/state/ScanContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ScanProvider>
      <App />
    </ScanProvider>
  </React.StrictMode>
);

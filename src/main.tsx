
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Ensure the BrowserRouter is here in main.tsx and not in App.tsx
createRoot(document.getElementById("root")!).render(
  <App />
);

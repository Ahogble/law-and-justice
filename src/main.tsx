import './index.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createInertiaApp({
  resolve: (name) => {
    if (name === 'App' || name === 'Home') {
      return (App as any).default || App;
    }
    const pages: Record<string, any> = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    const mod = pages[`./Pages/${name}.tsx`];
    return mod?.default || mod || (App as any).default || App;
  },
  setup({ el, App: InertiaApp, props }) {
    createRoot(el).render(<InertiaApp {...props} />);
  },
});


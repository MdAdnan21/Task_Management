import './index.css';
import 'react/jsx-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import axios from 'axios';
import ReactDOM from 'react-dom/client';

import { routeTree } from './routeTree.gen';

import { AuthProvider } from './routes/_auth/auth/-components/authContext'; // Import your AuthProvider
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
});

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {' '}
        {/* ✅ Wrap AuthProvider around RouterProvider */}
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

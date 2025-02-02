import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
// Create the root route
export const Route = createRootRoute({
  component: RootComponents,
});

// Root component
function RootComponents() {
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Navigate directly to /auth/login
    navigate({ to: '/', replace: true });
  }, [navigate]);

  return (
    <div>
      <Toaster richColors />
      <Outlet />
    </div>
  );
}

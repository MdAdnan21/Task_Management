import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { useAuth } from './_auth/auth/-components/authContext';
import { useEffect } from 'react';

export const Route = createRootRoute({
  component: RootComponents,
});

function RootComponents() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: '/auth/login' });
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  return (
    <div>
      <Toaster richColors />
      <Outlet />
    </div>
  );
}

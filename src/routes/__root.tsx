import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { Toaster } from 'sonner';
import { useAuth } from './_auth/auth/-components/authContext';

export const Route = createRootRoute({
  component: RootComponents,
});

function RootComponents() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    return navigate({ to: '/auth/login' });
  }

  return (
    <div>
      <Toaster richColors />
      <Outlet />
    </div>
  );
}

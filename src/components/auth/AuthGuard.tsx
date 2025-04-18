
import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error("Please log in to access this page");
    }
  }, [currentUser, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

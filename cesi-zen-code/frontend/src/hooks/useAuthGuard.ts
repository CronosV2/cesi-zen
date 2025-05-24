import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'student';
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { 
    redirectTo = '/login', 
    requireAuth = true,
    requiredRole
  } = options;
  
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Ne pas rediriger si on est encore en train de charger l'authentification
    if (isLoading) return;
    
    // Vérifier l'authentification si requise
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Vérifier le rôle si spécifié
    if (requiredRole && user?.role !== requiredRole) {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, isLoading, user, router, redirectTo, requireAuth, requiredRole]);

  return {
    isAuthenticated,
    isLoading,
    user,
    isAuthorized: isAuthenticated && (!requiredRole || user?.role === requiredRole)
  };
};

export default useAuthGuard; 
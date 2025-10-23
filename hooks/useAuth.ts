'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, hasCookie } from './useCookies';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getCookie('token');
        const hasToken = hasCookie('token');
        
        console.log('Auth check - Token exists:', hasToken);
        console.log('Auth check - Token value:', token ? 'EXISTS' : 'NOT FOUND');
        
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          // Only redirect if we're not already on login page
          if (window.location.pathname !== '/login') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    // Clear token from both localStorage and cookies
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    isAuthenticated,
    isLoading,
    logout
  };
}

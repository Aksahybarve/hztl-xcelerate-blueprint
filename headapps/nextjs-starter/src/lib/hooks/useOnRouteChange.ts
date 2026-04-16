'use client';

// Global
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const useOnRouteChange = (
  callback: () => void,
  _events: string[] = ['routeChangeComplete'],
  runOnHashChange = false
) => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // In App Router, there are no router.events. Instead, detect route changes via usePathname.
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      callback();
    }
  }, [pathname, callback]);

  useEffect(() => {
    if (runOnHashChange) {
      window.addEventListener('hashchange', callback);
    }

    return () => {
      if (runOnHashChange) {
        window.removeEventListener('hashchange', callback);
      }
    };
  }, [callback, runOnHashChange]);
};

export function useOnHashChange(callback: () => void) {
  return useOnRouteChange(callback, ['routeChangeComplete'], true);
}

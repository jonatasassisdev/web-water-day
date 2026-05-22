'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { useAuthStore } from '@/stores/auth.store';
import AppHeader from '@/components/layout/AppHeader';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F0F7FF' }}>
      <AppHeader />
      {children}
    </Box>
  );
}

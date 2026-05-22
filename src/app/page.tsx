'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingDone } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(onboardingDone ? '/dashboard' : '/onboarding');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, onboardingDone, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)',
      }}
    >
      <CircularProgress sx={{ color: '#2563EB' }} />
    </Box>
  );
}

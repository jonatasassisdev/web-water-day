'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLink from '@/components/ui/AppLink';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import Logo from '@/components/ui/Logo';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth.store';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);
      setAuth(res.user, res.token, res.refreshToken, res.onboardingDone);
      router.push(res.onboardingDone ? '/dashboard' : '/onboarding');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Credenciais inválidas';
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 420 }}>
      <Box sx={{ mb: 5 }}>
        <Logo size="md" />
      </Box>

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: 'text.primary' }}>
        Bem-vindo de volta
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Entre na sua conta para continuar
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          label="E-mail"
          type="email"
          fullWidth
          autoComplete="email"
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
          {...register('email')}
        />

        <TextField
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          autoComplete="current-password"
          error={!!errors.password}
          helperText={errors.password?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 0.5, py: 1.6, fontSize: '1rem', fontWeight: 700 }}
        >
          {isSubmitting ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Entrar'}
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'text.secondary' }}>
        Ainda não tem conta?{' '}
        <AppLink href="/register">Criar conta</AppLink>
      </Typography>
    </Box>
  );
}

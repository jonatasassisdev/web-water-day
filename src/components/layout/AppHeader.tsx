'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Logout from '@mui/icons-material/Logout';
import CameraAlt from '@mui/icons-material/CameraAlt';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined';
import RestaurantMenuOutlined from '@mui/icons-material/RestaurantMenuOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import { useSnackbar } from 'notistack';
import Logo from '@/components/ui/Logo';
import { useAuthStore } from '@/stores/auth.store';
import { useDailySummary } from '@/lib/hooks/useDashboard';
import { usersApi } from '@/lib/api/users';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: GridViewRounded },
  { label: 'Hidratação', href: '/hydration', icon: WaterDropOutlined },
  { label: 'Dieta', href: '/diet-protocol', icon: RestaurantMenuOutlined },
  { label: 'Configurações', href: '/settings', icon: SettingsOutlined },
  { label: 'Premium', href: '/pricing', icon: WorkspacePremiumOutlined, highlight: true },
];

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, setAvatar } = useAuthStore();
  const { summary, isLoading } = useDailySummary();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const updated = await usersApi.uploadAvatar(file);
      if (updated.avatarUrl) setAvatar(updated.avatarUrl);
      enqueueSnackbar('Foto atualizada!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao atualizar foto', { variant: 'error' });
    } finally {
      setUploading(false);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderBottom: '1px solid #F1F5F9',
        boxShadow: '0px 1px 4px rgba(15,23,42,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo + nav grouped on the left */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Logo size="sm" />

        <Box
          component="nav"
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}
        >
          {NAV_LINKS.map(({ label, href, icon: Icon, highlight }) => {
            const active = pathname === href;
            if (highlight) {
              return (
                <Box
                  key={href}
                  onClick={() => router.push(href)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    color: active ? '#7C3AED' : '#7C3AED',
                    backgroundColor: active ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.06)',
                    transition: 'all 0.15s ease',
                    '&:hover': { backgroundColor: 'rgba(124,58,237,0.12)' },
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {label}
                </Box>
              );
            }
            return (
              <Box
                key={href}
                onClick={() => router.push(href)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.875rem',
                  color: active ? '#2563EB' : '#64748B',
                  backgroundColor: active ? 'rgba(37,99,235,0.07)' : 'transparent',
                  transition: 'all 0.15s ease',
                  '&:hover': { color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.05)' },
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
                {label}
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {summary && !isLoading && (
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 99,
              backgroundColor: summary.goalReached ? 'rgba(16,185,129,0.08)' : 'rgba(37,99,235,0.08)',
              border: '1px solid',
              borderColor: summary.goalReached ? 'rgba(16,185,129,0.2)' : 'rgba(37,99,235,0.15)',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: summary.goalReached ? '#10B981' : '#2563EB',
              }}
            />
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: summary.goalReached ? '#10B981' : '#2563EB' }}
            >
              {summary.goalReached ? 'Meta atingida hoje!' : `${summary.progressPercent}% da meta`}
            </Typography>
          </Box>
        )}

        {/* Clickable avatar with upload overlay */}
        <Tooltip title="Trocar foto de perfil">
          <Box
            onClick={handleAvatarClick}
            sx={{
              position: 'relative',
              width: 34,
              height: 34,
              borderRadius: '50%',
              cursor: 'pointer',
              flexShrink: 0,
              '&:hover .avatar-overlay': { opacity: 1 },
            }}
          >
            <Avatar
              src={user?.avatarUrl ?? undefined}
              sx={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {!user?.avatarUrl && user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            {/* Hover overlay */}
            <Box
              className="avatar-overlay"
              sx={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              {uploading ? (
                <CircularProgress size={14} sx={{ color: 'white' }} />
              ) : (
                <CameraAlt sx={{ fontSize: 14, color: 'white' }} />
              )}
            </Box>
          </Box>
        </Tooltip>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <Typography
          variant="body2"
          sx={{ fontWeight: 500, display: { xs: 'none', md: 'block' }, color: 'text.secondary' }}
        >
          {user?.name}
        </Typography>

        <Tooltip title="Sair">
          <IconButton onClick={handleLogout} size="small" sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444' } }}>
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

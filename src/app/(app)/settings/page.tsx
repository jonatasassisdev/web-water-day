'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import { useSnackbar } from 'notistack';
import { notificationsApi, NotificationSettings } from '@/lib/api/notifications';
import { requestNotificationPermission } from '@/lib/firebase';

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    notificationsApi.getSettings().then(setSettings).finally(() => setLoading(false));
  }, []);

  const handlePushToggle = async (enabled: boolean) => {
    if (!settings) return;
    setSaving(true);
    try {
      let fcmToken = settings.fcmToken;

      if (enabled && !fcmToken) {
        fcmToken = await requestNotificationPermission();
        if (!fcmToken) {
          enqueueSnackbar('Permissão de notificação negada. Verifique as configurações do seu navegador.', { variant: 'warning' });
          setSaving(false);
          return;
        }
      }

      const updated = await notificationsApi.updateSettings({ pushEnabled: enabled, fcmToken: fcmToken ?? undefined });
      setSettings(updated);
      enqueueSnackbar(enabled ? 'Notificações push ativadas!' : 'Notificações push desativadas.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao salvar configuração.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleEmailToggle = async (enabled: boolean) => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await notificationsApi.updateSettings({ emailEnabled: enabled });
      setSettings(updated);
      enqueueSnackbar(enabled ? 'Lembretes por e-mail ativados!' : 'Lembretes por e-mail desativados.', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao salvar configuração.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleIntervalChange = async (hours: number) => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await notificationsApi.updateSettings({ reminderIntervalHours: hours });
      setSettings(updated);
      enqueueSnackbar('Intervalo atualizado!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao salvar configuração.', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 3, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
        Configurações
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
        Personalize como o WaterDay te lembra de se hidratar.
      </Typography>

      {/* Push Notifications */}
      <Box
        sx={{
          background: '#fff',
          borderRadius: 3,
          p: 3,
          mb: 2,
          border: '1px solid #F1F5F9',
          boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: 'rgba(37,99,235,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NotificationsActive sx={{ fontSize: 18, color: '#2563EB' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Notificações Push
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Alertas direto no seu dispositivo
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Switch
              checked={settings?.pushEnabled ?? false}
              disabled={saving}
              onChange={(e) => handlePushToggle(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#2563EB' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#2563EB' },
              }}
            />
          </Box>
        </Box>

        {settings?.pushEnabled && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                Intervalo entre lembretes
              </Typography>
              <Select
                size="small"
                value={settings.reminderIntervalHours}
                disabled={saving}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                sx={{ minWidth: 130, borderRadius: 2 }}
              >
                <MenuItem value={1}>A cada 1 hora</MenuItem>
                <MenuItem value={2}>A cada 2 horas</MenuItem>
                <MenuItem value={3}>A cada 3 horas</MenuItem>
                <MenuItem value={4}>A cada 4 horas</MenuItem>
              </Select>
            </Box>
          </>
        )}
      </Box>

      {/* Email Reminders */}
      <Box
        sx={{
          background: '#fff',
          borderRadius: 3,
          p: 3,
          border: '1px solid #F1F5F9',
          boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              backgroundColor: 'rgba(16,185,129,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmailOutlined sx={{ fontSize: 18, color: '#10B981' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
              Lembrete por E-mail
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Resumo diário às 20h com seu progresso
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Switch
              checked={settings?.emailEnabled ?? false}
              disabled={saving}
              onChange={(e) => handleEmailToggle(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10B981' },
              }}
            />
          </Box>
        </Box>
      </Box>

      {saving && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Box>
  );
}

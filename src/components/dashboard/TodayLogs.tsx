'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import WaterDrop from '@mui/icons-material/WaterDrop';
import { useSnackbar } from 'notistack';
import { WaterLog, waterLogApi } from '@/lib/api/water-log';
import { refreshDashboard } from '@/lib/hooks/useDashboard';

interface TodayLogsProps {
  logs: WaterLog[];
  isLoading?: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mlToLabel(ml: number) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`;
}

export default function TodayLogs({ logs, isLoading }: TodayLogsProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, ml: number) => {
    setDeleting(id);
    try {
      await waterLogApi.delete(id);
      await refreshDashboard();
      enqueueSnackbar(`-${mlToLabel(ml)} removido`, { variant: 'info' });
    } catch {
      enqueueSnackbar('Erro ao remover', { variant: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={52} />
        ))}
      </Box>
    );
  }

  if (!logs.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          gap: 1,
        }}
      >
        <WaterDrop sx={{ fontSize: 36, color: '#CBD5E1' }} />
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Nenhum registro hoje
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          Use os botões acima para registrar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[...logs].reverse().map((log) => (
        <Box
          key={log.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
            py: 1.25,
            borderRadius: 2,
            border: '1px solid #F1F5F9',
            backgroundColor: '#FAFCFF',
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#BFDBFE',
              backgroundColor: '#EFF6FF',
            },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WaterDrop sx={{ fontSize: 18, color: '#2563EB' }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {mlToLabel(log.amountMl)}
            </Typography>
            {log.note && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {log.note}
              </Typography>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 500, flexShrink: 0 }}>
            {formatTime(log.loggedAt)}
          </Typography>

          <Tooltip title="Remover">
            <IconButton
              size="small"
              onClick={() => handleDelete(log.id, log.amountMl)}
              disabled={deleting === log.id}
              sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444', backgroundColor: '#FEF2F2' } }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ))}
    </Box>
  );
}

'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Add from '@mui/icons-material/Add';
import { alpha } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { waterLogApi } from '@/lib/api/water-log';
import { refreshDashboard } from '@/lib/hooks/useDashboard';

const QUICK_OPTIONS = [
  { ml: 150, label: '150ml', icon: '🥛', desc: 'Copo pequeno' },
  { ml: 200, label: '200ml', icon: '🥤', desc: 'Copo' },
  { ml: 300, label: '300ml', icon: '🧃', desc: 'Copo grande' },
  { ml: 500, label: '500ml', icon: '🍶', desc: 'Garrafa' },
  { ml: 750, label: '750ml', icon: '💧', desc: 'Garrafa grande' },
];

export default function QuickAdd() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<number | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customMl, setCustomMl] = useState('');
  const [customLoading, setCustomLoading] = useState(false);

  const handleAdd = async (ml: number) => {
    setLoading(ml);
    try {
      await waterLogApi.add(ml);
      await refreshDashboard();
      enqueueSnackbar(`+${ml}ml registrado!`, { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao registrar', { variant: 'error' });
    } finally {
      setLoading(null);
    }
  };

  const handleCustomAdd = async () => {
    const ml = parseInt(customMl);
    if (!ml || ml < 1 || ml > 5000) return;
    setCustomLoading(true);
    try {
      await waterLogApi.add(ml);
      await refreshDashboard();
      enqueueSnackbar(`+${ml}ml registrado!`, { variant: 'success' });
      setCustomMl('');
      setCustomOpen(false);
    } catch {
      enqueueSnackbar('Erro ao registrar', { variant: 'error' });
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2.5, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
        Adicionar água
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
        {QUICK_OPTIONS.map((opt) => (
          <ButtonBase
            key={opt.ml}
            onClick={() => handleAdd(opt.ml)}
            disabled={loading !== null}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              border: '2px solid',
              borderColor: '#E2E8F0',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: alpha('#2563EB', 0.04),
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(37,99,235,0.12)',
              },
              '&:active': { transform: 'translateY(0)' },
              '&:disabled': { opacity: 0.5 },
            }}
          >
            {loading === opt.ml ? (
              <CircularProgress size={16} />
            ) : (
              <>
                <Typography sx={{ fontSize: '1.1rem', lineHeight: 1 }}>{opt.icon}</Typography>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1, display: 'block', fontSize: '0.875rem' }}>
                    {opt.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', lineHeight: 1.3 }}>
                    {opt.desc}
                  </Typography>
                </Box>
              </>
            )}
          </ButtonBase>
        ))}

        {/* Custom add */}
        <ButtonBase
          onClick={() => setCustomOpen((v) => !v)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            py: 1,
            px: 1.5,
            borderRadius: 2,
            border: '2px dashed',
            borderColor: customOpen ? 'primary.main' : '#CBD5E1',
            backgroundColor: customOpen ? alpha('#2563EB', 0.04) : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: 'primary.main' },
          }}
        >
          <Add sx={{ fontSize: 20, color: customOpen ? 'primary.main' : 'text.disabled' }} />
          <Typography sx={{ fontWeight: 600, color: customOpen ? 'primary.main' : 'text.secondary', lineHeight: 1, fontSize: '0.875rem' }}>
            Personalizado
          </Typography>
        </ButtonBase>
      </Box>

      <Collapse in={customOpen}>
        <Box sx={{ mt: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start', maxWidth: 320 }}>
          <TextField
            size="small"
            label="Quantidade (ml)"
            type="number"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            slotProps={{ htmlInput: { min: 1, max: 5000 } }}
            sx={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
          />
          <Button
            variant="contained"
            onClick={handleCustomAdd}
            disabled={!customMl || customLoading}
            sx={{ py: 1, px: 2.5, height: 40, borderRadius: 2 }}
          >
            {customLoading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : 'Adicionar'}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}

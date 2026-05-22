'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import { WaterProtocol } from '@/lib/api/types';

interface ProtocolCardProps {
  protocol?: WaterProtocol;
  isLoading?: boolean;
}

export default function ProtocolCard({ protocol, isLoading }: ProtocolCardProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Skeleton height={20} width="60%" />
        {[1, 2, 3].map((i) => <Skeleton key={i} height={36} variant="rounded" />)}
      </Box>
    );
  }

  if (!protocol) return null;

  const { breakdown } = protocol;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #2563EB, #0EA5E9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesome sx={{ fontSize: 14, color: 'white' }} />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Seu Protocolo de IA
        </Typography>
        <Chip label="Personalizado" size="small" sx={{ fontSize: '0.65rem', height: 20, backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600 }} />
      </Box>

      {/* Daily goal */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderRadius: 2.5,
          background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)',
          border: '1px solid #BFDBFE',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
            Meta diária
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1D4ED8', lineHeight: 1, mt: 0.25 }}>
            {(protocol.dailyGoalMl / 1000).toFixed(1)}
            <Typography component="span" variant="body1" sx={{ fontWeight: 600, color: '#60A5FA', ml: 0.5 }}>L</Typography>
          </Typography>
        </Box>
        <Typography sx={{ fontSize: '2.5rem' }}>💧</Typography>
      </Box>

      {/* Breakdown */}
      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
        Composição
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mb: 2.5 }}>
        {[
          { label: 'Base (peso)', value: breakdown.baseIntake },
          { label: 'Atividade física', value: breakdown.activityBonus },
          { label: 'Clima', value: breakdown.climateBonus },
          { label: 'Objetivo', value: breakdown.goalAdjustment },
          ...(breakdown.healthAdjustment !== 0
            ? [{ label: 'Saúde', value: breakdown.healthAdjustment }]
            : []),
        ].map(({ label, value }) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: value >= 0 ? 'text.primary' : '#EF4444',
              }}
            >
              {value >= 0 ? '+' : ''}{value}ml
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Tips */}
      <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
        Dicas da IA
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {protocol.tips.map((tip, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <LightbulbOutlined sx={{ fontSize: 15, color: '#F59E0B', mt: '2px', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
              {tip}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

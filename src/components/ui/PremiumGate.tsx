'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockOutlined from '@mui/icons-material/LockOutlined';
import WorkspacePremiumOutlined from '@mui/icons-material/WorkspacePremiumOutlined';
import { useAuthStore } from '@/stores/auth.store';

interface PremiumGateProps {
  children: ReactNode;
  feature?: string;
  description?: string;
}

const FEATURE_DETAILS: Record<string, { icon: string; perks: string[] }> = {
  'Protocolo de Dieta': {
    icon: '🥗',
    perks: [
      'Plano alimentar personalizado com IA',
      'Rastreamento de refeições do dia',
      'Sugestões de substituições e suplementos',
      'Atualização do protocolo quando quiser',
    ],
  },
  'Análise de Hidratação': {
    icon: '📊',
    perks: [
      'Gráfico de evolução dos últimos 30 dias',
      'Sequência de metas atingidas (streak)',
      'Média diária e melhor dia registrado',
      'Insights detalhados de hidratação',
    ],
  },
};

export default function PremiumGate({ children, feature = 'Recurso Premium', description }: PremiumGateProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  if (user?.isPremium) return <>{children}</>;

  const details = FEATURE_DETAILS[feature];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
        background: 'linear-gradient(160deg, #F0F7FF 0%, #F5F3FF 100%)',
      }}
    >
      <Box sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 32px rgba(124,58,237,0.25)',
          }}
        >
          {details ? (
            <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>{details.icon}</Typography>
          ) : (
            <LockOutlined sx={{ fontSize: 32, color: 'white' }} />
          )}
        </Box>

        {/* Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <WorkspacePremiumOutlined sx={{ fontSize: 18, color: '#7C3AED' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
            Plano Premium
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, letterSpacing: '-0.02em' }}>
          {feature}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
          {description ?? `Este recurso é exclusivo para assinantes Premium. Faça upgrade para desbloquear ${feature.toLowerCase()} e muito mais.`}
        </Typography>

        {/* Perks */}
        {details && (
          <Box
            sx={{
              textAlign: 'left',
              backgroundColor: 'white',
              borderRadius: 3,
              border: '1px solid rgba(124,58,237,0.12)',
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>
              O que você vai ter acesso
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {details.perks.map((perk) => (
                <Box key={perk} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: '1px',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.6rem', color: 'white', fontWeight: 800 }}>✓</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5 }}>{perk}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* CTA */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<WorkspacePremiumOutlined />}
          onClick={() => router.push('/pricing')}
          sx={{
            py: 1.5,
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6D28D9, #4F46E5)',
              boxShadow: '0 6px 24px rgba(124,58,237,0.45)',
            },
          }}
        >
          Fazer upgrade — R$14,90/mês
        </Button>

        <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.disabled' }}>
          Cancele quando quiser · Sem fidelidade
        </Typography>
      </Box>
    </Box>
  );
}

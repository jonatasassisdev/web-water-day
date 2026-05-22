'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import RestaurantMenu from '@mui/icons-material/RestaurantMenu';
import DailyRing from '@/components/dashboard/DailyRing';
import ProtocolCard from '@/components/dashboard/ProtocolCard';
import QuickAdd from '@/components/dashboard/QuickAdd';
import WeeklyChart from '@/components/dashboard/WeeklyChart';
import TodayLogs from '@/components/dashboard/TodayLogs';
import DietOnboardingModal from '@/components/diet/DietOnboardingModal';
import { useDailySummary, useProtocol, useWeeklyHistory } from '@/lib/hooks/useDashboard';
import { useDietProtocol } from '@/lib/hooks/useDietProtocol';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { summary, isLoading: loadingDaily } = useDailySummary();
  const { history, isLoading: loadingHistory } = useWeeklyHistory();
  const { protocol, isLoading: loadingProtocol } = useProtocol();
  const { protocol: dietProtocol } = useDietProtocol();
  const [dietModalOpen, setDietModalOpen] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 3, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
          {greeting()}, {user?.name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Typography>
      </Box>

      {/* Main grid */}
      <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
        {/* Left column: size 8 */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Row 1: ring + quick add with equal height */}
            <Grid container spacing={2} sx={{ alignItems: 'stretch' }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ overflow: 'visible', height: '100%' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 }, height: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="subtitle2" sx={{ mb: 3, color: 'text.secondary', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                      Progresso de hoje
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <DailyRing
                        totalMl={summary?.totalMl ?? 0}
                        goalMl={summary?.goalMl ?? 2000}
                        progressPercent={summary?.progressPercent ?? 0}
                        remaining={summary?.remaining ?? 2000}
                        isLoading={loadingDaily}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 }, height: '100%', boxSizing: 'border-box' }}>
                    <QuickAdd />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Row 2: weekly chart */}
            <Card>
              <CardContent sx={{ p: { xs: 3, sm: 3 }, '&:last-child': { pb: 4 } }}>
                <WeeklyChart
                  history={history?.history ?? []}
                  goalMl={history?.goalMl ?? 2000}
                  daysGoalReached={history?.daysGoalReached ?? 0}
                  isLoading={loadingHistory}
                />
              </CardContent>
            </Card>

            {/* Row 3: today logs */}
            <Card>
              <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    Registros de hoje
                  </Typography>
                  {summary?.logs.length ? (
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {summary.logs.length} {summary.logs.length === 1 ? 'registro' : 'registros'}
                    </Typography>
                  ) : null}
                </Box>
                <TodayLogs logs={summary?.logs ?? []} isLoading={loadingDaily} />
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right column: size 4 — protocol + diet */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <ProtocolCard protocol={protocol} isLoading={loadingProtocol} />
              </CardContent>
            </Card>

            {/* Diet Protocol Card */}
            <Card sx={{
              background: dietProtocol
                ? 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)'
                : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
              border: dietProtocol ? '1px solid #A7F3D0' : '1px dashed #CBD5E1',
            }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <RestaurantMenu sx={{ fontSize: 14, color: 'white' }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: dietProtocol ? '#065F46' : 'text.primary' }}>
                    Protocolo de Dieta
                  </Typography>
                </Box>

                {dietProtocol ? (
                  <>
                    <Typography variant="body2" sx={{ color: '#047857', mb: 0.5 }}>
                      <strong>{dietProtocol.dailyCalories.toLocaleString('pt-BR')} kcal/dia</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                      {dietProtocol.goalsLabel} · {dietProtocol.mealsPerDay} refeições/dia
                    </Typography>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={() => router.push('/diet-protocol')}
                      sx={{ borderColor: '#10B981', color: '#10B981', '&:hover': { borderColor: '#059669', backgroundColor: 'rgba(16,185,129,0.04)' } }}
                    >
                      Ver protocolo completo
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2, lineHeight: 1.6 }}>
                      Crie um plano alimentar personalizado com IA para complementar sua hidratação.
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<AutoAwesome sx={{ fontSize: 14 }} />}
                      onClick={() => setDietModalOpen(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
                      }}
                    >
                      Criar Protocolo de Dieta
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <DietOnboardingModal
        open={dietModalOpen}
        onClose={() => setDietModalOpen(false)}
        onDone={() => { setDietModalOpen(false); router.push('/diet-protocol'); }}
      />
    </Box>
  );
}

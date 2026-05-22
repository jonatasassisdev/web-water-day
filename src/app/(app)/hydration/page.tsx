'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import WaterDrop from '@mui/icons-material/WaterDrop';
import TrendingUp from '@mui/icons-material/TrendingUp';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceLine, Tooltip as RechartsTooltip,
} from 'recharts';
import useSWR from 'swr';
import { useProtocol } from '@/lib/hooks/useDashboard';
import { waterLogApi, DayHistory } from '@/lib/api/water-log';
import PremiumGate from '@/components/ui/PremiumGate';

function useMonthHistory() {
  const { data, isLoading } = useSWR(
    'month-history',
    () => waterLogApi.getHistory(30),
    { refreshInterval: 60000 },
  );
  return { data, isLoading };
}

function calcStreak(history: DayHistory[]): number {
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const d of sorted) {
    if (d.goalReached) streak++;
    else break;
  }
  return streak;
}

function calcAvg(history: DayHistory[]): number {
  const withData = history.filter((d) => d.totalMl > 0);
  if (!withData.length) return 0;
  return Math.round(withData.reduce((s, d) => s + d.totalMl, 0) / withData.length);
}

function calcBest(history: DayHistory[]): number {
  return Math.max(...history.map((d) => d.totalMl), 0);
}

function calcWeekdayAvg(history: DayHistory[]): { day: string; avg: number; pct: number }[] {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const buckets: number[][] = Array.from({ length: 7 }, () => []);
  history.forEach((d) => {
    if (d.totalMl === 0) return;
    const dow = new Date(d.date + 'T12:00:00').getDay();
    buckets[dow].push(d.totalMl);
  });
  const avgs = buckets.map((b) => (b.length ? Math.round(b.reduce((s, v) => s + v, 0) / b.length) : 0));
  const max = Math.max(...avgs, 1);
  return labels.map((day, i) => ({ day, avg: avgs[i], pct: Math.round((avgs[i] / max) * 100) }));
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <Card>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Box sx={{ color }}>{icon}</Box>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
              {label}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
              {value}
            </Typography>
            {sub && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{sub}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <Box sx={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 2, p: 1.5, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: d.goalReached ? '#10B981' : '#2563EB' }}>
        {d.totalMl >= 1000 ? `${(d.totalMl / 1000).toFixed(1)}L` : `${d.totalMl}ml`}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        Meta: {(d.goalMl / 1000).toFixed(1)}L {d.goalReached ? '✅' : ''}
      </Typography>
    </Box>
  );
}

function HeatmapCalendar({ history, goalMl }: { history: DayHistory[]; goalMl: number }) {
  const byDate = Object.fromEntries(history.map((d) => [d.date, d]));
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const date = d.toISOString().split('T')[0];
    const entry = byDate[date];
    return { date, totalMl: entry?.totalMl ?? 0, goalReached: entry?.goalReached ?? false, isToday: date === today.toISOString().split('T')[0] };
  });

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Calendário — últimos 30 dias</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {days.map((d) => {
          const pct = goalMl > 0 ? Math.min(d.totalMl / goalMl, 1) : 0;
          const bg = d.goalReached ? '#10B981' : pct > 0.5 ? '#93C5FD' : pct > 0 ? '#DBEAFE' : '#F1F5F9';
          return (
            <Tooltip
              key={d.date}
              title={
                <Box>
                  <div>{new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</div>
                  <div>{d.totalMl > 0 ? `${d.totalMl}ml (${Math.round(pct * 100)}%)` : 'Sem registro'}</div>
                </Box>
              }
            >
              <Box sx={{
                width: 28, height: 28, borderRadius: 1, backgroundColor: bg,
                border: d.isToday ? '2px solid #2563EB' : '2px solid transparent',
                cursor: 'default', transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.15)' },
              }} />
            </Tooltip>
          );
        })}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
        {[
          { color: '#F1F5F9', label: 'Sem registro' },
          { color: '#DBEAFE', label: '< 50%' },
          { color: '#93C5FD', label: '50–99%' },
          { color: '#10B981', label: 'Meta atingida' },
        ].map((l) => (
          <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: 0.5, backgroundColor: l.color, border: '1px solid #E2E8F0' }} />
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.68rem' }}>{l.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function WeekdayBreakdown({ history }: { history: DayHistory[] }) {
  const data = calcWeekdayAvg(history);
  const max = Math.max(...data.map((d) => d.avg), 1);

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Média por dia da semana</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {data.map(({ day, avg, pct }) => (
          <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ width: 28, fontWeight: 600, color: 'text.secondary', flexShrink: 0 }}>
              {day}
            </Typography>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={max > 0 ? (avg / max) * 100 : 0}
                sx={{
                  height: 8, borderRadius: 99,
                  backgroundColor: '#F1F5F9',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 99,
                    backgroundColor: avg === max && avg > 0 ? '#10B981' : '#2563EB',
                  },
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ width: 44, textAlign: 'right', fontWeight: 600, color: avg === max && avg > 0 ? '#10B981' : 'text.secondary', flexShrink: 0 }}>
              {avg > 0 ? (avg >= 1000 ? `${(avg / 1000).toFixed(1)}L` : `${avg}ml`) : '—'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function HydrationPage() {
  const { data: monthData, isLoading: loadingMonth } = useMonthHistory();
  const { protocol, isLoading: loadingProtocol } = useProtocol();

  const history = monthData?.history ?? [];
  const goalMl = monthData?.goalMl ?? 2000;
  const streak = calcStreak(history);
  const avg = calcAvg(history);
  const best = calcBest(history);
  const daysReached = monthData?.daysGoalReached ?? 0;

  const chartData = history.map((d) => ({
    ...d,
    day: new Date(d.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
  }));

  return (
    <PremiumGate feature="Análise de Hidratação">
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 3, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
          Hidratação
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Seu histórico e análise de consumo de água
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
          { icon: <LocalFireDepartment fontSize="small" />, label: 'Sequência', value: `${streak} dias`, sub: 'consecutivos', color: '#F59E0B' },
          { icon: <WaterDrop fontSize="small" />, label: 'Média diária', value: avg >= 1000 ? `${(avg / 1000).toFixed(1)}L` : `${avg}ml`, sub: 'dias com registro', color: '#2563EB' },
          { icon: <EmojiEvents fontSize="small" />, label: 'Melhor dia', value: best >= 1000 ? `${(best / 1000).toFixed(1)}L` : `${best}ml`, sub: 'recorde pessoal', color: '#10B981' },
          { icon: <TrendingUp fontSize="small" />, label: 'Metas no mês', value: `${daysReached}/30`, sub: 'dias atingidos', color: '#8B5CF6' },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            {loadingMonth ? <Skeleton variant="rounded" height={80} /> : <StatCard {...s} />}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ alignItems: 'flex-start' }}>
        {/* Left — charts */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: 3 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2.5 }}>Consumo — últimos 30 dias</Typography>
                {loadingMonth ? <Skeleton variant="rounded" height={220} /> : (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={4} />
                      <YAxis tick={{ fontSize: 11, fill: '#CBD5E1' }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${v / 1000}L` : `${v}`} />
                      <ReferenceLine y={goalMl} stroke="#2563EB" strokeDasharray="4 4" strokeOpacity={0.35} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0' }} />
                      <Area
                        type="monotone" dataKey="totalMl" stroke="#2563EB" strokeWidth={2} fill="url(#fillBlue)"
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          if (!payload.goalReached) return <g key={props.key} />;
                          return <circle key={props.key} cx={cx} cy={cy} r={3} fill="#10B981" stroke="white" strokeWidth={1.5} />;
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: 3 } }}>
                {loadingMonth ? <Skeleton variant="rounded" height={120} /> : <HeatmapCalendar history={history} goalMl={goalMl} />}
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* Right — informational */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Weekday breakdown */}
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                {loadingMonth ? <Skeleton variant="rounded" height={160} /> : <WeekdayBreakdown history={history} />}
              </CardContent>
            </Card>

            {/* Protocol info */}
            <Card>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Seu protocolo</Typography>
                {loadingProtocol ? <Skeleton variant="rounded" height={100} /> : protocol ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: 'rgba(37,99,235,0.05)' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Meta diária</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2563EB' }}>
                        {(protocol.dailyGoalMl / 1000).toFixed(1)}L
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 2, backgroundColor: '#F8FAFC' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Progresso médio</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: avg >= protocol.dailyGoalMl ? '#10B981' : 'text.primary' }}>
                        {protocol.dailyGoalMl > 0 ? `${Math.round((avg / protocol.dailyGoalMl) * 100)}%` : '—'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>Protocolo não gerado ainda.</Typography>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            {protocol?.tips?.length ? (
              <Card>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LightbulbOutlined sx={{ fontSize: 16, color: '#F59E0B' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Dicas do protocolo</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {protocol.tips.slice(0, 3).map((tip, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#2563EB', mt: 0.75, flexShrink: 0 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{tip}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ) : null}
          </Box>
        </Grid>
      </Grid>
    </Box>
    </PremiumGate>
  );
}

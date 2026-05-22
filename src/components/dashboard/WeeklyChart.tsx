'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Tooltip as RechartsTooltip,
} from 'recharts';
import type { DayHistory } from '@/lib/api/water-log';

interface WeeklyChartProps {
  history: DayHistory[];
  goalMl: number;
  daysGoalReached: number;
  isLoading?: boolean;
}

const DAY_LABELS: Record<string, string> = {
  '0': 'Dom', '1': 'Seg', '2': 'Ter', '3': 'Qua',
  '4': 'Qui', '5': 'Sex', '6': 'Sáb',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_LABELS[d.getDay().toString()];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const { totalMl, goalMl, goalReached } = payload[0].payload;
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 2,
        p: 1.5,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: goalReached ? '#10B981' : '#2563EB' }}>
        {totalMl >= 1000 ? `${(totalMl / 1000).toFixed(1)}L` : `${totalMl}ml`}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        Meta: {(goalMl / 1000).toFixed(1)}L {goalReached ? '✅' : ''}
      </Typography>
    </Box>
  );
}

export default function WeeklyChart({ history, goalMl, daysGoalReached, isLoading }: WeeklyChartProps) {
  if (isLoading) {
    return <Skeleton variant="rounded" height={180} />;
  }

  const data = history.map((d) => ({
    ...d,
    day: formatDate(d.date),
    isToday: d.date === new Date().toISOString().split('T')[0],
  }));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Últimos 7 dias
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Meta atingida em{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {daysGoalReached} de 7
            </Box>{' '}
            dias
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#10B981' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Meta atingida</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: 1, backgroundColor: '#BFDBFE' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Abaixo da meta</Typography>
          </Box>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#94A3B8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#CBD5E1' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}L` : `${v}`}
          />
          <ReferenceLine
            y={goalMl}
            stroke="#2563EB"
            strokeDasharray="4 4"
            strokeOpacity={0.4}
          />
          <RechartsTooltip content={CustomTooltip} cursor={{ fill: 'rgba(37,99,235,0.04)' }} />
          <Bar dataKey="totalMl" radius={[6, 6, 2, 2]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.goalReached
                    ? entry.isToday
                      ? '#10B981'
                      : '#34D399'
                    : entry.isToday
                    ? '#2563EB'
                    : '#BFDBFE'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

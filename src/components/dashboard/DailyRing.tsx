'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

interface DailyRingProps {
  totalMl: number;
  goalMl: number;
  progressPercent: number;
  remaining: number;
  isLoading?: boolean;
}

const SIZE = 220;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DailyRing({
  totalMl,
  goalMl,
  progressPercent,
  remaining,
  isLoading,
}: DailyRingProps) {
  const clamped = Math.min(progressPercent, 100);
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;
  const goalReached = progressPercent >= 100;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={SIZE} height={SIZE} />
        <Skeleton width={160} height={20} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
            <linearGradient id="ringGradientDone" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />

          {/* Progress */}
          {clamped > 0 && (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={goalReached ? 'url(#ringGradientDone)' : 'url(#ringGradient)'}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              filter="url(#glow)"
              style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
            />
          )}
        </svg>

        {/* Center content */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {goalReached ? (
            <>
              <Typography sx={{ fontSize: '2rem', lineHeight: 1 }}>🎉</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981', mt: 0.5 }}>
                Meta atingida!
              </Typography>
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: 'text.primary',
                  letterSpacing: '-0.03em',
                }}
              >
                {(totalMl / 1000).toFixed(1)}
                <Typography component="span" sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.secondary', ml: 0.5 }}>
                  L
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, mt: 0.25 }}>
                de {(goalMl / 1000).toFixed(1)}L
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.75,
                  px: 1.5,
                  py: 0.25,
                  borderRadius: 99,
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  color: 'primary.main',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                {clamped}%
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {goalReached ? (
          <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
            Você completou sua meta de hoje!
          </Typography>
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Faltam{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {remaining >= 1000
                ? `${(remaining / 1000).toFixed(1)}L`
                : `${remaining}ml`}
            </Box>{' '}
            para completar a meta
          </Typography>
        )}
      </Box>
    </Box>
  );
}

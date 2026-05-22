import { ReactNode } from 'react';
import Box from '@mui/material/Box';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      {/* Left panel - Brand */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(160deg, #1D4ED8 0%, #0EA5E9 60%, #38BDF8 100%)',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '120%',
            height: '120%',
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 40%)
            `,
          },
        }}
      >
        <BrandContent />
      </Box>

      {/* Right panel - Form */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, sm: 6 },
          backgroundColor: '#ffffff',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function BrandContent() {
  return (
    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 420 }}>
      {/* Animated water drops */}
      <Box sx={{ mb: 5, position: 'relative', height: 160 }}>
        {[
          { size: 100, x: '50%', y: 0, opacity: 0.15, delay: 0 },
          { size: 72, x: '15%', y: '30%', opacity: 0.1, delay: 0.4 },
          { size: 56, x: '80%', y: '25%', opacity: 0.12, delay: 0.8 },
          { size: 44, x: '65%', y: '60%', opacity: 0.08, delay: 1.2 },
          { size: 36, x: '25%', y: '65%', opacity: 0.1, delay: 0.6 },
        ].map((drop, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: drop.size,
              height: drop.size,
              left: drop.x,
              top: drop.y,
              transform: 'translate(-50%, 0)',
              borderRadius: '50% 50% 40% 40%',
              border: `2px solid rgba(255,255,255,${drop.opacity + 0.2})`,
              backgroundColor: `rgba(255,255,255,${drop.opacity})`,
              animation: `float${i} 3s ease-in-out infinite`,
              animationDelay: `${drop.delay}s`,
              '@keyframes float0': {
                '0%, 100%': { transform: 'translate(-50%, 0px)' },
                '50%': { transform: 'translate(-50%, -12px)' },
              },
              '@keyframes float1': {
                '0%, 100%': { transform: 'translate(-50%, 0px)' },
                '50%': { transform: 'translate(-50%, -8px)' },
              },
              '@keyframes float2': {
                '0%, 100%': { transform: 'translate(-50%, 0px)' },
                '50%': { transform: 'translate(-50%, -10px)' },
              },
              '@keyframes float3': {
                '0%, 100%': { transform: 'translate(-50%, 0px)' },
                '50%': { transform: 'translate(-50%, -6px)' },
              },
              '@keyframes float4': {
                '0%, 100%': { transform: 'translate(-50%, 0px)' },
                '50%': { transform: 'translate(-50%, -9px)' },
              },
            }}
          />
        ))}
        {/* Main drop */}
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 4 10 4 15C4 19.42 7.58 23 12 23C16.42 23 20 19.42 20 15C20 10 12 2 12 2Z"
              fill="white"
              fillOpacity="0.9"
            />
            <path
              d="M8.5 16.5C8.5 16.5 9.5 19.5 13 19"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeOpacity="0.5"
            />
          </svg>
        </Box>
      </Box>

      <Box component="h1" sx={{ color: 'white', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', mb: 2, m: 0 }}>
        WaterDay
      </Box>
      <Box component="p" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.6, mb: 4, m: '8px 0 32px' }}>
        Hidratação inteligente com protocolo personalizado por IA.
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {[
          { value: '2,8L', label: 'Média diária' },
          { value: 'IA', label: 'Protocolo' },
          { value: '7+', label: 'Métricas' },
        ].map((stat) => (
          <Box
            key={stat.label}
            sx={{
              textAlign: 'center',
              px: 2,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Box sx={{ color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>{stat.value}</Box>
            <Box sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem', fontWeight: 500 }}>{stat.label}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

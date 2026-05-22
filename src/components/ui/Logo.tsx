import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'white';
}

export default function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = { sm: 28, md: 36, lg: 48 };
  const fontSizes = { sm: '1.1rem', md: '1.4rem', lg: '1.8rem' };
  const px = sizes[size];
  const color = variant === 'white' ? '#ffffff' : '#2563EB';
  const textColor = variant === 'white' ? '#ffffff' : '#0F172A';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: px,
          height: px,
          borderRadius: '50%',
          background: variant === 'white'
            ? 'rgba(255,255,255,0.25)'
            : 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          width={px * 0.55}
          height={px * 0.55}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 2C12 2 5 9.5 5 14.5C5 18.09 8.13 21 12 21C15.87 21 19 18.09 19 14.5C19 9.5 12 2 12 2Z"
            fill="white"
            fillOpacity={variant === 'white' ? 1 : 0.95}
          />
          <path
            d="M8.5 15.5C8.5 15.5 9 18 12 18"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity={0.6}
          />
        </svg>
      </Box>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: fontSizes[size],
          color: textColor,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          '& span': { color },
        }}
      >
        Water<span style={{ color: variant === 'white' ? 'rgba(255,255,255,0.7)' : '#2563EB' }}>Day</span>
      </Typography>
    </Box>
  );
}

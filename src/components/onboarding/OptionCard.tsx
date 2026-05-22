'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { alpha } from '@mui/material/styles';

interface OptionCardProps {
  value: string;
  label: string;
  description?: string;
  selected: boolean;
  multiSelect?: boolean;
  onClick: () => void;
}

export default function OptionCard({
  label,
  description,
  selected,
  multiSelect,
  onClick,
}: OptionCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        p: 2,
        borderRadius: 2.5,
        border: '2px solid',
        borderColor: selected ? 'primary.main' : '#E2E8F0',
        backgroundColor: selected ? alpha('#2563EB', 0.04) : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: selected ? 'primary.main' : '#94A3B8',
          backgroundColor: selected ? alpha('#2563EB', 0.06) : '#F8FAFC',
        },
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: selected ? 600 : 500,
            color: selected ? 'primary.main' : 'text.primary',
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.25, display: 'block' }}>
            {description}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          width: 22,
          height: 22,
          borderRadius: multiSelect ? 1 : '50%',
          border: '2px solid',
          borderColor: selected ? 'primary.main' : '#CBD5E1',
          backgroundColor: selected ? 'primary.main' : 'transparent',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        {selected && (
          <CheckCircle
            sx={{
              fontSize: 22,
              color: 'white',
              m: '-2px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}

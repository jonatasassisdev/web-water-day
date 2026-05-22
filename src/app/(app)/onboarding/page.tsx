import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Logo from '@/components/ui/Logo';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #F0F7FF 0%, #EFF6FF 50%, #F0F9FF 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 3, sm: 6 },
          py: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Logo size="sm" />
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Configuração inicial
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          px: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 560 }}>
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 99,
                backgroundColor: 'rgba(37,99,235,0.08)',
                border: '1px solid rgba(37,99,235,0.15)',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Protocolo personalizado por IA
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
              Vamos personalizar sua hidratação
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}>
              Responda algumas perguntas rápidas e nossa IA vai criar um protocolo ideal para o seu perfil.
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              boxShadow: '0px 4px 32px rgba(15, 23, 42, 0.06)',
              border: '1px solid #F1F5F9',
            }}
          >
            <OnboardingWizard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

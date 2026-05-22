'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';

const FEATURES = [
  {
    icon: <AutoAwesomeOutlined sx={{ fontSize: 28, color: '#2563EB' }} />,
    title: 'Protocolo com IA',
    desc: 'A IA analisa seu peso, rotina e objetivo para calcular sua meta de hidratação diária personalizada.',
    bg: '#EFF6FF',
  },
  {
    icon: <RestaurantOutlined sx={{ fontSize: 28, color: '#7C3AED' }} />,
    title: 'Plano alimentar IA',
    desc: 'Plano alimentar semanal com café, almoço, jantar e lanches — incluindo frutas, iogurte e substituições.',
    bg: '#F5F3FF',
    premium: true,
  },
  {
    icon: <BarChartOutlined sx={{ fontSize: 28, color: '#0EA5E9' }} />,
    title: 'Analytics completo',
    desc: 'Streak de dias consecutivos, heatmap e gráfico de evolução dos últimos 30 dias.',
    bg: '#F0F9FF',
  },
  {
    icon: <NotificationsOutlined sx={{ fontSize: 28, color: '#10B981' }} />,
    title: 'Lembretes inteligentes',
    desc: 'Notificações push e por e-mail no horário certo para nunca esquecer de se hidratar.',
    bg: '#F0FDF4',
  },
];

const STEPS = [
  { n: '1', title: 'Crie sua conta', desc: 'Cadastro rápido com e-mail e senha. Sem cartão necessário para começar.' },
  { n: '2', title: 'Faça o onboarding', desc: 'Informe seu peso, altura, rotina e preferências. Leva menos de 2 minutos.' },
  { n: '3', title: 'Comece hoje', desc: 'Seu protocolo personalizado fica pronto na hora. É só registrar sua água!' },
];

const FREE_ITEMS = [
  'Protocolo de hidratação com IA',
  'Registro diário de água',
  'Dashboard com progresso',
  'Analytics e histórico completo',
  'Notificações push e e-mail',
];

const PREMIUM_ITEMS = [
  'Tudo do plano Grátis',
  'Protocolo de dieta com IA',
  'Tracking de refeições diário',
  'Entradas livres de calorias',
  'Geração ilimitada de protocolos',
];

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, onboardingDone } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(onboardingDone ? '/dashboard' : '/onboarding');
    }
  }, [isAuthenticated, onboardingDone, router]);

  if (isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)' }}>
        <CircularProgress sx={{ color: '#2563EB' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>

      {/* Navbar */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #F1F5F9' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WaterDropOutlined sx={{ color: '#2563EB', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                WaterDay
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="text" sx={{ color: '#64748B' }} onClick={() => router.push('/login')}>
                Entrar
              </Button>
              <Button variant="contained" onClick={() => router.push('/register')}>
                Começar grátis
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #F0F9FF 60%, #ffffff 100%)', pt: { xs: 8, md: 14 }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3 }}>
            <Chip
              icon={<AutoAwesomeOutlined sx={{ fontSize: '16px !important' }} />}
              label="Protocolo gerado por Inteligência Artificial"
              sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #BFDBFE' }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, lineHeight: 1.1, color: '#0F172A' }}>
              Hidrate-se com
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}inteligência
              </Box>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, color: '#64748B', maxWidth: 560, lineHeight: 1.7 }}>
              O WaterDay usa IA para criar seu protocolo de hidratação e alimentação personalizado. Registre, acompanhe e evolua todos os dias.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 1 }}>
              <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={() => router.push('/register')}>
                Criar conta grátis
              </Button>
              <Button variant="outlined" size="large" onClick={() => router.push('/login')} sx={{ borderColor: '#CBD5E1', color: '#0F172A' }}>
                Já tenho conta
              </Button>
            </Box>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              Grátis para sempre · Sem cartão necessário
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em' }}>
              Recursos
            </Typography>
            <Typography variant="h3" sx={{ color: '#0F172A' }}>
              Tudo que você precisa
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 480 }}>
              Do protocolo personalizado até o tracking diário — tudo em um só lugar.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', border: '1px solid #F1F5F9', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0px 12px 40px rgba(15,23,42,0.10)' } }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      {f.icon}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1rem', color: '#0F172A' }}>
                        {f.title}
                      </Typography>
                      {f.premium && <Chip label="Premium" size="small" sx={{ bgcolor: '#F5F3FF', color: '#7C3AED', fontWeight: 700, fontSize: '0.65rem' }} />}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
                      {f.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em' }}>
              Como funciona
            </Typography>
            <Typography variant="h3" sx={{ color: '#0F172A' }}>
              Pronto em 3 passos
            </Typography>
          </Box>
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {STEPS.map((s) => (
              <Grid key={s.n} size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>{s.n}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#0F172A' }}>{s.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, maxWidth: 280 }}>{s.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em' }}>
              Planos
            </Typography>
            <Typography variant="h3" sx={{ color: '#0F172A' }}>
              Simples e transparente
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Comece grátis. Faça upgrade quando quiser.
            </Typography>
          </Box>
          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            <Grid size={{ xs: 12, sm: 10, md: 5 }}>
              <Card sx={{ height: '100%', border: '1px solid #E2E8F0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 700 }}>Grátis</Typography>
                  <Typography variant="h3" sx={{ mt: 1, mb: 0.5, color: '#0F172A' }}>R$0</Typography>
                  <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>Para sempre</Typography>
                  <Button fullWidth variant="outlined" onClick={() => router.push('/register')} sx={{ mb: 3, borderColor: '#CBD5E1', color: '#0F172A' }}>
                    Começar grátis
                  </Button>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {FREE_ITEMS.map((item) => (
                      <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <CheckCircleOutlined sx={{ fontSize: 18, color: '#10B981', mt: '1px', flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: '#374151' }}>{item}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 10, md: 5 }}>
              <Box sx={{ pt: { md: 0 } }}>
                <Card sx={{ height: '100%', border: '2px solid #7C3AED', position: 'relative', overflow: 'visible' }}>
                  <Box sx={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)' }}>
                    <Chip label="Recomendado" sx={{ bgcolor: '#7C3AED', color: '#fff', fontWeight: 700, fontSize: '0.75rem' }} />
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="overline" sx={{ color: '#7C3AED', fontWeight: 700 }}>Premium</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1, mb: 0.5 }}>
                      <Typography variant="h3" sx={{ color: '#0F172A' }}>R$14,90</Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>/mês</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>Cancele quando quiser</Typography>
                    <Button fullWidth variant="contained" onClick={() => router.push('/register')} sx={{ mb: 3, background: 'linear-gradient(135deg, #7C3AED, #6D28D9) !important' }}>
                      Assinar Premium
                    </Button>
                    <Divider sx={{ mb: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {PREMIUM_ITEMS.map((item) => (
                        <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <CheckCircleOutlined sx={{ fontSize: 18, color: '#7C3AED', mt: '1px', flexShrink: 0 }} />
                          <Typography variant="body2" sx={{ color: '#374151' }}>{item}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA final */}
      <Box sx={{ py: { xs: 8, md: 12 }, background: 'linear-gradient(135deg, #1D4ED8 0%, #0369A1 100%)' }}>
        <Container maxWidth="sm">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 3 }}>
            <WaterDropOutlined sx={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
            <Typography variant="h3" sx={{ color: '#ffffff' }}>
              Comece hoje mesmo
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
              Crie sua conta grátis e descubra quanto você realmente precisa beber por dia.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => router.push('/register')}
              sx={{ bgcolor: '#ffffff !important', color: '#1D4ED8', fontWeight: 700, '&:hover': { bgcolor: '#F1F5F9 !important' } }}
            >
              Criar conta grátis
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: '#0F172A' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WaterDropOutlined sx={{ color: '#60A5FA', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 700 }}>WaterDay</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#475569' }}>
              © {new Date().getFullYear()} WaterDay · Todos os direitos reservados
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}

'use client';

import { useAuthStore } from '@/stores/auth.store';
import ArrowForward from '@mui/icons-material/ArrowForward';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined';
import WaterDropOutlined from '@mui/icons-material/WaterDropOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Logo from '@/components/ui/Logo';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] } }),
};

const MotionBox = motion.create(Box);

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
      <Box component={motion.div} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 1px 12px rgba(15,23,42,0.06)' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
              <Logo size="sm" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button variant="text" sx={{ color: '#64748B', fontWeight: 500, '&:hover': { bgcolor: '#F8FAFC' } }} onClick={() => router.push('/login')}>
                Entrar
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/register')}
                sx={{ px: 2.5, background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%) !important', boxShadow: '0 4px 14px rgba(37,99,235,0.35) !important', '&:hover': { boxShadow: '0 6px 20px rgba(37,99,235,0.45) !important' } }}
              >
                Começar grátis
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #F0F9FF 60%, #ffffff 100%)', pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <MotionBox variants={fadeUp} custom={0} initial="hidden" animate="show">
                  <Chip
                    icon={<AutoAwesomeOutlined sx={{ fontSize: '16px !important' }} />}
                    label="Protocolo gerado por Inteligência Artificial"
                    sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #BFDBFE', alignSelf: 'flex-start' }}
                  />
                </MotionBox>
                <MotionBox variants={fadeUp} custom={1} initial="hidden" animate="show">
                  <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, lineHeight: 1.1, color: '#0F172A' }}>
                    Hidrate-se com
                    <Box component="span" sx={{ background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      {' '}inteligência
                    </Box>
                  </Typography>
                </MotionBox>
                <MotionBox variants={fadeUp} custom={2} initial="hidden" animate="show">
                  <Typography variant="h6" sx={{ fontWeight: 400, color: '#64748B', lineHeight: 1.7 }}>
                    O WaterDay usa IA para criar seu protocolo de hidratação e alimentação personalizado. Registre, acompanhe e evolua todos os dias.
                  </Typography>
                </MotionBox>
                <MotionBox variants={fadeUp} custom={3} initial="hidden" animate="show" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Button variant="contained" size="large" endIcon={<ArrowForward />} onClick={() => router.push('/register')}>
                    Criar conta grátis
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => router.push('/login')} sx={{ borderColor: '#CBD5E1', color: '#0F172A' }}>
                    Já tenho conta
                  </Button>
                </MotionBox>
                <MotionBox variants={fadeUp} custom={4} initial="hidden" animate="show">
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Grátis para sempre · Sem cartão necessário
                  </Typography>
                </MotionBox>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                sx={{ position: 'relative', width: '100%', maxWidth: { xs: 380, md: 620 }, height: { xs: 360, md: 580 } }}
              >
                <Image
                  src="/hero.svg"
                  alt="Pessoa se hidratando"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#ffffff' }}>
        <Container maxWidth="lg">
          <MotionBox variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5, mb: 6 }}>
            <Typography variant="overline" sx={{ color: '#2563EB', fontWeight: 700, letterSpacing: '0.1em' }}>
              Recursos
            </Typography>
            <Typography variant="h3" sx={{ color: '#0F172A' }}>
              Tudo que você precisa
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 480 }}>
              Do protocolo personalizado até o tracking diário — tudo em um só lugar.
            </Typography>
          </MotionBox>
          <Grid container spacing={3}>
            {FEATURES.map((f, i) => (
              <Grid key={f.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <MotionBox variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ height: '100%' }}>
                  <Card sx={{ height: '100%', border: '1px solid #F1F5F9', transition: 'transform 0.25s, box-shadow 0.25s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0px 16px 48px rgba(15,23,42,0.12)' } }}>
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
                </MotionBox>
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
            {STEPS.map((s, i) => (
              <Grid key={s.n} size={{ xs: 12, md: 4 }}>
                <MotionBox variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #2563EB, #0EA5E9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem' }}>{s.n}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#0F172A' }}>{s.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.7, maxWidth: 280 }}>{s.desc}</Typography>
                </MotionBox>
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
              <MotionBox variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ height: '100%' }}>
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
              </MotionBox>
            </Grid>
            <Grid size={{ xs: 12, sm: 10, md: 5 }}>
              <MotionBox variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }} sx={{ pt: { md: 0 } }}>
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
              </MotionBox>
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

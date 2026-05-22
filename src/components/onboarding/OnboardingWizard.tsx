'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { AnimatePresence, motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowForward from '@mui/icons-material/ArrowForward';
import ArrowBack from '@mui/icons-material/ArrowBack';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import StepProgress from './StepProgress';
import OptionCard from './OptionCard';
import { onboardingApi } from '@/lib/api/onboarding';
import { useAuthStore } from '@/stores/auth.store';
import type { ActivityLevel, Climate, HydrationGoal, OnboardingData } from '@/lib/api/types';

const TOTAL_STEPS = 7;

const ACTIVITY_OPTIONS = [
  { value: 'SEDENTARY', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
  { value: 'LIGHTLY_ACTIVE', label: 'Levemente ativo', description: 'Exercício leve 1-3x/semana' },
  { value: 'MODERATELY_ACTIVE', label: 'Moderadamente ativo', description: 'Exercício 3-5x/semana' },
  { value: 'VERY_ACTIVE', label: 'Muito ativo', description: 'Exercício intenso 6-7x/semana' },
  { value: 'EXTREMELY_ACTIVE', label: 'Extremamente ativo', description: 'Atleta ou trabalho físico' },
];

const CLIMATE_OPTIONS = [
  { value: 'COLD', label: 'Frio', description: 'Temperaturas baixas' },
  { value: 'TEMPERATE', label: 'Temperado', description: 'Clima ameno' },
  { value: 'HOT', label: 'Quente', description: 'Calor moderado a intenso' },
  { value: 'TROPICAL', label: 'Tropical', description: 'Calor e umidade altos' },
];

const HEALTH_OPTIONS = [
  { value: 'hypertension', label: 'Hipertensão' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'kidney_disease', label: 'Doença renal' },
  { value: 'heart_disease', label: 'Doença cardíaca' },
  { value: 'pregnancy', label: 'Gravidez' },
  { value: 'breastfeeding', label: 'Amamentação' },
];

const GOAL_OPTIONS = [
  { value: 'GENERAL_HEALTH', label: 'Saúde geral', description: 'Manter-me saudável e hidratado' },
  { value: 'WEIGHT_LOSS', label: 'Perda de peso', description: 'Usar hidratação para emagrecer' },
  { value: 'ATHLETIC_PERFORMANCE', label: 'Performance atlética', description: 'Otimizar rendimento nos treinos' },
  { value: 'SKIN_HEALTH', label: 'Saúde da pele', description: 'Melhorar aparência da pele' },
  { value: 'DETOX', label: 'Detox', description: 'Auxiliar na eliminação de toxinas' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingWizard() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const setOnboardingDone = useAuthStore((s) => s.setOnboardingDone);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>('');
  const [climate, setClimate] = useState<Climate | ''>('');
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [goal, setGoal] = useState<HydrationGoal | ''>('');

  const toggleHealth = (val: string) => {
    setHealthConditions((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!weight && Number(weight) > 0;
      case 2: return !!height && Number(height) > 0;
      case 3: return !!age && Number(age) > 0;
      case 4: return !!activityLevel;
      case 5: return !!climate;
      case 6: return true;
      case 7: return !!goal;
      default: return false;
    }
  };

  const navigate = (delta: number) => {
    setDirection(delta);
    setStep((s) => s + delta);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data: OnboardingData = {
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
        activityLevel: activityLevel as ActivityLevel,
        climate: climate as Climate,
        healthConditions,
        goal: goal as HydrationGoal,
      };
      await onboardingApi.complete(data);
      setOnboardingDone();
      enqueueSnackbar('Protocolo gerado com sucesso!', { variant: 'success' });
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao gerar protocolo';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <StepContent
        title="Qual é o seu peso?"
        subtitle="Usamos para calcular sua necessidade hídrica base."
      >
        <TextField
          label="Peso"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          autoFocus
          slotProps={{
            htmlInput: { min: 1, max: 500 },
            input: { endAdornment: <InputAdornment position="end">kg</InputAdornment> },
          }}
        />
      </StepContent>
    ),
    2: (
      <StepContent title="Qual é a sua altura?" subtitle="Ajuda a refinar o cálculo do seu protocolo.">
        <TextField
          label="Altura"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          fullWidth
          autoFocus
          slotProps={{
            htmlInput: { min: 50, max: 300 },
            input: { endAdornment: <InputAdornment position="end">cm</InputAdornment> },
          }}
        />
      </StepContent>
    ),
    3: (
      <StepContent title="Quantos anos você tem?" subtitle="A idade influencia as necessidades de hidratação.">
        <TextField
          label="Idade"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          fullWidth
          autoFocus
          slotProps={{
            htmlInput: { min: 1, max: 120 },
            input: { endAdornment: <InputAdornment position="end">anos</InputAdornment> },
          }}
        />
      </StepContent>
    ),
    4: (
      <StepContent title="Nível de atividade física" subtitle="Como você se exercita com frequência?">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {ACTIVITY_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              {...opt}
              selected={activityLevel === opt.value}
              onClick={() => setActivityLevel(opt.value as ActivityLevel)}
            />
          ))}
        </Box>
      </StepContent>
    ),
    5: (
      <StepContent title="Como é o clima onde você vive?" subtitle="O clima afeta diretamente a perda de líquidos.">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {CLIMATE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              {...opt}
              selected={climate === opt.value}
              onClick={() => setClimate(opt.value as Climate)}
            />
          ))}
        </Box>
      </StepContent>
    ),
    6: (
      <StepContent
        title="Condições de saúde"
        subtitle="Opcional — selecione se tiver alguma. Isso personaliza ainda mais seu protocolo."
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {HEALTH_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              {...opt}
              selected={healthConditions.includes(opt.value)}
              multiSelect
              onClick={() => toggleHealth(opt.value)}
            />
          ))}
        </Box>
      </StepContent>
    ),
    7: (
      <StepContent title="Qual é o seu objetivo?" subtitle="Isso define o foco do seu protocolo de hidratação.">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {GOAL_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              {...opt}
              selected={goal === opt.value}
              onClick={() => setGoal(opt.value as HydrationGoal)}
            />
          ))}
        </Box>
      </StepContent>
    ),
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 520, mx: 'auto', overflow: 'hidden' }}>
      <StepProgress current={step} total={TOTAL_STEPS} />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          {stepContent[step]}
        </motion.div>
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          disabled={step === 1}
          startIcon={<ArrowBack />}
          sx={{ borderRadius: 2.5, borderColor: '#E2E8F0', color: 'text.secondary', '&:hover': { borderColor: '#94A3B8' }, minWidth: 110 }}
        >
          Voltar
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            variant="contained"
            onClick={() => navigate(1)}
            disabled={!canProceed()}
            endIcon={<ArrowForward />}
            sx={{ borderRadius: 2.5, minWidth: 140, flex: 1, maxWidth: 200 }}
          >
            Continuar
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!canProceed() || loading}
            startIcon={loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <AutoAwesome />}
            sx={{
              borderRadius: 2.5,
              flex: 1,
              maxWidth: 240,
              background: 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)',
              fontWeight: 700,
            }}
          >
            {loading ? 'Gerando protocolo…' : 'Gerar meu protocolo'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

function StepContent({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.75, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
        {subtitle}
      </Typography>
      {children}
    </Box>
  );
}

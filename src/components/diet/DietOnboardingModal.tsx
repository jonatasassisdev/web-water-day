'use client';

import { useState, KeyboardEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Close from '@mui/icons-material/Close';
import RestaurantMenu from '@mui/icons-material/RestaurantMenu';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import Add from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { dietProtocolApi } from '@/lib/api/diet-protocol';
import { refreshDietProtocol } from '@/lib/hooks/useDietProtocol';

interface DietOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const DIET_GOALS = [
  { value: 'lose_weight', label: 'Perder peso', icon: '⚖️' },
  { value: 'gain_muscle', label: 'Ganhar massa', icon: '💪' },
  { value: 'maintain_weight', label: 'Manter peso', icon: '🎯' },
  { value: 'improve_energy', label: 'Mais energia', icon: '⚡' },
  { value: 'better_nutrition', label: 'Melhor nutrição', icon: '🥗' },
];

const RESTRICTIONS = [
  { value: 'none', label: 'Nenhuma', icon: '✅' },
  { value: 'vegetarian', label: 'Vegetariano', icon: '🥦' },
  { value: 'vegan', label: 'Vegano', icon: '🌱' },
  { value: 'gluten_free', label: 'Sem glúten', icon: '🌾' },
  { value: 'lactose_free', label: 'Sem lactose', icon: '🥛' },
  { value: 'low_carb', label: 'Low carb', icon: '🥩' },
];

const MEALS_OPTIONS = [
  { value: 3, label: '3 refeições', desc: 'Café, almoço e jantar' },
  { value: 4, label: '4 refeições', desc: '+ 1 lanche' },
  { value: 5, label: '5 refeições', desc: '+ 2 lanches' },
  { value: 6, label: '6 refeições', desc: '+ 3 lanches' },
];

const HEALTH_CONDITIONS = [
  { value: 'none', label: 'Nenhuma' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'hypertension', label: 'Hipertensão' },
  { value: 'high_cholesterol', label: 'Colesterol alto' },
  { value: 'celiac', label: 'Doença celíaca' },
  { value: 'kidney_disease', label: 'Doença renal' },
];

const COMMON_DISLIKES = [
  'Brócolis', 'Couve-flor', 'Espinafre', 'Couve', 'Beterraba',
  'Fígado', 'Sardinha', 'Atum', 'Berinjela', 'Chuchu',
  'Quiabo', 'Jiló', 'Pimentão', 'Cebola', 'Alho',
];

const STEPS = ['Objetivo', 'Restrições', 'Preferências', 'Refeições', 'Saúde'];

export default function DietOnboardingModal({ open, onClose, onDone }: DietOnboardingModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);

  const [dietGoals, setDietGoals] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [mealsPerDay, setMealsPerDay] = useState(0);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [foodDislikes, setFoodDislikes] = useState<string[]>([]);
  const [saladUnlimited, setSaladUnlimited] = useState(false);
  const [dislikeInput, setDislikeInput] = useState('');

  const toggleGoal = (val: string) =>
    setDietGoals((p) => p.includes(val) ? p.filter((v) => v !== val) : [...p, val]);

  const toggleRestriction = (val: string) => {
    if (val === 'none') { setRestrictions(['none']); return; }
    setRestrictions((p) => {
      const without = p.filter((v) => v !== 'none');
      return without.includes(val) ? without.filter((v) => v !== val) : [...without, val];
    });
  };

  const toggleHealth = (val: string) => {
    if (val === 'none') { setHealthConditions(['none']); return; }
    setHealthConditions((p) => {
      const without = p.filter((v) => v !== 'none');
      return without.includes(val) ? without.filter((v) => v !== val) : [...without, val];
    });
  };

  const toggleDislike = (food: string) =>
    setFoodDislikes((p) => p.includes(food) ? p.filter((v) => v !== food) : [...p, food]);

  const addCustomDislike = () => {
    const val = dislikeInput.trim();
    if (!val || foodDislikes.includes(val)) { setDislikeInput(''); return; }
    setFoodDislikes((p) => [...p, val]);
    setDislikeInput('');
  };

  const handleDislikeKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); addCustomDislike(); }
  };

  const canNext = () => {
    if (step === 0) return dietGoals.length > 0;
    if (step === 1) return restrictions.length > 0;
    if (step === 2) return true; // preferences are optional
    if (step === 3) return mealsPerDay > 0;
    if (step === 4) return healthConditions.length > 0;
    return false;
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) { setStep((s) => s + 1); return; }

    setGenerating(true);
    try {
      const freeFormPreferences = saladUnlimited ? ['salada à vontade nas refeições principais'] : [];
      await dietProtocolApi.generate({
        dietGoals,
        restrictions: restrictions.filter((r) => r !== 'none'),
        mealsPerDay,
        healthConditions: healthConditions.filter((h) => h !== 'none'),
        foodDislikes,
        freeFormPreferences,
      });
      await refreshDietProtocol();
      enqueueSnackbar('Protocolo de dieta gerado!', { variant: 'success' });
      onDone();
    } catch {
      enqueueSnackbar('Erro ao gerar protocolo. Tente novamente.', { variant: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleClose = () => {
    if (generating) return;
    setStep(0);
    setDietGoals([]);
    setRestrictions([]);
    setMealsPerDay(0);
    setHealthConditions([]);
    setFoodDislikes([]);
    setSaladUnlimited(false);
    setDislikeInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box sx={{ px: 3, pt: 3, pb: 2, borderBottom: '1px solid #F1F5F9' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RestaurantMenu sx={{ fontSize: 18, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Protocolo de Dieta</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {STEPS[step]} • Passo {step + 1} de {STEPS.length}
                </Typography>
              </Box>
            </Box>
            {!generating && (
              <IconButton size="small" onClick={handleClose} sx={{ color: 'text.disabled' }}>
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
          <LinearProgress
            variant="determinate"
            value={((step + 1) / STEPS.length) * 100}
            sx={{ height: 4, borderRadius: 2, backgroundColor: '#F1F5F9', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #10B981, #059669)', borderRadius: 2 } }}
          />
        </Box>

        {/* Body */}
        <Box sx={{ px: 3, py: 3, minHeight: 300 }}>
          {generating ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 280, gap: 2 }}>
              <CircularProgress size={48} sx={{ color: '#10B981' }} />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Gerando seu protocolo...</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                A IA está criando um plano alimentar personalizado para você
              </Typography>
            </Box>

          ) : step === 0 ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Quais são seus objetivos alimentares?</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Pode selecionar mais de um</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {DIET_GOALS.map((g) => {
                  const selected = dietGoals.includes(g.value);
                  return (
                    <Box key={g.value} onClick={() => toggleGoal(g.value)} sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.5, borderRadius: 2, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s ease', borderColor: selected ? '#10B981' : '#E2E8F0', backgroundColor: selected ? 'rgba(16,185,129,0.06)' : 'white' }}>
                      <Typography sx={{ fontSize: '1.4rem' }}>{g.icon}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: selected ? 700 : 500, flex: 1 }}>{g.label}</Typography>
                      {selected && <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: '0.7rem', color: 'white', fontWeight: 700 }}>✓</Typography></Box>}
                    </Box>
                  );
                })}
              </Box>
            </>

          ) : step === 1 ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Possui alguma restrição alimentar?</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Pode selecionar mais de uma</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {RESTRICTIONS.map((r) => {
                  const selected = restrictions.includes(r.value);
                  return (
                    <Chip key={r.value} label={`${r.icon} ${r.label}`} onClick={() => toggleRestriction(r.value)}
                      sx={{ fontWeight: selected ? 700 : 500, backgroundColor: selected ? 'rgba(16,185,129,0.1)' : '#F8FAFC', borderColor: selected ? '#10B981' : '#E2E8F0', color: selected ? '#065F46' : 'text.secondary', border: '2px solid', cursor: 'pointer' }}
                    />
                  );
                })}
              </Box>
            </>

          ) : step === 2 ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Preferências alimentares</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>
                A IA vai evitar esses alimentos no seu protocolo
              </Typography>

              {/* Salad toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderRadius: 2, border: '1px solid #E2E8F0', mb: 2, backgroundColor: saladUnlimited ? 'rgba(16,185,129,0.05)' : 'white' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Salada à vontade</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Inclui salada verde como acompanhamento livre nas refeições</Typography>
                </Box>
                <Switch
                  checked={saladUnlimited}
                  onChange={(e) => setSaladUnlimited(e.target.checked)}
                  sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#10B981' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#10B981' } }}
                />
              </Box>

              {/* Dislikes */}
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                Alimentos que não gosta
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1.5 }}>
                <TextField
                  size="small" placeholder="Digitar alimento..." value={dislikeInput}
                  onChange={(e) => setDislikeInput(e.target.value)}
                  onKeyDown={handleDislikeKey}
                  sx={{ flex: 1 }}
                />
                <Button variant="outlined" size="small" onClick={addCustomDislike} disabled={!dislikeInput.trim()} sx={{ borderColor: '#E2E8F0', minWidth: 40, px: 1.5 }}>
                  <Add fontSize="small" />
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                {COMMON_DISLIKES.map((food) => {
                  const selected = foodDislikes.includes(food);
                  return (
                    <Chip key={food} label={food} size="small" onClick={() => toggleDislike(food)}
                      sx={{ fontWeight: selected ? 700 : 400, backgroundColor: selected ? 'rgba(239,68,68,0.08)' : '#F8FAFC', borderColor: selected ? '#EF4444' : '#E2E8F0', color: selected ? '#DC2626' : 'text.secondary', border: '1.5px solid', cursor: 'pointer', fontSize: '0.78rem' }}
                    />
                  );
                })}
              </Box>

              {foodDislikes.filter((f) => !COMMON_DISLIKES.includes(f)).length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {foodDislikes.filter((f) => !COMMON_DISLIKES.includes(f)).map((food) => (
                    <Chip key={food} label={food} size="small" onDelete={() => toggleDislike(food)}
                      sx={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: '#EF4444', color: '#DC2626', border: '1.5px solid', fontWeight: 600, fontSize: '0.78rem' }}
                    />
                  ))}
                </Box>
              )}
            </>

          ) : step === 3 ? (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Quantas refeições por dia você prefere?</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Isso vai guiar o plano alimentar diário</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {MEALS_OPTIONS.map((m) => (
                  <Box key={m.value} onClick={() => setMealsPerDay(m.value)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderRadius: 2, border: '2px solid', cursor: 'pointer', transition: 'all 0.15s ease', borderColor: mealsPerDay === m.value ? '#10B981' : '#E2E8F0', backgroundColor: mealsPerDay === m.value ? 'rgba(16,185,129,0.06)' : 'white' }}>
                    <Typography variant="body2" sx={{ fontWeight: mealsPerDay === m.value ? 700 : 500 }}>{m.label}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{m.desc}</Typography>
                  </Box>
                ))}
              </Box>
            </>

          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>Possui alguma condição de saúde?</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>Importante para personalizar seu protocolo</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {HEALTH_CONDITIONS.map((h) => {
                  const selected = healthConditions.includes(h.value);
                  return (
                    <Chip key={h.value} label={h.label} onClick={() => toggleHealth(h.value)}
                      sx={{ fontWeight: selected ? 700 : 500, backgroundColor: selected ? 'rgba(16,185,129,0.1)' : '#F8FAFC', borderColor: selected ? '#10B981' : '#E2E8F0', color: selected ? '#065F46' : 'text.secondary', border: '2px solid', cursor: 'pointer' }}
                    />
                  );
                })}
              </Box>
            </>
          )}
        </Box>

        {/* Footer */}
        {!generating && (
          <Box sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="text" onClick={() => setStep((s) => s - 1)} disabled={step === 0} sx={{ color: 'text.secondary' }}>
              Voltar
            </Button>
            <Button
              variant="contained" onClick={handleNext} disabled={!canNext()}
              startIcon={step === STEPS.length - 1 ? <AutoAwesome /> : undefined}
              sx={{ px: 3, py: 1, background: 'linear-gradient(135deg, #10B981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' }, '&:disabled': { opacity: 0.5 } }}
            >
              {step === STEPS.length - 1 ? 'Gerar Protocolo' : 'Próximo'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

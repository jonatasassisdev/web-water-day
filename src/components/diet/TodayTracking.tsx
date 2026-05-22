'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import Add from '@mui/icons-material/Add';
import LocalFireDepartment from '@mui/icons-material/LocalFireDepartment';
import { useSnackbar } from 'notistack';
import useSWR from 'swr';
import { dietLogApi } from '@/lib/api/diet-log';
import { DietProtocol } from '@/lib/api/diet-protocol';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  morningSnack: 'Lanche da manhã',
  lunch: 'Almoço',
  afternoonSnack: 'Lanche da tarde',
  dinner: 'Jantar',
  eveningSnack: 'Ceia',
};

interface Props {
  protocol: DietProtocol;
}

export default function TodayTracking({ protocol }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [addOpen, setAddOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, mutate, isLoading } = useSWR('diet-log-today', () => dietLogApi.getToday());

  const mealKeys = Object.entries(protocol.mealPlan as Record<string, any>)
    .filter(([, slot]) => slot?.items?.length > 0)
    .map(([key]) => key);

  const checkedCount = data?.checkedMeals.length ?? 0;
  const totalMeals = mealKeys.length;
  const progressPct = totalMeals > 0 ? Math.round((checkedCount / totalMeals) * 100) : 0;

  const handleToggle = async (mealKey: string) => {
    if (!data) return;
    const wasChecked = data.checkedMeals.includes(mealKey);
    // Optimistic update
    mutate(
      { ...data, checkedMeals: wasChecked ? data.checkedMeals.filter((k) => k !== mealKey) : [...data.checkedMeals, mealKey] },
      false,
    );
    try {
      await dietLogApi.toggleMeal(mealKey);
      mutate();
    } catch {
      mutate();
      enqueueSnackbar('Erro ao atualizar refeição', { variant: 'error' });
    }
  };

  const handleAddEntry = async () => {
    if (!foodName.trim()) return;
    setSaving(true);
    try {
      await dietLogApi.addEntry(foodName.trim(), calories ? parseInt(calories) : undefined, notes || undefined);
      await mutate();
      setFoodName('');
      setCalories('');
      setNotes('');
      setAddOpen(false);
      enqueueSnackbar('Alimento registrado!', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erro ao registrar', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await dietLogApi.deleteEntry(id);
      mutate();
    } catch {
      enqueueSnackbar('Erro ao remover', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={200} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Progress summary */}
      <Card>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Progresso do dia</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {checkedCount} de {totalMeals} refeições concluídas
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: progressPct === 100 ? '#10B981' : '#2563EB', lineHeight: 1 }}>
              {progressPct}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 8, borderRadius: 99, backgroundColor: '#F1F5F9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 99,
                backgroundColor: progressPct === 100 ? '#10B981' : '#2563EB',
              },
            }}
          />
          {data && data.totalExtraCalories > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1.5 }}>
              <LocalFireDepartment sx={{ fontSize: 14, color: '#F59E0B' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                +<strong>{data.totalExtraCalories} kcal</strong> extras registrados hoje
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Meal checklist */}
      <Card>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Refeições do protocolo</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {mealKeys.map((key) => {
              const checked = data?.checkedMeals.includes(key) ?? false;
              return (
                <Box
                  key={key}
                  onClick={() => handleToggle(key)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 1, borderRadius: 2, cursor: 'pointer',
                    backgroundColor: checked ? 'rgba(16,185,129,0.06)' : 'transparent',
                    border: '1px solid',
                    borderColor: checked ? 'rgba(16,185,129,0.2)' : '#F1F5F9',
                    transition: 'all 0.15s ease',
                    '&:hover': { backgroundColor: checked ? 'rgba(16,185,129,0.1)' : '#F8FAFC' },
                  }}
                >
                  <Checkbox
                    checked={checked}
                    size="small"
                    disableRipple
                    sx={{
                      p: 0,
                      color: '#CBD5E1',
                      '&.Mui-checked': { color: '#10B981' },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: checked ? 600 : 400,
                      color: checked ? '#065F46' : 'text.primary',
                      textDecoration: checked ? 'none' : 'none',
                      flex: 1,
                    }}
                  >
                    {MEAL_LABELS[key] ?? key}
                  </Typography>
                  {checked && (
                    <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>✓ Feito</Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Free entries */}
      <Card>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Extras do dia</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Alimentos fora do protocolo
              </Typography>
            </Box>
            <Button
              size="small"
              startIcon={<Add sx={{ fontSize: 16 }} />}
              onClick={() => setAddOpen((v) => !v)}
              variant={addOpen ? 'contained' : 'outlined'}
              sx={{
                borderRadius: 2, fontSize: '0.75rem',
                ...(addOpen
                  ? { background: 'linear-gradient(135deg,#2563EB,#0EA5E9)', '&:hover': { background: 'linear-gradient(135deg,#1D4ED8,#0284C7)' } }
                  : { borderColor: '#E2E8F0', color: 'text.secondary' }),
              }}
            >
              Adicionar
            </Button>
          </Box>

          <Collapse in={addOpen}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2, p: 2, borderRadius: 2, backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <TextField
                size="small" label="Alimento" value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddEntry()}
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small" label="Calorias (opcional)" type="number" value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  sx={{ flex: 1 }}
                  slotProps={{ htmlInput: { min: 0 } }}
                />
                <TextField
                  size="small" label="Observação" value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ flex: 2 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancelar</Button>
                <Button
                  size="small" variant="contained" disabled={!foodName.trim() || saving}
                  onClick={handleAddEntry}
                  sx={{ background: 'linear-gradient(135deg,#2563EB,#0EA5E9)' }}
                >
                  Salvar
                </Button>
              </Box>
            </Box>
          </Collapse>

          {data?.freeEntries.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', textAlign: 'center', py: 2 }}>
              Nenhum extra registrado hoje
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data?.freeEntries.map((entry) => (
                <Box
                  key={entry.id}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, borderRadius: 2, border: '1px solid #F1F5F9', backgroundColor: '#FAFCFF' }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{entry.foodName}</Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {entry.calories != null && (
                        <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600 }}>
                          {entry.calories} kcal
                        </Typography>
                      )}
                      {entry.notes && (
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>{entry.notes}</Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => handleDeleteEntry(entry.id)} sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444' } }}>
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowBack from '@mui/icons-material/ArrowBack';
import RestaurantMenu from '@mui/icons-material/RestaurantMenu';
import AutoAwesome from '@mui/icons-material/AutoAwesome';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import Done from '@mui/icons-material/Done';
import CancelOutlined from '@mui/icons-material/CancelOutlined';
import Refresh from '@mui/icons-material/Refresh';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import CalendarToday from '@mui/icons-material/CalendarToday';
import MenuBook from '@mui/icons-material/MenuBook';
import { useDietProtocol } from '@/lib/hooks/useDietProtocol';
import DietOnboardingModal from '@/components/diet/DietOnboardingModal';
import TodayTracking from '@/components/diet/TodayTracking';
import { MealSlot, SupplementRecommendation } from '@/lib/api/diet-protocol';

const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da manhã',
  morningSnack: 'Lanche da manhã',
  lunch: 'Almoço',
  afternoonSnack: 'Lanche da tarde',
  dinner: 'Jantar',
  eveningSnack: 'Ceia',
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  essencial: { bg: '#FEF2F2', text: '#DC2626', label: 'Essencial' },
  recomendado: { bg: '#FFFBEB', text: '#D97706', label: 'Recomendado' },
  opcional: { bg: '#F0F9FF', text: '#0284C7', label: 'Opcional' },
};

function MacroCard({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <Box sx={{ flex: 1, px: 2, py: 1.5, borderRadius: 2, backgroundColor: `${color}18`, border: `1px solid ${color}30`, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
        {value}
        <Typography component="span" variant="caption" sx={{ fontWeight: 600, color, ml: 0.5 }}>{unit}</Typography>
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>{label}</Typography>
    </Box>
  );
}

function MealSlotCard({ slot }: { slot: MealSlot }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {slot.items.map((item, i) => (
        <Box key={i} sx={{ borderRadius: 2, border: '1px solid #F1F5F9', overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.25, backgroundColor: '#FAFCFF' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{item.food}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>{item.quantity}</Typography>
            </Box>
          </Box>
          <Box sx={{ px: 2, py: 1, backgroundColor: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <SwapHoriz sx={{ fontSize: 13, color: '#94A3B8' }} />
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '0.62rem' }}>
                Substituições
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {item.substitutions.map((sub, si) => (
                <Typography key={si} variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography component="span" sx={{ fontSize: '0.6rem', color: '#CBD5E1' }}>●</Typography>
                  {sub}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  const colors = PRIORITY_COLORS[supplement.priority] ?? PRIORITY_COLORS.opcional;
  return (
    <Box sx={{ borderRadius: 2, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{supplement.name}</Typography>
            <Chip label={colors.label} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, backgroundColor: colors.bg, color: colors.text }} />
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>{supplement.benefit}</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>{supplement.dosage}</Typography>
            <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 600 }}>{supplement.timing}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ProtocolTab({ protocol }: { protocol: NonNullable<ReturnType<typeof useDietProtocol>['protocol']> }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                Meta calórica diária
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#065F46', lineHeight: 1, mt: 0.25 }}>
                {protocol.dailyCalories.toLocaleString('pt-BR')}
                <Typography component="span" variant="body1" sx={{ fontWeight: 600, color: '#6EE7B7', ml: 0.75 }}>kcal</Typography>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.75 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'flex-end' }}>
                {protocol.goals.map((g) => (
                  <Chip key={g} label={g.replace(/_/g, ' ')} size="small" sx={{ backgroundColor: '#ECFDF5', color: '#065F46', fontWeight: 600, fontSize: '0.65rem' }} />
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>{protocol.mealsPerDay} refeições/dia</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <MacroCard label="Proteína" value={protocol.proteinG} unit="g" color="#2563EB" />
            <MacroCard label="Carboidratos" value={protocol.carbsG} unit="g" color="#F59E0B" />
            <MacroCard label="Gorduras" value={protocol.fatsG} unit="g" color="#EF4444" />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Plano alimentar detalhado</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>
            Cada alimento inclui quantidade exata e 2 substituições equivalentes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {Object.entries(protocol.mealPlan as unknown as Record<string, MealSlot>)
              .filter(([, slot]) => slot?.items?.length > 0)
              .map(([key, slot], i) => (
                <Accordion key={key} defaultExpanded={i === 0} disableGutters elevation={0}
                  sx={{ border: '1px solid #F1F5F9', borderRadius: '8px !important', '&:before': { display: 'none' }, '&.Mui-expanded': { borderColor: '#A7F3D0' } }}
                >
                  <AccordionSummary expandIcon={<ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />}
                    sx={{ px: 2, py: 0.5, minHeight: 48, '& .MuiAccordionSummary-content': { margin: '10px 0' } }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{MEAL_LABELS[key] ?? key}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', ml: 1, alignSelf: 'center' }}>
                      {slot.items.length} {slot.items.length === 1 ? 'alimento' : 'alimentos'}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2, pb: 2, pt: 0 }}>
                    <MealSlotCard slot={slot} />
                  </AccordionDetails>
                </Accordion>
              ))}
          </Box>
        </CardContent>
      </Card>

      {protocol.supplements?.length > 0 && (
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Suplementação recomendada</Typography>
              <Chip label="Parceiros em breve" size="small" sx={{ backgroundColor: '#F0F9FF', color: '#0284C7', fontWeight: 600, fontSize: '0.62rem', border: '1px dashed #BAE6FD' }} />
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2.5 }}>
              Baseada nos seus objetivos — em breve você poderá comprar diretamente dos nossos parceiros
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {protocol.supplements.map((s, i) => <SupplementCard key={i} supplement={s} />)}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Card>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#065F46' }}>✅ Priorize estes alimentos</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {protocol.foodsToEat.map((food) => (
                <Box key={food} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Done sx={{ fontSize: 16, color: '#10B981', flexShrink: 0 }} />
                  <Typography variant="body2">{food}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#991B1B' }}>❌ Evite estes alimentos</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {protocol.foodsToAvoid.map((food) => (
                <Box key={food} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CancelOutlined sx={{ fontSize: 16, color: '#EF4444', flexShrink: 0 }} />
                  <Typography variant="body2">{food}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>💡 Dicas da IA</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {protocol.tips.map((tip, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <LightbulbOutlined sx={{ fontSize: 16, color: '#F59E0B', mt: '2px', flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{tip}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)', border: '1px solid #A7F3D0' }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, '&:last-child': { pb: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesome sx={{ fontSize: 16, color: '#10B981' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#065F46' }}>Por que este protocolo é ideal para você</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#047857', lineHeight: 1.8 }}>{protocol.reasoning}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function DietProtocolPage() {
  const router = useRouter();
  const { protocol, isLoading } = useDietProtocol();
  const [modalOpen, setModalOpen] = useState(false);
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 3, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Tooltip title="Voltar ao dashboard">
              <IconButton size="small" onClick={() => router.push('/dashboard')} sx={{ color: 'text.secondary', ml: -1 }}>
                <ArrowBack fontSize="small" />
              </IconButton>
            </Tooltip>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RestaurantMenu sx={{ fontSize: 16, color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>
              Protocolo de Dieta
            </Typography>
            <Chip label="IA" size="small" icon={<AutoAwesome sx={{ fontSize: '12px !important' }} />} sx={{ backgroundColor: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '0.65rem' }} />
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Plano alimentar personalizado gerado por inteligência artificial
          </Typography>
        </Box>
        {protocol && !isLoading && (
          <Tooltip title="Gerar novo protocolo">
            <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={() => setModalOpen(true)}
              sx={{ borderColor: '#10B981', color: '#10B981', '&:hover': { borderColor: '#059669', backgroundColor: 'rgba(16,185,129,0.04)' } }}
            >
              Atualizar protocolo
            </Button>
          </Tooltip>
        )}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Skeleton variant="rounded" height={140} />
          <Skeleton variant="rounded" height={200} />
          <Skeleton variant="rounded" height={300} />
        </Box>
      ) : !protocol ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🥗</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Nenhum protocolo de dieta ainda</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400, mx: 'auto' }}>
              Responda algumas perguntas rápidas e a IA vai criar um plano alimentar personalizado.
            </Typography>
            <Button variant="contained" size="large" startIcon={<AutoAwesome />} onClick={() => setModalOpen(true)}
              sx={{ px: 4, py: 1.5, background: 'linear-gradient(135deg, #10B981, #059669)', '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' } }}
            >
              Criar meu protocolo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': { backgroundColor: '#10B981', height: 3, borderRadius: 99 },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', minHeight: 44 },
              '& .Mui-selected': { color: '#10B981 !important' },
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <Tab icon={<MenuBook sx={{ fontSize: 16 }} />} iconPosition="start" label="Protocolo" />
            <Tab icon={<CalendarToday sx={{ fontSize: 16 }} />} iconPosition="start" label="Hoje" />
          </Tabs>

          {tab === 0 && <ProtocolTab protocol={protocol} />}
          {tab === 1 && <TodayTracking protocol={protocol} />}
        </>
      )}

      <DietOnboardingModal open={modalOpen} onClose={() => setModalOpen(false)} onDone={() => setModalOpen(false)} />
    </Box>
  );
}

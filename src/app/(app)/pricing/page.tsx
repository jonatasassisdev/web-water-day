'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  Grid,
} from '@mui/material';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import useSWR from 'swr';
import { paymentsApi } from '@/lib/api/payments';

const FREE_FEATURES = [
  'Registro de consumo de água',
  'Dashboard diário',
  'Histórico de 7 dias',
];

const PREMIUM_FEATURES = [
  'Protocolo de hidratação com IA',
  'Protocolo de dieta personalizado com IA',
  'Tracking diário de refeições',
  'Página analítica de hidratação',
  'Notificações push e e-mail',
  'Histórico completo',
];

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAGARME_PUBLIC_KEY ?? '';

async function tokenizeCard(card: {
  number: string;
  holderName: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}): Promise<string> {
  const res = await fetch(`https://api.pagar.me/core/v5/tokens?appId=${PUBLIC_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'card',
      card: {
        number: card.number.replace(/\s/g, ''),
        holder_name: card.holderName,
        exp_month: parseInt(card.expMonth),
        exp_year: parseInt(card.expYear.length === 2 ? '20' + card.expYear : card.expYear),
        cvv: card.cvv,
      },
    }),
  });
  const data = await res.json() as { id?: string; errors?: { message: string }[] };
  if (!data.id) throw new Error(data.errors?.[0]?.message ?? 'Erro ao processar cartão');
  return data.id;
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.slice(0, 3) + '.' + digits.slice(3);
  if (digits.length <= 9) return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6);
  return digits.slice(0, 3) + '.' + digits.slice(3, 6) + '.' + digits.slice(6, 9) + '-' + digits.slice(9);
}

export default function PricingPage() {
  const { data: status, mutate } = useSWR('payment-status', paymentsApi.status);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [street, setStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [fetchingCep, setFetchingCep] = useState(false);

  const isPremium = status?.isPremium;

  function resetForm() {
    setCardNumber('');
    setHolderName('');
    setExpiry('');
    setCvv('');
    setCpf('');
    setPhone('');
    setZipCode('');
    setStreet('');
    setAddressNumber('');
    setCity('');
    setState('');
    setError('');
    setSuccess(false);
  }

  async function handleSubscribe() {
    setLoading(true);
    setError('');
    try {
      const [expMonth, expYear] = expiry.split('/');
      const cardToken = await tokenizeCard({
        number: cardNumber,
        holderName,
        expMonth,
        expYear,
        cvv,
      });

      const result = await paymentsApi.subscribe(cardToken, cpf, phone, {
        zipCode,
        street,
        number: addressNumber,
        city,
        state,
      });

      if (result.active || result.alreadyActive) {
        setSuccess(true);
        await mutate();
        setTimeout(() => {
          setOpen(false);
          resetForm();
        }, 2000);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao processar pagamento.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return;
    setLoading(true);
    try {
      await paymentsApi.cancel();
      await mutate();
    } catch {
      setError('Erro ao cancelar assinatura.');
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = cardNumber.replace(/\s/g, '').length === 16 && holderName.trim().length > 2 && expiry.length === 5 && cvv.length >= 3 && cpf.replace(/\D/g, '').length === 11 && phone.replace(/\D/g, '').length >= 10 && zipCode.replace(/\D/g, '').length === 8 && street.trim().length > 0 && addressNumber.trim().length > 0 && city.trim().length > 0 && state.trim().length === 2;

  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          {isPremium ? 'Minha assinatura' : 'Planos WaterDay'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isPremium ? 'Gerencie seu plano Premium' : 'Escolha o plano que faz sentido pra você'}
        </Typography>
      </Box>

      {error && !open && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {isPremium ? (
        /* ── Visão de assinatura ativa ── */
        <Box sx={{ maxWidth: 600, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Detalhes da assinatura</Typography>
                <Chip label="Ativa" color="success" size="small" sx={{ color: 'white', fontWeight: 700 }} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 0.75 }}>
                  <ListItemText
                    primary="Plano"
                    secondary={status?.plan ?? 'WaterDay Premium'}
                    slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } as object, secondary: { variant: 'body2', fontWeight: 600 } as object }}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding sx={{ py: 0.75 }}>
                  <ListItemText
                    primary="Valor"
                    secondary="R$ 14,90 / mês"
                    slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } as object, secondary: { variant: 'body2', fontWeight: 600 } as object }}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding sx={{ py: 0.75 }}>
                  <ListItemText
                    primary="Assinado em"
                    secondary={fmt(status?.createdAt)}
                    slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } as object, secondary: { variant: 'body2', fontWeight: 600 } as object }}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem disablePadding sx={{ py: 0.75 }}>
                  <ListItemText
                    primary="Próxima cobrança"
                    secondary={fmt(status?.nextBillingAt)}
                    slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } as object, secondary: { variant: 'body2', fontWeight: 600 } as object }}
                  />
                </ListItem>
                {status?.card && (
                  <>
                    <Divider component="li" />
                    <ListItem disablePadding sx={{ py: 0.75 }}>
                      <ListItemText
                        primary="Cartão"
                        secondary={`${status.card.brand} •••• ${status.card.lastFour}`}
                        slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } as object, secondary: { variant: 'body2', fontWeight: 600 } as object }}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </CardContent>
          </Card>

          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            Cancelar assinatura
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <LockOutlined sx={{ fontSize: 13, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              Pagamento seguro via Pagar.me
            </Typography>
          </Box>
        </Box>
      ) : (
        /* ── Visão de planos ── */
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
              maxWidth: 800,
              mx: 'auto',
              pt: 2,
            }}
          >
            {/* Free */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="text.secondary">Gratuito</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1, mb: 3 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>R$0</Typography>
                  <Typography color="text.secondary">/mês</Typography>
                </Box>
                <List dense disablePadding>
                  {FREE_FEATURES.map((f) => (
                    <ListItem key={f} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleOutlined fontSize="small" sx={{ color: 'text.disabled' }} />
                      </ListItemIcon>
                      <ListItemText primary={f} slotProps={{ primary: { variant: 'body2' } as object }} />
                    </ListItem>
                  ))}
                </List>
                <Button fullWidth variant="outlined" disabled sx={{ mt: 3 }}>Plano atual</Button>
              </CardContent>
            </Card>

            {/* Premium — overflow visible para o chip não ser cortado */}
            <Box sx={{ pt: 1.5 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  background: (t) =>
                    t.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, #1a2744 0%, #0f1929 100%)'
                      : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: -1.5 }}>
                  <Chip label="Recomendado" color="primary" size="small" />
                </Box>
                <CardContent sx={{ p: 4, pt: 2 }}>
                  <Typography variant="overline" color="primary">Premium</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mt: 1, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700 }} color="primary">R$14,90</Typography>
                    <Typography color="text.secondary">/mês</Typography>
                  </Box>
                  <List dense disablePadding>
                    {PREMIUM_FEATURES.map((f) => (
                      <ListItem key={f} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleOutlined fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={f} slotProps={{ primary: { variant: 'body2' } as object }} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    fullWidth variant="contained" size="large"
                    sx={{ mt: 3, py: 1.5, fontWeight: 700 }}
                    onClick={() => { resetForm(); setOpen(true); }}
                    startIcon={<CreditCardOutlined />}
                  >
                    Assinar Premium
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 4 }}>
            <LockOutlined sx={{ fontSize: 14, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              Pagamento seguro via Pagar.me · Cancele quando quiser
            </Typography>
          </Box>
        </>
      )}

      {/* Card form dialog */}
      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 2 }}>
          <CreditCardOutlined color="primary" fontSize="medium" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Dados do cartão
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {success ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              Assinatura ativada com sucesso! Bem-vindo ao Premium.
            </Alert>
          ) : (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              {error && (
                <Grid size={12}>
                  <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                </Grid>
              )}

              {/* Dados pessoais */}
              <Grid size={6}>
                <TextField
                  label="CPF"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  placeholder="000.000.000-00"
                  slotProps={{ htmlInput: { maxLength: 14 } }}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Celular"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(11) 99999-0000"
                  slotProps={{ htmlInput: { maxLength: 16 } }}
                  fullWidth
                />
              </Grid>

              {/* Endereço */}
              <Grid size={4}>
                <TextField
                  label="CEP"
                  value={zipCode}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setZipCode(v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5) : v);
                    if (v.length === 8) {
                      setFetchingCep(true);
                      fetch(`https://viacep.com.br/ws/${v}/json/`)
                        .then(r => r.json())
                        .then((d: { logradouro?: string; localidade?: string; uf?: string; erro?: boolean }) => {
                          if (!d.erro) {
                            setStreet(d.logradouro ?? '');
                            setCity(d.localidade ?? '');
                            setState(d.uf ?? '');
                          }
                        })
                        .finally(() => setFetchingCep(false));
                    }
                  }}
                  placeholder="00000-000"
                  slotProps={{ htmlInput: { maxLength: 9 }, input: { endAdornment: fetchingCep ? <CircularProgress size={16} /> : null } }}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Rua / Logradouro"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  label="Nº"
                  value={addressNumber}
                  onChange={(e) => setAddressNumber(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={9}>
                <TextField
                  label="Cidade"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="UF"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                  slotProps={{ htmlInput: { maxLength: 2 } }}
                  fullWidth
                />
              </Grid>

              {/* Cartão */}
              <Grid size={12}>
                <TextField
                  label="Número do cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  slotProps={{ htmlInput: { maxLength: 19 } }}
                  fullWidth
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Nome no cartão"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                  placeholder="NOME COMO NO CARTÃO"
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="Validade"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  slotProps={{ htmlInput: { maxLength: 5 } }}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  label="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  slotProps={{ htmlInput: { maxLength: 4 } }}
                  fullWidth
                />
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">WaterDay Premium</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>R$14,90/mês</Typography>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LockOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">
                    Dados processados com segurança pela Pagar.me
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        {!success && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpen(false)} color="inherit" disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubscribe}
              disabled={loading || !canSubmit}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {loading ? 'Processando...' : 'Confirmar pagamento'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}

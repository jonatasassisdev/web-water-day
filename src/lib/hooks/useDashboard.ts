'use client';

import useSWR, { mutate } from 'swr';
import { waterLogApi, DailySummary, WeeklyHistory } from '../api/water-log';
import { protocolApi } from '../api/protocol';
import { WaterProtocol } from '../api/types';

export function useDailySummary() {
  const { data, error, isLoading } = useSWR<DailySummary>(
    'daily-summary',
    () => waterLogApi.getDaily(),
    { refreshInterval: 30000 },
  );
  return { summary: data, error, isLoading };
}

export function useWeeklyHistory() {
  const { data, error, isLoading } = useSWR<WeeklyHistory>(
    'weekly-history',
    () => waterLogApi.getHistory(7),
    { refreshInterval: 60000 },
  );
  return { history: data, error, isLoading };
}

export function useProtocol() {
  const { data, error, isLoading } = useSWR<WaterProtocol>(
    'protocol',
    () => protocolApi.get(),
  );
  return { protocol: data, error, isLoading };
}

export async function refreshDashboard() {
  await Promise.all([
    mutate('daily-summary'),
    mutate('weekly-history'),
  ]);
}

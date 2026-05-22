import api from './client';

export interface WaterLog {
  id: string;
  amountMl: number;
  loggedAt: string;
  note?: string;
  source: 'MANUAL' | 'QUICK_ADD' | 'REMINDER';
}

export interface DailySummary {
  date: string;
  totalMl: number;
  goalMl: number;
  progressPercent: number;
  remaining: number;
  goalReached: boolean;
  logs: WaterLog[];
}

export interface DayHistory {
  date: string;
  totalMl: number;
  goalMl: number;
  progressPercent: number;
  goalReached: boolean;
}

export interface WeeklyHistory {
  history: DayHistory[];
  goalMl: number;
  daysGoalReached: number;
  totalDays: number;
}

export const waterLogApi = {
  add: (amountMl: number, note?: string) =>
    api.post<WaterLog>('/water-log', { amountMl, source: 'QUICK_ADD', note }).then((r) => r.data),

  getDaily: (date?: string) =>
    api.get<DailySummary>('/water-log/daily', { params: date ? { date } : {} }).then((r) => r.data),

  getHistory: (days = 7) =>
    api.get<WeeklyHistory>('/water-log/history', { params: { days } }).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/water-log/${id}`).then((r) => r.data),
};

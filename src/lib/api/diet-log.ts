import apiClient from './client';

export interface FreeEntry {
  id: string;
  foodName: string;
  calories: number | null;
  notes: string | null;
  createdAt: string;
}

export interface TodayDietLog {
  date: string;
  checkedMeals: string[];
  freeEntries: FreeEntry[];
  totalExtraCalories: number;
}

export const dietLogApi = {
  getToday: (date?: string): Promise<TodayDietLog> =>
    apiClient.get('/diet-log/today', { params: date ? { date } : {} }).then((r) => r.data),

  toggleMeal: (mealKey: string): Promise<{ checked: boolean; mealKey: string }> =>
    apiClient.post('/diet-log/meal-check', { mealKey }).then((r) => r.data),

  addEntry: (foodName: string, calories?: number, notes?: string): Promise<FreeEntry> =>
    apiClient.post('/diet-log/entry', { foodName, calories, notes }).then((r) => r.data),

  deleteEntry: (id: string): Promise<void> =>
    apiClient.delete(`/diet-log/entry/${id}`).then((r) => r.data),
};

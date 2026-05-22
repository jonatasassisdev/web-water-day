import apiClient from './client';

export interface MealItem {
  food: string;
  quantity: string;
  substitutions: [string, string];
}

export interface MealSlot {
  items: MealItem[];
}

export interface DietMealPlan {
  breakfast: MealSlot;
  morningSnack?: MealSlot;
  lunch: MealSlot;
  afternoonSnack?: MealSlot;
  dinner: MealSlot;
  eveningSnack?: MealSlot;
}

export interface SupplementRecommendation {
  name: string;
  dosage: string;
  benefit: string;
  timing: string;
  priority: 'essencial' | 'recomendado' | 'opcional';
}

export interface DietProtocol {
  id: string;
  userId: string;
  dailyCalories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  mealsPerDay: number;
  goals: string[];
  goalsLabel: string;
  restrictions: string[];
  mealPlan: DietMealPlan;
  foodsToEat: string[];
  foodsToAvoid: string[];
  supplements: SupplementRecommendation[];
  tips: string[];
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteDietPayload {
  dietGoals: string[];
  restrictions: string[];
  mealsPerDay: number;
  healthConditions: string[];
  foodDislikes: string[];
  freeFormPreferences: string[];
}

export const dietProtocolApi = {
  get: async (): Promise<DietProtocol | null> => {
    const res = await apiClient.get<DietProtocol | null>('/diet-protocol');
    return res.data;
  },

  generate: async (payload: CompleteDietPayload): Promise<DietProtocol> => {
    const res = await apiClient.post<DietProtocol>('/diet-protocol/generate', payload);
    return res.data;
  },
};

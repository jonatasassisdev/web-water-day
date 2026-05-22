export type ActivityLevel =
  | 'SEDENTARY'
  | 'LIGHTLY_ACTIVE'
  | 'MODERATELY_ACTIVE'
  | 'VERY_ACTIVE'
  | 'EXTREMELY_ACTIVE';

export type Climate = 'COLD' | 'TEMPERATE' | 'HOT' | 'TROPICAL';

export type HydrationGoal =
  | 'GENERAL_HEALTH'
  | 'WEIGHT_LOSS'
  | 'ATHLETIC_PERFORMANCE'
  | 'SKIN_HEALTH'
  | 'DETOX';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: string;
  isPremium: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  onboardingDone?: boolean;
}

export interface UserProfile {
  id: string;
  userId: string;
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  climate: Climate;
  healthConditions: string[];
  goal: HydrationGoal;
  onboardingDone: boolean;
}

export interface WaterProtocol {
  id: string;
  userId: string;
  dailyGoalMl: number;
  reasoning: string;
  breakdown: {
    baseIntake: number;
    activityBonus: number;
    climateBonus: number;
    goalAdjustment: number;
    healthAdjustment: number;
  };
  tips: string[];
  createdAt: string;
}

export interface OnboardingData {
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  climate: Climate;
  healthConditions: string[];
  goal: HydrationGoal;
}

export interface OnboardingResponse {
  profile: UserProfile;
  protocol: WaterProtocol;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

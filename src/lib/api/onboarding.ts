import api from './client';
import { OnboardingData, OnboardingResponse } from './types';

export const onboardingApi = {
  getQuestions: () =>
    api.get('/onboarding/questions').then((r) => r.data),

  complete: (data: OnboardingData) =>
    api.post<OnboardingResponse>('/onboarding/complete', data).then((r) => r.data),
};

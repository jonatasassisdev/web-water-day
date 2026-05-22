import apiClient from './client';

export interface SubscribeResult {
  alreadyActive?: boolean;
  subscriptionId?: string;
  status?: string;
  active?: boolean;
}

export interface PaymentStatus {
  isPremium: boolean;
  status: string;
  subscriptionId?: string;
  createdAt?: string;
  nextBillingAt?: string;
  plan?: string;
  card?: { lastFour: string; brand: string } | null;
}

export const paymentsApi = {
  subscribe: async (
    cardToken: string,
    document: string,
    phone: string,
    billing: { zipCode: string; street: string; number: string; city: string; state: string },
  ): Promise<SubscribeResult> => {
    const res = await apiClient.post<SubscribeResult>('/payments/subscribe', { cardToken, document, phone, billing });
    return res.data;
  },

  status: async (): Promise<PaymentStatus> => {
    const res = await apiClient.get<PaymentStatus>('/payments/status');
    return res.data;
  },

  cancel: async (): Promise<{ canceled: boolean }> => {
    const res = await apiClient.delete<{ canceled: boolean }>('/payments/cancel');
    return res.data;
  },
};

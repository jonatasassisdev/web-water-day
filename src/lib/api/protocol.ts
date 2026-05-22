import api from './client';
import { WaterProtocol } from './types';

export const protocolApi = {
  get: () => api.get<WaterProtocol>('/protocol').then((r) => r.data),
};

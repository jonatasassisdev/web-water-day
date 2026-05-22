import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('waterday_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(err: unknown, token: string | null) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  queue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Get refresh token from store (read directly from persisted storage)
    const stored = localStorage.getItem('waterday-auth');
    const refreshToken = stored ? JSON.parse(stored)?.state?.refreshToken : null;

    if (!refreshToken) {
      return forceLogout();
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1'}/auth/refresh`,
        { refreshToken },
      );

      const { token, refreshToken: newRefresh } = data;

      // Update store
      const { useAuthStore } = await import('@/stores/auth.store');
      useAuthStore.getState().setTokens(token, newRefresh);

      processQueue(null, token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      return forceLogout();
    } finally {
      isRefreshing = false;
    }
  },
);

function forceLogout() {
  Cookies.remove('waterday_token');
  if (typeof window !== 'undefined') {
    import('@/stores/auth.store').then(({ useAuthStore }) => useAuthStore.getState().logout());
    window.location.href = '/login';
  }
  return Promise.reject(new Error('Sessão expirada'));
}

export default api;

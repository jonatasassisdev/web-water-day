import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@/lib/api/types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  onboardingDone: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken: string, onboardingDone?: boolean) => void;
  setTokens: (token: string, refreshToken: string) => void;
  setOnboardingDone: () => void;
  setAvatar: (avatarUrl: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      onboardingDone: false,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken, onboardingDone = false) => {
        Cookies.set('waterday_token', token, { expires: 1 / 96, sameSite: 'strict' }); // 15min
        set({ user, token, refreshToken, onboardingDone, isAuthenticated: true });
      },

      setTokens: (token, refreshToken) => {
        Cookies.set('waterday_token', token, { expires: 1 / 96, sameSite: 'strict' });
        set({ token, refreshToken });
      },

      setOnboardingDone: () => set({ onboardingDone: true }),

      setAvatar: (avatarUrl) =>
        set((state) => ({ user: state.user ? { ...state.user, avatarUrl } : state.user })),

      logout: () => {
        Cookies.remove('waterday_token');
        set({ user: null, token: null, refreshToken: null, onboardingDone: false, isAuthenticated: false });
      },
    }),
    {
      name: 'waterday-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        onboardingDone: state.onboardingDone,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

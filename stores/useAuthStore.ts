import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { loginUser, registerUser } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loggedIn: false,
    error: null as string | null
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      this.error = null;
      try {
        const { userId } = await loginUser(credentials);
        this.user = { 
          id: userId,
          email: credentials.email,
        };
        this.loggedIn = true;
        return navigateTo('/todos');
      } catch (error: any) {
        this.error = error?.message || 'Login failed. Please check your credentials.';
        throw error;
      }
    },
    async register(credentials: { email: string; password: string }) {
      try {
        await registerUser(credentials);
        return navigateTo('/login');
      } catch (error: any) {
        throw new Error(error?.message || 'Registration failed. Please try again.');
      }
    },
    logout() {
      this.user = null;
      this.loggedIn = false;
      return navigateTo('/');
    }
  }
});

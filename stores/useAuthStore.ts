import { defineStore } from 'pinia'
import type { User } from '@/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    error: null as string | null
  }),
  getters: {
    loggedIn: (state) => !!state.user
  },
  actions: {
    async login(credentials: {email: string, password: string}) {
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: credentials
        });
        this.user = { email: credentials.email, password: '' };
        this.error = null;
        return navigateTo('/');
      } catch (error: unknown) {
        this.error = (error instanceof Error && 'data' in error) 
          ? (error.data as {message: string})?.message 
          : 'Login failed';
        throw error;
      }
    },
    async register(credentials: {email: string, password: string}) {
      try {
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: credentials
        });
        this.user = { email: credentials.email, password: '' };
        this.error = null;
        return navigateTo('/login');
      } catch (error: unknown) {
        this.error = (error instanceof Error && 'data' in error)
          ? (error.data as {message: string})?.message
          : 'Registration failed';
        throw error;
      }
    },
    logout() {
      this.user = null
    }
  }
})

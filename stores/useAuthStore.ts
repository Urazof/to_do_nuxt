import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { loginUser, registerUser } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loggedIn: false
  }),
  actions: {
    async login(credentials: {email: string, password: string}) {
      try {
        await loginUser(credentials);
        this.user = { email: credentials.email, password: '' };
        this.loggedIn = true;
        return navigateTo('/');
      } catch (error) {
        throw error;
      }
    },
    async register(credentials: {email: string, password: string}) {
      try {
        await registerUser(credentials);
        this.user = { email: credentials.email, password: '' };
        return navigateTo('/login');
      } catch (error) {
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.loggedIn = false;
    }
  }
})

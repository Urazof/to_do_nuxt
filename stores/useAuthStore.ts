import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { loginUser, registerUser } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loggedIn: false
  }),
  actions: {
    async login(credentials: { email: string; password: string }) {
      await loginUser(credentials);
      this.user = { 
        email: credentials.email,
        password: credentials.password
      };
      this.loggedIn = true;
      return navigateTo('/todos');
    },
    async register(credentials: { email: string; password: string }) {
      await registerUser(credentials);
      return navigateTo('/login');
    },
    logout() {
      this.user = null;
      this.loggedIn = false;
      return navigateTo('/');
    }
  }
});

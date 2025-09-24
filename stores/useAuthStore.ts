import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { loginUser, registerUser } from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loggedIn: false,
    error: null as string | null,
    _expiryTimerId: null as number | null,
  }),
  actions: {
    _clearExpiryTimer() {
      if (this._expiryTimerId !== null) {
        clearTimeout(this._expiryTimerId);
        this._expiryTimerId = null;
      }
    },
    _setExpiryTimer(expirationMs: number) {
      if (!import.meta.client) return;

      this._clearExpiryTimer();
      const delay = expirationMs - Date.now();
      if (delay <= 0) {
        this.logout();
        return;
      }
      this._expiryTimerId = window.setTimeout(() => {
        // двойная проверка истечения
        if (this.isTokenExpired()) {
          this.logout();
        }
      }, delay);
    },
    async login(credentials: { email: string; password: string }) {
      this.error = null;
      try {
        const { userId, token, expiresIn } = await loginUser(credentials);
        this.user = { 
          id: userId,
          email: credentials.email,
        };
        this.token = token;
        this.loggedIn = true;
        const expirationMs = Date.now() + expiresIn * 1000;
        if (import.meta.client) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('tokenExpiration', String(expirationMs));
          localStorage.setItem('userId', userId);
          localStorage.setItem('userEmail', credentials.email);
        }
        this._setExpiryTimer(expirationMs);
        return navigateTo('/todos');
      } catch (error: any) {
        this.error = 'Login failed. Please check your credentials.';
        throw new Error(this.error)
      }
    },
    async register(credentials: { email: string; password: string }) {
      this.error = null;
      try {
        const { token, expiresIn, userId } = await registerUser(credentials);
        this.token = token;
        this.user = {
          id: userId,
          email: credentials.email,
        };
        const expirationMs = Date.now() + expiresIn * 1000;
        if (import.meta.client) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('tokenExpiration', String(expirationMs));
          localStorage.setItem('userId', userId);
          localStorage.setItem('userEmail', credentials.email);
        }
        this._setExpiryTimer(expirationMs);
        return navigateTo('/login');
      } catch (error: any) {
        this.error = 'Register failed. User already exist';
        throw new Error(this.error)
      }
    },
    logout() {
      this.error = null;
      this.user = null;
      this.token = null;
      this.loggedIn = false;
      this._clearExpiryTimer();
      if (import.meta.client) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
      }
      return navigateTo('/');
    },
    initialize() {
      if (!import.meta.client) return;
      const token = localStorage.getItem('authToken');
      const expiration = localStorage.getItem('tokenExpiration');
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('userEmail');
      if (token && expiration && Date.now() < parseInt(expiration)) {
        this.token = token;
        this.loggedIn = true;
        if (userId && email) {
          this.user = { id: userId, email };
        }
        this._setExpiryTimer(parseInt(expiration));
      } else {
        this.logout();
      }
    },
    isTokenExpired() {
      if (!import.meta.client) return true;
      const expiration = localStorage.getItem('tokenExpiration');
      return !expiration || Date.now() >= parseInt(expiration);
    },
  }
});

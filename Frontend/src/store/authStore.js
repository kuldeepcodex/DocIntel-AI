import { create } from 'zustand';
import { authService } from '../services/authService';
import { setToken, removeToken, getToken } from '../utils/token';
import { useChatStore } from './chatStore';
import { useDocumentStore } from './documentStore';
import { useSuggestionStore } from './suggestionStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken() || 'dev-mode',
  isAuthenticated: true,
  isCheckingAuth: false, // For initial app load
  isLoading: false, // For API calls
  error: null,
  successMessage: null,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setToken: (token) => {
    setToken(token);
    set({ token, isAuthenticated: true });
  },
  
  clearAuth: () => {
    removeToken();
    try {
      useChatStore.getState().resetChatStore?.();
      useDocumentStore.getState().clearDocuments?.();
      useSuggestionStore.getState().clearSuggestions?.();
    } catch (e) {}
    set({ user: null, token: null, isAuthenticated: false });
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(userData);
      // We don't log them in automatically according to the spec, redirect to login
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed. Please try again.',
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      get().setToken(data.access_token);
      get().setUser(data.user);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Invalid email or password.',
        isLoading: false 
      });
      throw error;
    }
  },

  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.googleLogin(idToken);
      get().setToken(data.access_token);
      get().setUser(data.user);
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Google authentication failed.',
        isLoading: false 
      });
      throw error;
    }
  },

  logout: () => {
    get().clearAuth();
  },

  fetchCurrentUser: async () => {
   set({ isCheckingAuth: false, isAuthenticated: true });
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const data = await authService.forgotPassword(email);
      set({ isLoading: false, successMessage: data.message });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to send reset link.',
        isLoading: false 
      });
      throw error;
    }
  },

  resetPassword: async (token, password, confirmPassword) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const data = await authService.resetPassword(token, password, confirmPassword);
      set({ isLoading: false, successMessage: data.message });
      return true;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Failed to reset password.',
        isLoading: false 
      });
      throw error;
    }
  },

  clearMessages: () => {
    set({ error: null, successMessage: null });
  },
}));

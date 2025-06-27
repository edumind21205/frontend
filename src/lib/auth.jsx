import { apiRequest } from "./queryClient";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import React from "react";

// Auth store (no TypeScript types)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await apiRequest("POST", "/api/auth/login", { email, password });
          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await apiRequest("POST", "/api/auth/register", userData);
          const data = await response.json();
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          set({ isLoading: true });
          const response = await apiRequest("GET", "/api/auth/me");
          const data = await response.json();
          set({
            user: data.user,
            isLoading: false,
          });
        } catch (error) {
          console.error("Failed to refresh user", error);
          // If token is invalid, log out
          if (error?.status === 401) {
            get().logout();
          }
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      // Only persist token and isAuthenticated - user will be refreshed from API
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Helper functions
export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

export function getUserFromToken(token) {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

// Auth provider wrapper for protected routes
export function withAuth(WrappedComponent, allowedRoles) {
  return function WithAuth(props) {
    const { isAuthenticated, user } = useAuthStore();
    const hasAccess = isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)));
    
    if (!isAuthenticated) {
      window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
      return null;
    }
    
    if (!hasAccess) {
      window.location.href = "/unauthorized";
      return null;
    }
    
    return React.createElement(WrappedComponent, props);
  };
}

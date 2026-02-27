import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService, type AuthResponse as LoginAuthResponse } from '../lib/api/auth.service';
import type { AuthUser } from '../lib/api/types';

type AuthRole = 'volunteer' | 'ngo' | 'admin' | null;

interface AuthContextValue {
  token: string | null;
  role: AuthRole;
  user: AuthUser | null;
  isInitializing: boolean;
  applyLoginResponse: (response: LoginAuthResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toUiRole(role?: string | null): AuthRole {
  if (!role) return null;
  const normalized = role.toUpperCase();
  if (normalized === 'VOLUNTEER') return 'volunteer';
  if (normalized === 'NGO') return 'ngo';
  if (normalized === 'ADMIN') return 'admin';
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  const applyLoginResponse = useCallback(async (response: LoginAuthResponse) => {
    const sessionToken = response.token || localStorage.getItem('token') || localStorage.getItem('authToken');
    const backendRole = response.userType || response.role || null;

    if (!sessionToken || !backendRole) {
      logout();
      return;
    }

    setToken(sessionToken);
    setRole(toUiRole(backendRole));

    if (response.fullName || response.email || response.userId != null) {
      setUser({
        id: response.userId ?? null,
        fullName: response.fullName ?? null,
        email: response.email ?? null,
      });
      return;
    }

    const me = await authService.me();
    setRole(toUiRole(me.role));
    setUser({ id: me.id, fullName: me.fullName, email: me.email });
  }, [logout]);

  useEffect(() => {
    let active = true;
    const storedToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!storedToken) {
      setIsInitializing(false);
      return;
    }

    setToken(storedToken);
    authService
      .me()
      .then((me) => {
        if (!active) return;
        setRole(toUiRole(me.role));
        setUser({ id: me.id, fullName: me.fullName, email: me.email });
      })
      .catch(() => {
        if (!active) return;
        logout();
      })
      .finally(() => {
        if (!active) return;
        setIsInitializing(false);
      });

    return () => {
      active = false;
    };
  }, [logout]);

  const value = useMemo(
    () => ({ token, role, user, isInitializing, applyLoginResponse, logout }),
    [token, role, user, isInitializing, applyLoginResponse, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

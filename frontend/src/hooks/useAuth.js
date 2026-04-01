import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/movies.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cinestream_token');
    const stored = localStorage.getItem('cinestream_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const { user, token } = await authService.login(credentials);
    localStorage.setItem('cinestream_token', token);
    localStorage.setItem('cinestream_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (data) => {
    const { user, token } = await authService.register(data);
    localStorage.setItem('cinestream_token', token);
    localStorage.setItem('cinestream_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cinestream_token');
    localStorage.removeItem('cinestream_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

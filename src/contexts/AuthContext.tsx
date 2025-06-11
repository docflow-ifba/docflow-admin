/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { UserDTO } from '@/dtos/user.dto';
import { getUser } from '@/services/user.service';

type AuthContextType = {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  loading: boolean;
  logout: () => void;
  getToken: () => string | null;
  getAvatar: () => string;
  isTokenExpired: (token: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type JwtPayload = {
  sub: string;
  email: string;
  exp?: number;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        if (isTokenExpired(token)) {
          localStorage.removeItem('token');
          setUserState(null);
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<JwtPayload>(token);
        const user = await getUser(decoded.sub);
        setUserState(user);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const setUser = (user: UserDTO | null) => {
    setUserState(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserState(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getAvatar = (): string => {
    if (!user || !user.name) return '';
    const nomeCompleto = user.name;
    const palavras = nomeCompleto.trim().split(/\s+/);
    if (palavras.length === 0) return '';

    const primeiraInicial = palavras[0][0] || '';
    const ultimaInicial = palavras[palavras.length - 1][0] || '';

    return (primeiraInicial + ultimaInicial).toUpperCase();
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      return !!decoded.exp && decoded.exp < now;
    } catch (e) {
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, getToken, getAvatar, isTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}

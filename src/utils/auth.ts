import { UserDTO } from '@/dtos/user.dto';

export function getToken() {
  return localStorage.getItem('token');
}

export function getUser(): UserDTO {
  const user = localStorage.getItem('user');
  return JSON.parse(user || '') as UserDTO;
}

export function getAvatar(): string {
  const nomeCompleto = getUser().name;
  const palavras = nomeCompleto.trim().split(/\s+/);
  if (palavras.length === 0) return '';

  const primeiraInicial = palavras[0][0] || '';
  const ultimaInicial = palavras[palavras.length - 1][0] || '';

  return (primeiraInicial + ultimaInicial).toUpperCase();
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

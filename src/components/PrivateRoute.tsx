import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const { isTokenExpired, getToken } = useAuth();

  if (getToken() === null || isTokenExpired(getToken()!)) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

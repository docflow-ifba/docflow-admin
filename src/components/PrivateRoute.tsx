import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth';

export default function PrivateRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

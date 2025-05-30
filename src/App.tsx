import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import DashboardLayout from './pages/dashboard/layout';
import NoticesPage from './pages/dashboard/notices/NoticesPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SettingsPage from './pages/dashboard/settings/SettingsPage';
import AISettingsPage from './pages/dashboard/ai-settings/AISettingsPage';
import PrivateRoute from './components/PrivateRoute';
import ChatPage from './pages/dashboard/chat/ChatPage';
import OrganizationsPage from './pages/dashboard/organizations/OrganizatiosPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="editais" element={<NoticesPage />} />
          <Route path="organizacoes" element={<OrganizationsPage />} />
          <Route path="configuracoes-ia" element={<AISettingsPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

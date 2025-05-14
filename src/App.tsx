import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login/LoginPage'
import DashboardLayout from './pages/dashboard/layout'
import NoticesPage from './pages/dashboard/notices/NoticesPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import SettingsPage from './pages/dashboard/settings/SettingsPage'
import AISettingsPage from './pages/dashboard/ai-settings/AISettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="editais" element={<NoticesPage />} />
        <Route path="configuracoes-ia" element={<AISettingsPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App

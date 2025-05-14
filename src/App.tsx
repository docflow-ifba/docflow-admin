import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/login/LoginPage'
import DashboardLayout from './pages/dashboard/layout'
import AISettingsPage from './pages/dashboard/ai-settings/AISettingsPage'
import NoticesPage from './pages/dashboard/notices/NoticesPage'
import DashboardPage from './pages/dashboard/DashboardPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="ai-settings" element={<AISettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App

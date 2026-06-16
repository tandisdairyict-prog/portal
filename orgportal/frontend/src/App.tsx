import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import RolesPage from './pages/RolesPage'
import PermissionsPage from './pages/PermissionsPage'
import OrgChartPage from './pages/OrgChartPage'
import PositionsPage from './pages/PositionsPage'
import DepartmentsPage from './pages/DepartmentsPage'
import CompaniesPage from './pages/CompaniesPage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="org-chart" element={<OrgChartPage />} />
        <Route path="positions" element={<PositionsPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
      </Route>
    </Routes>
  )
}

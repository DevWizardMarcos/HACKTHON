import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { ClassSelectionPage } from '../pages/ClassSelection/ClassSelectionPage'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { LoginPage } from '../pages/Login/LoginPage'
import { PlaceholderPage } from '../pages/Placeholder/PlaceholderPage'
import { PortalPage } from '../pages/Portal/PortalPage'
import { RegisterPage } from '../pages/Register/RegisterPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PortalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/escolher-classe" element={<ClassSelectionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/jornada"
          element={<PlaceholderPage title="Jornada" description="Em breve você verá seu mapa de jornada." />}
        />
        <Route
          path="/trilhas"
          element={<PlaceholderPage title="Trilhas" description="As trilhas detalhadas serão liberadas em breve." />}
        />
        <Route
          path="/projetos"
          element={<PlaceholderPage title="Projetos" description="Aqui ficarão os projetos da academia." />}
        />
        <Route
          path="/ranking"
          element={<PlaceholderPage title="Ranking" description="O ranking será ativado nas próximas etapas." />}
        />
        <Route
          path="/perfil"
          element={<PlaceholderPage title="Perfil" description="Seu perfil completo estará disponível em breve." />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

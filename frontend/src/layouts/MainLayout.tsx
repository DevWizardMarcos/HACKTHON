import { Outlet } from 'react-router-dom'
import { TopNav } from '../components/layout/TopNav'

export function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <strong>🏰 CodeStone Academy</strong>
        <TopNav />
      </header>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

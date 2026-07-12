import { NavLink } from 'react-router-dom'

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/jornada', label: 'Jornada' },
  { path: '/trilhas', label: 'Trilhas' },
  { path: '/projetos', label: 'Projetos' },
  { path: '/ranking', label: 'Ranking' },
  { path: '/perfil', label: 'Perfil' },
]

export function TopNav() {
  return (
    <nav className="top-nav" aria-label="Navegação principal">
      {links.map((link) => (
        <NavLink key={link.path} to={link.path} className={({ isActive }) => (isActive ? 'active' : '')}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

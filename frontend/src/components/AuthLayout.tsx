import type { ReactNode } from 'react'
import logo from '../assets/img/logo.png'
import '../styles/auth.css'

interface Props {
  /** Classe da página, usada para escopar o CSS (ex: "pagina-login"). */
  pagina: string
  avatar: string
  avatarId: string
  avatarAlt: string
  children: ReactNode
}

// Cabeçalho + ilustração + área do formulário, comum às telas de autenticação.
export default function AuthLayout({ pagina, avatar, avatarId, avatarAlt, children }: Props) {
  return (
    <div className={pagina}>
      <header>
        <nav>
          <img src={logo} alt="Logo Infinity" />
        </nav>
      </header>

      <main>
        <div className="avatar-area">
          <img src={avatar} alt={avatarAlt} id={avatarId} />
        </div>
        {children}
      </main>
    </div>
  )
}

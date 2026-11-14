import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import avatarLogin from '../assets/img/avatar-login.png'
import AuthLayout from '../components/AuthLayout'
import CampoSenha from '../components/CampoSenha'
import { login } from '../services/auth'
import '../styles/login.css'

export default function Login() {
  const [params] = useSearchParams()
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState(
    params.get('cadastro') === 'sucesso' ? 'Cadastro concluído. Faça login para continuar.' : '',
  )

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setMensagem('Aguarde...')
    try {
      const resultado = await login(identificador, senha)
      setSenha('')
      setMensagem(`${resultado.mensagem} Bem-vindo(a), ${resultado.usuario.nome}!`)
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : 'Erro inesperado.')
    } finally {
      setCarregando(false)
    }
  }

  function loginSocial() {
    setMensagem('Login social ainda não configurado. Use CPF ou e-mail e senha.')
  }

  return (
    <AuthLayout
      pagina="pagina-login"
      avatar={avatarLogin}
      avatarId="avatarLogin"
      avatarAlt="avatar login"
    >
      <form onSubmit={enviar}>
        <h1 className="conecte-se">Conecte-se</h1>

        <div className="campo">
          <label htmlFor="loginid">CPF ou e-mail:</label>
          <input
            type="text"
            id="loginid"
            value={identificador}
            required
            onChange={(e) => setIdentificador(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="passid">Senha:</label>
          <CampoSenha id="passid" value={senha} onChange={setSenha} />
        </div>

        <div className="sessaolign">
          <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          <Link to="/cadastro">Cadastre-se</Link>
        </div>

        <button id="login" type="submit" disabled={carregando}>
          LOGIN
        </button>

        <span className="ou">ou</span>

        <div className="social">
          <button
            type="button"
            className="social-btn"
            aria-label="Entrar com Google"
            onClick={loginSocial}
          >
            <svg width="26" height="26" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          </button>
          <button
            type="button"
            className="social-btn"
            aria-label="Entrar com Apple"
            onClick={loginSocial}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
              <path d="M16.365 1.43c0 1.14-.47 2.2-1.22 3.02-.79.87-2.06 1.54-3.08 1.46-.13-1.1.42-2.27 1.13-3.05.79-.87 2.17-1.5 3.17-1.43zM20.94 17.03c-.55 1.26-.82 1.82-1.53 2.93-.99 1.55-2.39 3.49-4.12 3.5-1.54.02-1.94-1.01-4.03-.99-2.09.01-2.53 1.01-4.07 1-1.73-.02-3.05-1.76-4.04-3.31-2.77-4.34-3.06-9.43-1.35-12.13 1.21-1.92 3.13-3.05 4.93-3.05 1.83 0 2.98 1.01 4.5 1.01 1.47 0 2.37-1.01 4.49-1.01 1.6 0 3.3.88 4.51 2.39-3.96 2.18-3.32 7.85.71 9.66z" />
            </svg>
          </button>
        </div>

        <p role="status" aria-live="polite">
          {mensagem}
        </p>
      </form>
    </AuthLayout>
  )
}

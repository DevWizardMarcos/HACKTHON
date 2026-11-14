import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import avatarCadastro from '../assets/img/avatar-cadastro.png'
import AuthLayout from '../components/AuthLayout'
import CampoSenha from '../components/CampoSenha'
import { cadastrar } from '../services/auth'
import '../styles/cadastro.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function enviar(e: FormEvent) {
    e.preventDefault()

    if (senha !== confirmacao) {
      setMensagem('As senhas precisam ser iguais.')
      return
    }

    setCarregando(true)
    setMensagem('Aguarde...')
    try {
      await cadastrar({ nome, cpf, email, senha })
      navigate('/login?cadastro=sucesso')
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : 'Erro inesperado.')
      setCarregando(false)
    }
  }

  return (
    <AuthLayout
      pagina="pagina-cadastro"
      avatar={avatarCadastro}
      avatarId="avatarCadastro"
      avatarAlt="avatar cadastro"
    >
      <form onSubmit={enviar}>
        <h1 className="titulo">Cadastre-se</h1>

        <div className="campo">
          <label htmlFor="nomeCompleto">Nome Completo</label>
          <input
            type="text"
            id="nomeCompleto"
            autoComplete="name"
            value={nome}
            required
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            inputMode="numeric"
            maxLength={14}
            value={cpf}
            required
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <CampoSenha id="senha" value={senha} onChange={setSenha} minLength={8} autoComplete="new-password" />
        </div>

        <div className="campo">
          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <CampoSenha id="confirmarSenha" value={confirmacao} onChange={setConfirmacao} autoComplete="new-password" />
        </div>

        <button id="btnCadastro" type="submit" disabled={carregando}>
          Cadastre-se
        </button>

        <p role="status" aria-live="polite">
          {mensagem}
        </p>
      </form>
    </AuthLayout>
  )
}

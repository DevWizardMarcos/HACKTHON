import { api } from './api'

export interface Usuario {
  nome: string
  email: string
}

export interface RespostaLogin {
  mensagem: string
  usuario: Usuario
}

export interface DadosCadastro {
  nome: string
  cpf: string
  email: string
  senha: string
}

export function cadastrar(dados: DadosCadastro) {
  return api<Usuario>('/cadastro', dados)
}

// Quem está logado agora (usa o cookie de sessão). Dá erro 401 se não houver sessão.
export function usuarioAtual() {
  return api<Usuario>('/me')
}

// Encerra a sessão.
export function sair() {
  return api<{ mensagem: string }>('/logout', {})
}

export function login(identificador: string, senha: string) {
  return api<RespostaLogin>('/login', { identificador, senha })
}

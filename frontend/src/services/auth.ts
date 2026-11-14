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

export function login(identificador: string, senha: string) {
  return api<RespostaLogin>('/login', { identificador, senha })
}

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

// Chama o backend. Sem `dados` faz GET; com `dados` faz POST em JSON.
// Em caso de erro, lança um Error já com a mensagem do backend.
export async function api<T>(rota: string, dados?: unknown): Promise<T> {
  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${rota}`, {
      method: dados === undefined ? 'GET' : 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: dados === undefined ? undefined : JSON.stringify(dados),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor.')
  }

  const resultado = await resposta.json().catch(() => ({}))

  if (!resposta.ok) {
    const detalhe = resultado.detail
    throw new Error(
      Array.isArray(detalhe)
        ? detalhe.map((item: { msg: string }) => item.msg).join(' ')
        : detalhe || 'Não foi possível concluir a solicitação.',
    )
  }

  return resultado as T
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sair, usuarioAtual, type Usuario } from '../services/auth'

export default function Inicio() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState<Usuario | null>(null)

    // renderiza uma vez que a pagina abre 
    useEffect(() => {
        usuarioAtual()
        .then(setUsuario)
        .catch(() => {
            // manda os dados para o login
        })
    }, [navigate])

    async function aoSair() {
        // chama o logout 
    }

    if(!usuario) return null 

    return(
        <div>
            <h1>Olá, {usuario.nome}</h1>
            <button onClick={aoSair}>Sair</button>
        </div>
    )
}
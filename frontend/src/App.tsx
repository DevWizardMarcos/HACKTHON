import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import RecuperarSenha from './pages/RecuperarSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import Inicio from './pages/inicio'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/inicio' element = {<Inicio />} /> 
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      </Routes>
    </BrowserRouter>
  )
}

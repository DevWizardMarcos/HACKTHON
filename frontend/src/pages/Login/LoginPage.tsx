import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(1, 'Informe sua senha.'),
  keepConnected: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { keepConnected: false },
  })

  const onSubmit = () => navigate('/escolher-classe')

  return (
    <section className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Acesse a Academia</h1>

        <label>
          E-mail
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </label>

        <label>
          Senha
          <input type="password" {...register('password')} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </label>

        <label className="checkbox">
          <input type="checkbox" {...register('keepConnected')} />
          Manter conectado
        </label>

        <a href="#" className="text-link">
          Esqueci minha senha
        </a>

        <button className="button-primary" type="submit">
          Entrar
        </button>

        <p>
          Ainda não possui conta? <Link to="/cadastro">Criar cadastro</Link>
        </p>
      </form>
    </section>
  )
}

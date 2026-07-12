import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

const schema = z
  .object({
    name: z.string().min(2, 'Informe seu nome.'),
    email: z.string().email('Informe um e-mail válido.'),
    password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres.'),
    confirmPassword: z.string().min(8, 'Confirme a sua senha.'),
    terms: z.boolean().refine((value) => value, 'Aceite os termos para continuar.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais.',
  })

type RegisterFormData = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(schema) })

  const onSubmit = () => navigate('/escolher-classe')

  return (
    <section className="auth-page">
      <form className="card auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>Criar conta na CodeStone</h1>

        <label>
          Nome
          <input type="text" {...register('name')} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </label>

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

        <label>
          Confirmar senha
          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        </label>

        <label className="checkbox">
          <input type="checkbox" {...register('terms')} />
          Aceito os termos da academia
        </label>
        {errors.terms && <span className="error">{errors.terms.message}</span>}

        <button className="button-primary" type="submit">
          Criar conta
        </button>

        <p>
          Já possui conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </section>
  )
}

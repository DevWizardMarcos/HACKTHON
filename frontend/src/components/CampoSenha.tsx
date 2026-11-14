import { useState } from 'react'

interface Props {
  id: string
  value: string
  onChange: (valor: string) => void
  minLength?: number
  autoComplete?: string
}

// Input de senha com botão de mostrar/ocultar.
export default function CampoSenha({ id, value, onChange, minLength, autoComplete }: Props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="senha-wrapper">
      <input
        type={visivel ? 'text' : 'password'}
        id={id}
        name="senha"
        value={value}
        minLength={minLength}
        autoComplete={autoComplete}
        required
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        className="toggle-senha"
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        onClick={() => setVisivel((v) => !v)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          {!visivel && <line x1="1" y1="1" x2="23" y2="23" />}
        </svg>
      </button>
    </div>
  )
}

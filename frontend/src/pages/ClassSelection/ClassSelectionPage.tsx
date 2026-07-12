import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { classesMock } from '../../data/classesMock'

export function ClassSelectionPage() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState<number | null>(null)

  return (
    <section className="stack">
      <PageHeader
        title="Escolha sua classe"
        subtitle="Seu caminho define os desafios e habilidades da jornada."
      />

      <div className="grid classes-grid">
        {classesMock.map((academyClass) => (
          <article key={academyClass.id} className="card class-card">
            <span className="class-icon">{academyClass.icon}</span>
            <h2>{academyClass.name}</h2>
            <p>{academyClass.description}</p>
            <ul>
              {academyClass.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
            <button
              className={selectedClass === academyClass.id ? 'button-secondary selected' : 'button-secondary'}
              onClick={() => setSelectedClass(academyClass.id)}
              type="button"
            >
              {selectedClass === academyClass.id ? 'Selecionada' : 'Selecionar classe'}
            </button>
          </article>
        ))}
      </div>

      <button className="button-primary" disabled={!selectedClass} onClick={() => navigate('/dashboard')}>
        Confirmar e iniciar jornada
      </button>
    </section>
  )
}

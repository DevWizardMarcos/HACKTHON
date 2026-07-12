import { PageHeader } from '../../components/common/PageHeader'
import { ProgressBar } from '../../components/gamification/ProgressBar'
import { achievementsMock } from '../../data/achievementsMock'
import { eventsMock } from '../../data/eventsMock'
import { missionsMock } from '../../data/missionsMock'
import { trailsMock } from '../../data/trailsMock'
import { userMock } from '../../data/userMock'

export function DashboardPage() {
  const currentTrail = trailsMock[0]
  const nextMission = missionsMock[0]
  const progress = Math.round((userMock.currentXp / userMock.nextLevelXp) * 100)

  return (
    <section className="stack">
      <PageHeader
        title={`Saudações, ${userMock.name}`}
        subtitle="Seu painel de progresso na CodeStone Academy"
      />

      <div className="grid dashboard-grid">
        <article className="card">
          <h2>Aluno</h2>
          <p>
            {userMock.avatar} {userMock.name}
          </p>
          <p>Classe: {userMock.className}</p>
          <p>Nível: {userMock.level}</p>
          <p>
            XP: {userMock.currentXp}/{userMock.nextLevelXp}
          </p>
          <ProgressBar value={progress} />
        </article>

        <article className="card">
          <h2>Trilha em andamento</h2>
          <p>{currentTrail.name}</p>
          <p>Progresso: {currentTrail.progress}%</p>
          <ProgressBar value={currentTrail.progress} />
          <p>Próxima missão: {nextMission.title}</p>
        </article>

        <article className="card">
          <h2>Conquistas recentes</h2>
          <ul>
            {achievementsMock.map((achievement) => (
              <li key={achievement.id}>{achievement.title}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Eventos disponíveis</h2>
          <ul>
            {eventsMock.map((event) => (
              <li key={event.id}>
                {event.title} — {event.date}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  )
}

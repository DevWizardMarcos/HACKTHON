interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="card placeholder-page">
      <h1>{title}</h1>
      <p>{description}</p>
      <span>Em desenvolvimento ⚒️</span>
    </section>
  )
}

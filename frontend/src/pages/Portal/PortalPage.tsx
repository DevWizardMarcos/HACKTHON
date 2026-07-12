import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export function PortalPage() {
  return (
    <section className="portal-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="portal-card"
      >
        <p className="tag">A Academia aguarda</p>
        <h1>CodeStone Academy</h1>
        <p>
          Entre pelo portal ancestral e transforme seus estudos em jornadas épicas de evolução.
        </p>
        <Link to="/login" className="button-primary">
          Entrar na Academia
        </Link>
      </motion.div>
    </section>
  )
}

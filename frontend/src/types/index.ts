export interface User {
  id: number
  name: string
  email: string
  avatar: string
  className: string
  level: number
  currentXp: number
  nextLevelXp: number
  currentJourney: string
}

export interface AcademyClass {
  id: number
  name: string
  icon: string
  description: string
  skills: string[]
}

export interface Trail {
  id: number
  name: string
  progress: number
}

export interface Mission {
  id: number
  title: string
  difficulty: 'Fácil' | 'Médio' | 'Difícil'
}

export interface Achievement {
  id: number
  title: string
  description: string
}

export interface EventItem {
  id: number
  title: string
  date: string
}

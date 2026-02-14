import { User, UserRole, Project, ProjectStatus, Application, ApplicationStatus, Interview, InterviewStatus } from '@prisma/client'
import { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
    }
  }

  interface User {
    id: string
    role: UserRole
  }
}

export type ProjectWithDetails = Project & {
  creator: User
  _count: {
    applications: number
    interviews: number
  }
}

export type ApplicationWithDetails = Application & {
  applicant: User & {
    profile: {
      headline: string | null
      bio: string | null
      skills: string[]
      yearsExperience: number | null
      avgRating: number
    } | null
  }
}

export type InterviewWithDetails = Interview & {
  professional: User & {
    profile: {
      headline: string | null
      avgRating: number
    } | null
  }
  project: Project
}

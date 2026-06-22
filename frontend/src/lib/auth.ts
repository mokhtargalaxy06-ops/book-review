import { createContext } from 'react'
import type { User } from '../types'

export interface LoginInput {
  email: string
  password: string
  remember: boolean
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

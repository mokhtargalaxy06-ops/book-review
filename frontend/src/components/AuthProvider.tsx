import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, csrf } from '../api/client'
import type { ResourceResponse, User } from '../types'
import { AuthContext, type LoginInput, type RegisterInput } from '../lib/auth'
import { queryClient } from '../lib/queryClient'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get<ResourceResponse<User>>('/profile')
      setUser(data.data)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
  }, [refreshUser])

  const login = async (input: LoginInput) => {
    await csrf()
    const { data } = await api.post<ResourceResponse<User>>('/login', input)
    setUser(data.data)
  }

  const register = async (input: RegisterInput) => {
    await csrf()
    const { data } = await api.post<ResourceResponse<User>>('/register', input)
    setUser(data.data)
  }

  const logout = async () => {
    await api.post('/logout')
    setUser(null)
    queryClient.clear()
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [loading, refreshUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

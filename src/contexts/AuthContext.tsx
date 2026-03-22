import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { toast } from 'sonner'
import { signIn, signOut, onAuthStateChanged } from '@/services/auth'
import type { AppUser } from '@/types'

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  canEdit: () => boolean
  canViewFinances: () => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const u = await signIn(email, password)
      setUser(u)
      toast.success(`Вітаємо, ${u.email}!`)
    } catch {
      toast.error('Невірний email або пароль')
      throw new Error('auth_failed')
    }
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    toast.info('Ви вийшли з системи')
  }

  const canEdit = () => {
    return !!user && (user.role === 'admin' || user.role === 'manager')
  }

  const canViewFinances = () => {
    return !!user && (user.role === 'admin' || user.role === 'manager')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, canEdit, canViewFinances }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

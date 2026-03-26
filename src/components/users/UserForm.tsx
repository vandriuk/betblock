import { useState, type FormEvent } from 'react'
import type { UserRole } from '@/types'

interface UserFormProps {
  formId?: string
  onSubmit: (data: { email: string; password: string; role: UserRole }) => void
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'worker', label: 'Працівник' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Адміністратор' },
]

export function UserForm({ formId, onSubmit }: UserFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('worker')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    onSubmit({ email: email.trim(), password, role })
    setEmail('')
    setPassword('')
    setRole('worker')
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="user@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Пароль</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Мінімум 6 символів"
          minLength={6}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Роль</label>
        <div className="grid grid-cols-3 gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                role === r.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200 active:border-primary-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all"
        >
          Створити користувача
        </button>
      )}
    </form>
  )
}

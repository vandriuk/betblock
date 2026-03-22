import { LogOut, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  onMenuClick?: () => void
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Адмін',
  manager: 'Менеджер',
  worker: 'Працівник',
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Betblock</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-gray-600 leading-tight">{user.email}</p>
            <p className="text-xs text-primary-600 font-medium">{ROLE_LABELS[user.role]}</p>
          </div>
          <span className="sm:hidden text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
            {ROLE_LABELS[user.role]}
          </span>
          <button
            onClick={logout}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

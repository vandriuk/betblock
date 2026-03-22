import { LogOut, Download, Database, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { useExport } from '@/hooks/useExport'
import { useDarkMode } from '@/hooks/useDarkMode'
import { FeedbackButton } from '@/components/shared/FeedbackButton'

const ROLE_LABELS: Record<string, string> = {
  admin: 'Адмін',
  manager: 'Менеджер',
  worker: 'Працівник',
}

export function Header() {
  const { user, logout, canViewFinances, canEdit } = useAuth()
  const data = useData()
  const { exportToExcel, exportToJSON } = useExport()
  const { dark, toggle: toggleDark } = useDarkMode()

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">Betblock</h1>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleDark}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
            title={dark ? 'Світла тема' : 'Темна тема'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <FeedbackButton userEmail={user.email} />
          {canEdit() && (
            <>
              <button
                onClick={() => exportToExcel(data, canViewFinances())}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Експорт Excel"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => exportToJSON(data)}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                title="Backup JSON"
              >
                <Database className="w-5 h-5" />
              </button>
            </>
          )}
          <div className="text-right hidden sm:block ml-2">
            <p className="text-sm text-gray-600 leading-tight">{user.email}</p>
            <p className="text-xs text-primary-600 font-medium">{ROLE_LABELS[user.role]}</p>
          </div>
          <span className="sm:hidden text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium ml-1">
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

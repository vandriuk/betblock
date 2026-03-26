import { useState } from 'react'
import { LogOut, Download, Database, Sun, Moon, MoreVertical } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-bold text-gray-900">Betblock</h1>

        <div className="flex items-center gap-0.5">
          <button
            onClick={toggleDark}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100"
            title={dark ? 'Світла тема' : 'Темна тема'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-lg font-semibold">
            {ROLE_LABELS[user.role]}
          </span>

          {canEdit() && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-500 active:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[200px]">
                    <FeedbackButton userEmail={user.email} onDone={() => setMenuOpen(false)} />
                    <button
                      onClick={() => { exportToExcel(data, canViewFinances()); setMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 h-12 text-sm text-gray-700 active:bg-gray-50"
                    >
                      <Download className="w-5 h-5 text-gray-400" />
                      Експорт Excel
                    </button>
                    <button
                      onClick={() => { exportToJSON(data); setMenuOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 h-12 text-sm text-gray-700 active:bg-gray-50"
                    >
                      <Database className="w-5 h-5 text-gray-400" />
                      Backup JSON
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={logout}
            className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:bg-red-50"
            title="Вийти"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

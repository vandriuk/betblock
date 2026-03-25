import { useState } from 'react'
import { LogOut, Download, Database, Sun, Moon, Menu, X } from 'lucide-react'
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
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Branding */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">B</span>
            </div>
            <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Betblock</h1>
          </div>

          {/* Right side — dark mode + user + menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleDark}
              className="flex items-center justify-center w-11 h-11 rounded-xl text-gray-500 hover:text-accent-500 hover:bg-accent-50 active:scale-95 transition-all"
              title={dark ? 'Світла тема' : 'Темна тема'}
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-lg font-semibold">
              {ROLE_LABELS[user.role]}
            </span>

            {canEdit() && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={logout}
              className="flex items-center justify-center w-11 h-11 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
              title="Вийти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dropdown tools menu */}
        {menuOpen && canEdit() && (
          <div className="border-t border-gray-100 bg-white px-4 py-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mr-auto">Інструменти</p>
              <FeedbackButton userEmail={user.email} />
              <button
                onClick={() => { exportToExcel(data, canViewFinances()); setMenuOpen(false) }}
                className="flex items-center gap-2 h-11 px-3.5 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 active:scale-[0.97] transition-all"
              >
                <Download className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => { exportToJSON(data); setMenuOpen(false) }}
                className="flex items-center gap-2 h-11 px-3.5 rounded-xl text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 active:scale-[0.97] transition-all"
              >
                <Database className="w-4.5 h-4.5" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

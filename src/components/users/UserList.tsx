import { Shield, ShieldCheck, ShieldAlert, Trash2 } from 'lucide-react'
import type { UserRecord, UserRole } from '@/types'

interface UserListProps {
  users: UserRecord[]
  currentUid: string
  onRoleChange: (user: UserRecord, newRole: UserRole) => void
  onDelete: (user: UserRecord) => void
}

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  admin: { label: 'Адмін', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  manager: { label: 'Менеджер', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
  worker: { label: 'Працівник', icon: Shield, color: 'text-gray-600', bg: 'bg-gray-50' },
}

const ROLES: UserRole[] = ['worker', 'manager', 'admin']

export function UserList({ users, currentUid, onRoleChange, onDelete }: UserListProps) {
  return (
    <div className="space-y-3">
      {users.map((user) => {
        const config = ROLE_CONFIG[user.role]
        const Icon = config.icon
        const isSelf = user.uid === currentUid || user.docId === currentUid

        return (
          <div key={user.uid || user.docId} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                  <p className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                    {isSelf && <span className="text-gray-400 ml-1">(ви)</span>}
                  </p>
                </div>
              </div>
              {!isSelf && (
                <button
                  onClick={() => onDelete(user)}
                  className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:bg-red-50 active:text-red-500 shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Role selector */}
            {!isSelf && (
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => onRoleChange(user, r)}
                    className={`py-2 rounded-lg text-xs font-medium transition-all ${
                      user.role === r
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                  >
                    {ROLE_CONFIG[r].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { subscribeCollection } from '@/services/firestore'
import { createUser, updateUserRole, removeUser } from '@/services/auth'
import { UserList } from './UserList'
import { UserForm } from './UserForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { UserRecord, UserRole } from '@/types'

export function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<UserRecord | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeCollection<UserRecord>('users', (items) => {
      // Map Firestore docs: docId is the uid
      const mapped = items.map((u) => ({
        ...u,
        uid: u.docId || u.uid,
      }))
      setUsers(mapped)
    })
    return unsubscribe
  }, [])

  const handleAdd = async (data: { email: string; password: string; role: UserRole }) => {
    try {
      await createUser(data.email, data.password, data.role)
      toast.success(`Користувача ${data.email} створено`)
      setShowForm(false)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Помилка'
      if (msg.includes('email-already-in-use')) {
        toast.error('Цей email вже зареєстрований')
      } else if (msg.includes('weak-password')) {
        toast.error('Пароль занадто слабкий (мін. 6 символів)')
      } else if (msg.includes('invalid-email')) {
        toast.error('Невірний формат email')
      } else {
        toast.error(`Помилка: ${msg}`)
      }
    }
  }

  const handleRoleChange = async (target: UserRecord, newRole: UserRole) => {
    if (target.role === newRole) return
    try {
      const id = target.docId || target.uid
      await updateUserRole(id, newRole)
      toast.success(`Роль ${target.email} змінено на "${newRole}"`)
    } catch {
      toast.error('Не вдалося змінити роль')
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      const id = deleting.docId || deleting.uid
      await removeUser(id)
      toast.success(`Користувача ${deleting.email} видалено`)
      setDeleting(null)
    } catch {
      toast.error('Не вдалося видалити')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Користувачі</h2>
        <p className="text-sm text-gray-500 mt-0.5">Управління доступом</p>
      </div>

      {users.length === 0 ? (
        <EmptyState title="Немає користувачів" message="Додайте першого користувача" />
      ) : (
        <UserList
          users={users}
          currentUid={user?.uid || ''}
          onRoleChange={handleRoleChange}
          onDelete={setDeleting}
        />
      )}

      <FAB onClick={() => setShowForm(true)} />

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Новий користувач"
        footer={
          <button
            type="submit"
            form="user-form"
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all"
          >
            Створити користувача
          </button>
        }
      >
        <UserForm formId="user-form" onSubmit={handleAdd} />
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити користувача?"
        message={`${deleting?.email} втратить доступ до системи.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { ExpensesList } from './ExpensesList'
import { ExpenseForm } from './ExpenseForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Expense } from '@/types'

export function ExpensesPage() {
  const { expenses, addItem, deleteItem } = useData()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Expense | null>(null)

  const handleAdd = async (data: Omit<Expense, 'id' | 'docId'>) => {
    await addItem('expenses', data)
    setShowForm(false)
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('expenses', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Витрати</h2>
        <p className="text-sm text-gray-500 mt-0.5">Облік витрат підприємства</p>
      </div>

      {expenses.length === 0 ? (
        <EmptyState title="Немає витрат" message="Додайте першу витрату" />
      ) : (
        <ExpensesList items={expenses} onDelete={setDeleting} />
      )}

      <FAB onClick={() => setShowForm(true)} />

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Нова витрата">
        {user && <ExpenseForm userEmail={user.email} onSubmit={handleAdd} />}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити витрату?"
        message={`"${deleting?.description}" буде видалено.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

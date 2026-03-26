import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { ExpensesList } from './ExpensesList'
import { ExpenseForm } from './ExpenseForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { StatusFilter } from '@/components/shared/StatusFilter'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import type { Expense, ExpenseCategory } from '@/types'

export function ExpensesPage() {
  const { expenses, inventory, addExpenseWithInventory, deleteItem } = useData()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Expense | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | null>(null)

  const filtered = useMemo(() => {
    let result = expenses
    if (categoryFilter) result = result.filter((e) => e.category === categoryFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((e) => e.description.toLowerCase().includes(q))
    }
    return result
  }, [expenses, categoryFilter, search])

  const handleAdd = async (data: Omit<Expense, 'id' | 'docId'>) => {
    await addExpenseWithInventory(data)
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

      {expenses.length > 0 && (
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Пошук за описом..." />
          <StatusFilter
            options={EXPENSE_CATEGORIES}
            selected={categoryFilter}
            onSelect={setCategoryFilter}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={expenses.length === 0 ? 'Немає витрат' : 'Нічого не знайдено'}
          message={expenses.length === 0 ? 'Додайте першу витрату' : 'Спробуйте інший пошук'}
        />
      ) : (
        <ExpensesList items={filtered} onDelete={setDeleting} />
      )}

      <FAB onClick={() => setShowForm(true)} />

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Нова витрата"
        footer={
          <button type="submit" form="expense-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати витрату
          </button>
        }
      >
        {user && (
          <ExpenseForm
            formId="expense-form"
            userEmail={user.email}
            inventory={inventory}
            onSubmit={handleAdd}
          />
        )}
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

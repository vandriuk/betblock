import { Trash2 } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'
import type { Expense } from '@/types'

interface ExpensesListProps {
  items: Expense[]
  onDelete: (expense: Expense) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  'Сировина': 'bg-orange-100 text-orange-700',
  'Зарплата': 'bg-blue-100 text-blue-700',
  'Електроенергія': 'bg-yellow-100 text-yellow-700',
  'Обладнання': 'bg-purple-100 text-purple-700',
  'Транспорт': 'bg-cyan-100 text-cyan-700',
  'Оренда': 'bg-pink-100 text-pink-700',
  'Інше': 'bg-gray-100 text-gray-700',
}

export function ExpensesList({ items, onDelete }: ExpensesListProps) {
  return (
    <div className="space-y-2">
      {items.map((expense) => (
        <div
          key={expense.docId || expense.id}
          className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{expense.description}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[expense.category] || CATEGORY_COLORS['Інше']}`}>
                {expense.category}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="text-gray-500">{formatDate(expense.date)}</span>
              <span className="font-bold text-red-600">{formatCurrency(expense.amount)}</span>
            </div>
          </div>
          <button
            onClick={() => onDelete(expense)}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

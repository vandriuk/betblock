import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import type { ExpenseCategory } from '@/types'

interface ExpenseFormProps {
  userEmail: string
  onSubmit: (data: {
    date: string
    category: ExpenseCategory
    description: string
    amount: number
    createdBy: string
  }) => void
}

export function ExpenseForm({ userEmail, onSubmit }: ExpenseFormProps) {
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState<ExpenseCategory>('Сировина')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState(0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim() || amount <= 0) return
    onSubmit({
      date,
      category,
      description: description.trim(),
      amount,
      createdBy: userEmail,
    })
    setDescription('')
    setAmount(0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Категорія</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Опис</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="На що витрачено"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Сума (₴)</label>
        <input
          type="number"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          min="0.01"
          step="0.01"
          placeholder="1000"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        Додати витрату
      </button>
    </form>
  )
}

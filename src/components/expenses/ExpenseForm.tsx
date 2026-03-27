import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { Package } from 'lucide-react'
import type { Expense, ExpenseCategory, InventoryItem } from '@/types'

type FormData = Omit<Expense, 'id' | 'docId'>

interface ExpenseFormProps {
  userEmail: string
  formId?: string
  inventory?: InventoryItem[]
  initial?: Partial<FormData>
  onSubmit: (data: FormData) => void
}

export function ExpenseForm({ userEmail, formId, inventory = [], initial, onSubmit }: ExpenseFormProps) {
  const [date, setDate] = useState(initial?.date || todayISO())
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category || 'Сировина')
  const [description, setDescription] = useState(initial?.description || '')
  const [amount, setAmount] = useState(initial?.amount || 0)
  // Material fields (only for "Сировина")
  const [materialName, setMaterialName] = useState(initial?.materialName || inventory[0]?.name || '')
  const [materialQuantity, setMaterialQuantity] = useState(initial?.materialQuantity || 0)
  const [submitting, setSubmitting] = useState(false)

  const isMaterial = category === 'Сировина'

  const handleCategoryChange = (val: ExpenseCategory) => {
    setCategory(val)
    if (val === 'Сировина' && !materialName && inventory.length > 0) {
      setMaterialName(inventory[0].name)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!description.trim() || amount <= 0 || submitting) return
    setSubmitting(true)
    try {
    await onSubmit({
      date,
      category,
      description: description.trim(),
      amount,
      createdBy: initial?.createdBy || userEmail,
      ...(isMaterial && materialName && materialQuantity > 0
        ? { materialName, materialQuantity }
        : {}),
    })
    if (!initial) {
      setDescription('')
      setAmount(0)
      setMaterialQuantity(0)
    }
    } finally {
      setSubmitting(false)
    }
  }

  const selectedMaterial = inventory.find((inv) => inv.name === materialName)

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Категорія</label>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value as ExpenseCategory)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
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
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder={isMaterial ? 'Закупівля цементу' : 'На що витрачено'}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Сума (₴)</label>
        <input
          type="number"
          inputMode="decimal"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          min="0.01"
          step="0.01"
          placeholder="1000"
          required
        />
      </div>

      {/* Material fields — only when category is "Сировина" */}
      {isMaterial && inventory.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
            <Package className="w-4 h-4" />
            Оприбуткування на склад
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Матеріал</label>
              <select
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                {inventory.map((inv) => (
                  <option key={inv.docId || inv.id} value={inv.name}>
                    {inv.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Кількість ({selectedMaterial?.unit || 'кг'})
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={materialQuantity || ''}
                onChange={(e) => setMaterialQuantity(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                min="0"
                step="0.01"
                placeholder="1000"
              />
            </div>
          </div>
          {materialQuantity > 0 && selectedMaterial && (
            <p className="text-xs text-blue-600">
              На складі зараз: {selectedMaterial.quantity} {selectedMaterial.unit} → буде: {selectedMaterial.quantity + materialQuantity} {selectedMaterial.unit}
            </p>
          )}
          {!materialQuantity && (
            <p className="text-xs text-gray-400">Залиште 0 якщо не потрібно додавати на склад</p>
          )}
        </div>
      )}

      {!formId && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? 'Збереження...' : (initial ? 'Зберегти' : 'Додати витрату')}
        </button>
      )}
    </form>
  )
}

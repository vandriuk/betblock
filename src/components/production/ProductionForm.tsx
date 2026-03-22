import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { SHIFTS } from '@/lib/constants'
import type { Product, Shift } from '@/types'

interface ProductionFormProps {
  products: Product[]
  userEmail: string
  onSubmit: (data: { date: string; shift: Shift; productName: string; blocks: number; createdBy: string }) => void
}

export function ProductionForm({ products, userEmail, onSubmit }: ProductionFormProps) {
  const [date, setDate] = useState(todayISO())
  const [shift, setShift] = useState<Shift>('Денна')
  const [productName, setProductName] = useState(products[0]?.name || '')
  const [blocks, setBlocks] = useState(0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!productName || blocks <= 0) return
    onSubmit({ date, shift, productName, blocks, createdBy: userEmail })
    setBlocks(0)
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Зміна</label>
        <div className="grid grid-cols-2 gap-2">
          {SHIFTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShift(s)}
              className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                shift === s
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Продукція</label>
        <select
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          required
        >
          {products.map((p) => (
            <option key={p.docId || p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Кількість (шт)</label>
        <input
          type="number"
          value={blocks || ''}
          onChange={(e) => setBlocks(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          min="1"
          placeholder="100"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        Додати запис
      </button>
    </form>
  )
}

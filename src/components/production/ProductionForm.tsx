import { useState, useMemo, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { SHIFTS } from '@/lib/constants'
import { AlertTriangle } from 'lucide-react'
import type { Product, Shift, InventoryItem } from '@/types'

interface ProductionFormProps {
  products: Product[]
  inventory: InventoryItem[]
  userEmail: string
  formId?: string
  onSubmit: (data: { date: string; shift: Shift; productName: string; blocks: number; createdBy: string }) => Promise<{ success: boolean; error?: string }>
}

export function ProductionForm({ products, inventory, userEmail, formId, onSubmit }: ProductionFormProps) {
  const [date, setDate] = useState(todayISO())
  const [shift, setShift] = useState<Shift>('Денна')
  const [productName, setProductName] = useState(products[0]?.name || '')
  const [blocks, setBlocks] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedProduct = products.find((p) => p.name === productName)

  // Calculate max possible blocks based on available materials
  const materialInfo = useMemo(() => {
    if (!selectedProduct?.recipe || selectedProduct.recipe.length === 0) {
      return { maxBlocks: Infinity, details: [] }
    }

    const details = selectedProduct.recipe.map((ingredient) => {
      const material = inventory.find((inv) => inv.name === ingredient.materialName)
      const available = material?.quantity || 0
      const needed = blocks > 0 ? ingredient.amountPerBlock * blocks : 0
      const maxBlocks = material ? Math.floor(available / ingredient.amountPerBlock) : 0
      return {
        name: ingredient.materialName,
        unit: material?.unit || 'кг',
        available,
        needed,
        enough: available >= needed,
        maxBlocks,
      }
    })

    const maxBlocks = Math.min(...details.map((d) => d.maxBlocks))
    return { maxBlocks, details }
  }, [selectedProduct, inventory, blocks])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!productName || blocks <= 0) return

    setSubmitting(true)
    setError(null)

    const result = await onSubmit({ date, shift, productName, blocks, createdBy: userEmail })

    if (!result.success) {
      setError(result.error || 'Невідома помилка')
    } else {
      setBlocks(0)
      setError(null)
    }
    setSubmitting(false)
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => { setProductName(e.target.value); setError(null) }}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          required
        >
          {products.map((p) => (
            <option key={p.docId || p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Кількість (шт)
          {materialInfo.maxBlocks !== Infinity && materialInfo.maxBlocks > 0 && (
            <span className="text-xs text-gray-400 ml-2">макс: {materialInfo.maxBlocks}</span>
          )}
        </label>
        <input
          type="number"
          value={blocks || ''}
          onChange={(e) => { setBlocks(Number(e.target.value)); setError(null) }}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          min="1"
          placeholder="100"
          required
        />
      </div>

      {/* Material usage preview */}
      {blocks > 0 && materialInfo.details.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500 uppercase">Витрата матеріалів:</p>
          {materialInfo.details.map((d) => (
            <div key={d.name} className={`flex items-center justify-between text-sm ${!d.enough ? 'text-red-600' : 'text-gray-700'}`}>
              <span>{d.name}</span>
              <span>
                {d.needed.toFixed(1)} / {d.available.toFixed(1)} {d.unit}
                {!d.enough && <AlertTriangle className="w-3.5 h-3.5 inline ml-1 text-red-500" />}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 whitespace-pre-line">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!formId && (
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {submitting ? 'Обробка...' : 'Додати запис'}
        </button>
      )}
    </form>
  )
}

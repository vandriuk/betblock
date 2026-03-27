import { useState, type FormEvent } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { RecipeItem, InventoryItem } from '@/types'

interface ProductFormProps {
  onSubmit: (name: string, price: number, recipe: RecipeItem[], initialStock: number) => void
  initial?: { name: string; price: number; recipe?: RecipeItem[]; initialStock?: number }
  submitLabel?: string
  formId?: string
  inventory?: InventoryItem[]
}

export function ProductForm({ onSubmit, initial, submitLabel = 'Додати', formId, inventory = [] }: ProductFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [price, setPrice] = useState(initial?.price || 0)
  const [recipe, setRecipe] = useState<RecipeItem[]>(initial?.recipe || [])
  const [initialStock, setInitialStock] = useState(initial?.initialStock || 0)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || price <= 0) return
    onSubmit(name.trim(), price, recipe, initialStock)
    if (!initial) {
      setName('')
      setPrice(0)
      setRecipe([])
      setInitialStock(0)
    }
  }

  const addIngredient = () => {
    const availableMaterials = inventory.filter(
      (inv) => !recipe.some((r) => r.materialName === inv.name)
    )
    if (availableMaterials.length === 0) return
    setRecipe([...recipe, { materialName: availableMaterials[0].name, amountPerBlock: 1 }])
  }

  const updateIngredient = (index: number, field: keyof RecipeItem, value: string | number) => {
    const updated = [...recipe]
    updated[index] = { ...updated[index], [field]: value }
    setRecipe(updated)
  }

  const removeIngredient = (index: number) => {
    setRecipe(recipe.filter((_, i) => i !== index))
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Назва</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Шлакоблок"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (₴)</label>
          <input
            type="number"
            inputMode="decimal"
            value={price || ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="25"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Початковий залишок</label>
          <input
            type="number"
            inputMode="numeric"
            value={initialStock || ''}
            onChange={(e) => setInitialStock(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      {/* Recipe section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Рецептура (на 1 блок)</label>
          {inventory.length > 0 && (
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Додати
            </button>
          )}
        </div>

        {recipe.length === 0 ? (
          <p className="text-xs text-gray-400">Без рецептури — матеріали не списуватимуться</p>
        ) : (
          <div className="space-y-2">
            {recipe.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={item.materialName}
                  onChange={(e) => updateIngredient(idx, 'materialName', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white outline-none focus:ring-1 focus:ring-primary-500"
                >
                  {inventory.map((inv) => (
                    <option key={inv.docId || inv.id} value={inv.name}>
                      {inv.name} ({inv.unit})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.amountPerBlock || ''}
                  onChange={(e) => updateIngredient(idx, 'amountPerBlock', Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary-500"
                  min="0.01"
                  step="0.01"
                  placeholder="кг"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {submitLabel}
        </button>
      )}
    </form>
  )
}

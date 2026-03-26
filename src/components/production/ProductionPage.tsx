import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { ProductionList } from './ProductionList'
import { ProductionForm } from './ProductionForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import type { ProductionRecord } from '@/types'

export function ProductionPage() {
  const { production, products, inventory, addProductionWithDeduction, deleteItem } = useData()
  const { canEdit, user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<ProductionRecord | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return production
    const q = search.toLowerCase()
    return production.filter((p) =>
      p.productName.toLowerCase().includes(q) || p.createdBy.toLowerCase().includes(q)
    )
  }, [production, search])

  const handleAdd = async (data: Omit<ProductionRecord, 'id' | 'docId'>) => {
    const result = await addProductionWithDeduction(data)
    if (result.success) {
      setShowForm(false)
    }
    return result
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('production', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Виробництво</h2>
        <p className="text-sm text-gray-500 mt-0.5">Журнал виробництва блоків</p>
      </div>

      {production.length > 0 && (
        <SearchBar value={search} onChange={setSearch} placeholder="Пошук за продуктом або працівником..." />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={production.length === 0 ? 'Немає записів' : 'Нічого не знайдено'}
          message={production.length === 0 ? 'Додайте запис виробництва' : 'Спробуйте інший пошук'}
        />
      ) : (
        <ProductionList
          items={filtered}
          canDelete={canEdit()}
          onDelete={setDeleting}
        />
      )}

      {/* Workers can also add production records */}
      {user && <FAB onClick={() => setShowForm(true)} />}

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Новий запис"
        footer={
          <button type="submit" form="production-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати запис
          </button>
        }
      >
        {user && (
          <ProductionForm
            formId="production-form"
            products={products}
            inventory={inventory}
            userEmail={user.email}
            onSubmit={handleAdd}
          />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити запис?"
        message="Цей запис виробництва буде видалено."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

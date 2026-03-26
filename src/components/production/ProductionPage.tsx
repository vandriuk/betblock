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
import { DateFilter, filterByDate, type DatePreset } from '@/components/shared/DateFilter'
import { Pagination } from '@/components/shared/Pagination'
import { usePagination } from '@/hooks/usePagination'
import type { ProductionRecord } from '@/types'

export function ProductionPage() {
  const { production, products, inventory, addProductionWithDeduction, updateItem, deleteItem } = useData()
  const { canEdit, user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ProductionRecord | null>(null)
  const [deleting, setDeleting] = useState<ProductionRecord | null>(null)
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState<DatePreset | 'custom'>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const filtered = useMemo(() => {
    let result = filterByDate(production, datePreset === 'custom' ? 'all' : datePreset, customFrom, customTo)
    if (datePreset === 'custom' && (customFrom || customTo)) {
      result = result.filter((p) => {
        const d = p.date.split('T')[0]
        if (customFrom && d < customFrom) return false
        if (customTo && d > customTo) return false
        return true
      })
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(q) || p.createdBy.toLowerCase().includes(q)
      )
    }
    return result
  }, [production, search, datePreset, customFrom, customTo])

  const { paged, page, totalPages, totalItems, pageSize, onPageChange } = usePagination(filtered)

  const handleAdd = async (data: Omit<ProductionRecord, 'id' | 'docId'>) => {
    const result = await addProductionWithDeduction(data)
    if (result.success) {
      setShowForm(false)
    }
    return result
  }

  const handleEdit = async (data: Omit<ProductionRecord, 'id' | 'docId'>): Promise<{ success: boolean; error?: string }> => {
    if (!editing) return { success: false, error: 'Немає запису для редагування' }
    const id = editing.docId || String(editing.id)
    await updateItem('production', id, data)
    setEditing(null)
    return { success: true }
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
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Пошук за продуктом або працівником..." />
          <DateFilter
            value={datePreset}
            onPreset={(p) => setDatePreset(p)}
            customFrom={customFrom}
            customTo={customTo}
            onCustomChange={(f, t) => { setDatePreset('custom'); setCustomFrom(f); setCustomTo(t) }}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={production.length === 0 ? 'Немає записів' : 'Нічого не знайдено'}
          message={production.length === 0 ? 'Додайте запис виробництва' : 'Спробуйте інший пошук'}
        />
      ) : (
        <>
          <ProductionList
            items={paged}
            canDelete={canEdit()}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} totalItems={totalItems} pageSize={pageSize} />
        </>
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

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редагування"
        footer={
          <button type="submit" form="production-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && user && (
          <ProductionForm
            formId="production-edit-form"
            products={products}
            inventory={inventory}
            userEmail={user.email}
            initial={editing}
            onSubmit={handleEdit}
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

import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { ProductionList } from './ProductionList'
import { ProductionForm } from './ProductionForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ProductionRecord } from '@/types'

export function ProductionPage() {
  const { production, products, addItem, deleteItem } = useData()
  const { canEdit, user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<ProductionRecord | null>(null)

  const handleAdd = async (data: Omit<ProductionRecord, 'id' | 'docId'>) => {
    await addItem('production', data)
    setShowForm(false)
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

      {production.length === 0 ? (
        <EmptyState title="Немає записів" message="Додайте запис виробництва" />
      ) : (
        <ProductionList
          items={production}
          canDelete={canEdit()}
          onDelete={setDeleting}
        />
      )}

      {/* Workers can also add production records */}
      {user && <FAB onClick={() => setShowForm(true)} />}

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Новий запис">
        {user && (
          <ProductionForm
            products={products}
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

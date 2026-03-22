import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { SalesList } from './SalesList'
import { SaleForm } from './SaleForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Sale } from '@/types'

export function SalesPage() {
  const { sales, products, addItem, updateItem, deleteItem } = useData()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Sale | null>(null)

  const handleAdd = async (data: Omit<Sale, 'id' | 'docId'>) => {
    await addItem('sales', data)
    setShowForm(false)
  }

  const handleTogglePaid = async (sale: Sale) => {
    const id = sale.docId || String(sale.id)
    await updateItem('sales', id, { paid: !sale.paid })
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('sales', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Продажі</h2>
        <p className="text-sm text-gray-500 mt-0.5">Облік продажів</p>
      </div>

      {sales.length === 0 ? (
        <EmptyState title="Немає продажів" message="Додайте перший продаж" />
      ) : (
        <SalesList
          items={sales}
          onTogglePaid={handleTogglePaid}
          onDelete={setDeleting}
        />
      )}

      <FAB onClick={() => setShowForm(true)} />

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Новий продаж">
        {user && (
          <SaleForm products={products} userEmail={user.email} onSubmit={handleAdd} />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити продаж?"
        message={`Продаж для ${deleting?.customer} буде видалено.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

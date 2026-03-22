import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { OrderList } from './OrderList'
import { OrderForm } from './OrderForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Order, OrderStatus } from '@/types'

export function OrdersPage() {
  const { orders, products, addItem, updateItem, deleteItem } = useData()
  const { canEdit, user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState<Order | null>(null)

  const handleAdd = async (data: Omit<Order, 'id' | 'docId'>) => {
    await addItem('orders', data)
    setShowForm(false)
  }

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    const id = order.docId || String(order.id)
    await updateItem('orders', id, { status: newStatus })
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('orders', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Замовлення</h2>
        <p className="text-sm text-gray-500 mt-0.5">Замовлення клієнтів</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Немає замовлень" message="Створіть перше замовлення" />
      ) : (
        <OrderList
          items={orders}
          canEdit={canEdit()}
          onStatusChange={handleStatusChange}
          onDelete={setDeleting}
        />
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Нове замовлення">
        {user && (
          <OrderForm products={products} userEmail={user.email} onSubmit={handleAdd} />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити замовлення?"
        message={`Замовлення від ${deleting?.customer} буде видалено.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

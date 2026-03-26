import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { OrderList } from './OrderList'
import { OrderForm } from './OrderForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { StatusFilter } from '@/components/shared/StatusFilter'
import { DateFilter, filterByDate, type DatePreset } from '@/components/shared/DateFilter'
import { ORDER_STATUSES } from '@/lib/constants'
import type { Order, OrderStatus } from '@/types'

export function OrdersPage() {
  const { orders, products, addItem, updateItem, deleteItem, createSaleFromOrder } = useData()
  const { canEdit, user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Order | null>(null)
  const [deleting, setDeleting] = useState<Order | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null)
  const [datePreset, setDatePreset] = useState<DatePreset | 'custom'>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const filtered = useMemo(() => {
    let result = filterByDate(orders, datePreset === 'custom' ? 'all' : datePreset, customFrom, customTo)
    if (datePreset === 'custom' && (customFrom || customTo)) {
      result = result.filter((o) => {
        const d = o.date.split('T')[0]
        if (customFrom && d < customFrom) return false
        if (customTo && d > customTo) return false
        return true
      })
    }
    if (statusFilter) result = result.filter((o) => o.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((o) =>
        o.customer.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q)
      )
    }
    return result
  }, [orders, statusFilter, search, datePreset, customFrom, customTo])

  const handleAdd = async (data: Omit<Order, 'id' | 'docId'>) => {
    await addItem('orders', data)
    setShowForm(false)
  }

  const handleEdit = async (data: Omit<Order, 'id' | 'docId'>) => {
    if (!editing) return
    const id = editing.docId || String(editing.id)
    await updateItem('orders', id, data)
    setEditing(null)
  }

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    const id = order.docId || String(order.id)
    await updateItem('orders', id, { status: newStatus })
  }

  const handleCreateSale = async (order: Order) => {
    if (!user) return
    await createSaleFromOrder(order, user.email)
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

      {orders.length > 0 && (
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Пошук за клієнтом..." />
          <DateFilter
            value={datePreset}
            onPreset={(p) => setDatePreset(p)}
            customFrom={customFrom}
            customTo={customTo}
            onCustomChange={(f, t) => { setDatePreset('custom'); setCustomFrom(f); setCustomTo(t) }}
          />
          <StatusFilter
            options={ORDER_STATUSES}
            selected={statusFilter}
            onSelect={setStatusFilter}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={orders.length === 0 ? 'Немає замовлень' : 'Нічого не знайдено'}
          message={orders.length === 0 ? 'Створіть перше замовлення' : 'Спробуйте інший пошук'}
        />
      ) : (
        <OrderList
          items={filtered}
          canEdit={canEdit()}
          onStatusChange={handleStatusChange}
          onEdit={setEditing}
          onDelete={setDeleting}
          onCreateSale={handleCreateSale}
        />
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Нове замовлення"
        footer={
          <button type="submit" form="order-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Створити замовлення
          </button>
        }
      >
        {user && (
          <OrderForm formId="order-form" products={products} userEmail={user.email} onSubmit={handleAdd} />
        )}
      </Sheet>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редагування"
        footer={
          <button type="submit" form="order-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && user && (
          <OrderForm formId="order-edit-form" products={products} userEmail={user.email} initial={editing} onSubmit={handleEdit} />
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

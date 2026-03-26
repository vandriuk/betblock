import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { CustomerList } from './CustomerList'
import { CustomerForm } from './CustomerForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { Pagination } from '@/components/shared/Pagination'
import { usePagination } from '@/hooks/usePagination'
import type { Customer } from '@/types'

export function CustomersPage() {
  const { customers, orders, sales, addItem, updateItem, deleteItem } = useData()
  const { canEdit } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return customers
    const q = search.toLowerCase()
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    )
  }, [customers, search])

  const { paged, page, totalPages, totalItems, pageSize, onPageChange } = usePagination(filtered)

  const handleAdd = async (data: Omit<Customer, 'id' | 'docId'>) => {
    await addItem('customers', data)
    setShowForm(false)
  }

  const handleEdit = async (data: Omit<Customer, 'id' | 'docId'>) => {
    if (!editing) return
    const id = editing.docId || String(editing.id)
    await updateItem('customers', id, data)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('customers', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Клієнти</h2>
        <p className="text-sm text-gray-500 mt-0.5">База клієнтів</p>
      </div>

      {customers.length > 0 && (
        <SearchBar value={search} onChange={setSearch} placeholder="Пошук за ім'ям або телефоном..." />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={customers.length === 0 ? 'Немає клієнтів' : 'Нічого не знайдено'}
          message={customers.length === 0 ? 'Додайте першого клієнта' : 'Спробуйте інший пошук'}
        />
      ) : (
        <>
          <CustomerList
            customers={paged}
            orders={orders}
            sales={sales}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} totalItems={totalItems} pageSize={pageSize} />
        </>
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Новий клієнт"
        footer={
          <button type="submit" form="customer-add-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати клієнта
          </button>
        }
      >
        <CustomerForm formId="customer-add-form" onSubmit={handleAdd} />
      </Sheet>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редагування"
        footer={
          <button type="submit" form="customer-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && (
          <CustomerForm formId="customer-edit-form" initial={editing} onSubmit={handleEdit} />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити клієнта?"
        message={`${deleting?.name} буде видалено.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

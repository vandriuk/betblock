import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { SalesList } from './SalesList'
import { SaleForm } from './SaleForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import { DateFilter, filterByDate, type DatePreset } from '@/components/shared/DateFilter'
import type { Sale } from '@/types'

export function SalesPage() {
  const { sales, products, production, customers, addItem, updateItem, deleteItem } = useData()
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Sale | null>(null)
  const [deleting, setDeleting] = useState<Sale | null>(null)
  const [search, setSearch] = useState('')
  const [datePreset, setDatePreset] = useState<DatePreset | 'custom'>('all')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const filtered = useMemo(() => {
    let result = filterByDate(sales, datePreset === 'custom' ? 'all' : datePreset, customFrom, customTo)
    if (datePreset === 'custom' && (customFrom || customTo)) {
      result = result.filter((s) => {
        const d = s.date.split('T')[0]
        if (customFrom && d < customFrom) return false
        if (customTo && d > customTo) return false
        return true
      })
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((s) =>
        s.customer.toLowerCase().includes(q) || s.productName.toLowerCase().includes(q)
      )
    }
    return result
  }, [sales, search, datePreset, customFrom, customTo])

  const handleAdd = async (data: Omit<Sale, 'id' | 'docId'>) => {
    await addItem('sales', data)
    setShowForm(false)
  }

  const handleEdit = async (data: Omit<Sale, 'id' | 'docId'>) => {
    if (!editing) return
    const id = editing.docId || String(editing.id)
    await updateItem('sales', id, data)
    setEditing(null)
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

      {sales.length > 0 && (
        <div className="space-y-3">
          <SearchBar value={search} onChange={setSearch} placeholder="Пошук за клієнтом..." />
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
          title={sales.length === 0 ? 'Немає продажів' : 'Нічого не знайдено'}
          message={sales.length === 0 ? 'Додайте перший продаж' : 'Спробуйте інший пошук'}
        />
      ) : (
        <SalesList
          items={filtered}
          onTogglePaid={handleTogglePaid}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      )}

      <FAB onClick={() => setShowForm(true)} />

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Новий продаж"
        footer={
          <button type="submit" form="sale-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати продаж
          </button>
        }
      >
        {user && (
          <SaleForm
            formId="sale-form"
            products={products}
            customers={customers}
            production={production}
            sales={sales}
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
          <button type="submit" form="sale-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && user && (
          <SaleForm
            formId="sale-edit-form"
            products={products}
            customers={customers}
            production={production}
            sales={sales}
            userEmail={user.email}
            initial={editing}
            onSubmit={handleEdit}
          />
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

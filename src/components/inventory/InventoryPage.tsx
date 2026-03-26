import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { InventoryList } from './InventoryList'
import { InventoryForm } from './InventoryForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { SearchBar } from '@/components/shared/SearchBar'
import type { InventoryItem } from '@/types'

export function InventoryPage() {
  const { inventory, addItem, updateItem, deleteItem } = useData()
  const { canEdit, canViewFinances } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [deleting, setDeleting] = useState<InventoryItem | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return inventory
    const q = search.toLowerCase()
    return inventory.filter((i) => i.name.toLowerCase().includes(q))
  }, [inventory, search])

  const handleAdd = async (data: Omit<InventoryItem, 'id' | 'docId'>) => {
    await addItem('inventory', data)
    setShowForm(false)
  }

  const handleEdit = async (data: Omit<InventoryItem, 'id' | 'docId'>) => {
    if (!editing) return
    const id = editing.docId || String(editing.id)
    await updateItem('inventory', id, data)
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('inventory', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Склад</h2>
        <p className="text-sm text-gray-500 mt-0.5">Сировина та матеріали</p>
      </div>

      {inventory.length > 0 && (
        <SearchBar value={search} onChange={setSearch} placeholder="Пошук матеріалу..." />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title={inventory.length === 0 ? 'Склад порожній' : 'Нічого не знайдено'}
          message={inventory.length === 0 ? 'Додайте матеріали' : 'Спробуйте інший пошук'}
        />
      ) : (
        <InventoryList
          items={filtered}
          canEdit={canEdit()}
          showPrices={canViewFinances()}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Новий матеріал"
        footer={
          <button type="submit" form="inventory-add-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати
          </button>
        }
      >
        <InventoryForm formId="inventory-add-form" onSubmit={handleAdd} />
      </Sheet>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редагування"
        footer={
          <button type="submit" form="inventory-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && (
          <InventoryForm formId="inventory-edit-form" onSubmit={handleEdit} initial={editing} submitLabel="Зберегти" />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити матеріал?"
        message={`${deleting?.name} буде видалено зі складу.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { InventoryList } from './InventoryList'
import { InventoryForm } from './InventoryForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { InventoryItem } from '@/types'

export function InventoryPage() {
  const { inventory, addItem, updateItem, deleteItem } = useData()
  const { canEdit, canViewFinances } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [deleting, setDeleting] = useState<InventoryItem | null>(null)

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

      {inventory.length === 0 ? (
        <EmptyState title="Склад порожній" message="Додайте матеріали" />
      ) : (
        <InventoryList
          items={inventory}
          canEdit={canEdit()}
          showPrices={canViewFinances()}
          onEdit={setEditing}
          onDelete={setDeleting}
        />
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet open={showForm} onClose={() => setShowForm(false)} title="Новий матеріал">
        <InventoryForm onSubmit={handleAdd} />
      </Sheet>

      <Sheet open={!!editing} onClose={() => setEditing(null)} title="Редагування">
        {editing && (
          <InventoryForm onSubmit={handleEdit} initial={editing} submitLabel="Зберегти" />
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

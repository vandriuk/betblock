import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { ProductCard } from './ProductCard'
import { ProductForm } from './ProductForm'
import { Sheet } from '@/components/shared/Sheet'
import { FAB } from '@/components/shared/FAB'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Product, RecipeItem } from '@/types'

export function ProductsPage() {
  const { products, inventory, addItem, updateItem, deleteItem } = useData()
  const { canEdit } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const handleAdd = async (name: string, price: number, recipe: RecipeItem[], initialStock: number) => {
    await addItem('products', { name, price, recipe, initialStock })
    setShowForm(false)
  }

  const handleEdit = async (name: string, price: number, recipe: RecipeItem[], initialStock: number) => {
    if (!editing) return
    const id = editing.docId || String(editing.id)
    await updateItem('products', id, { name, price, recipe, initialStock })
    setEditing(null)
  }

  const handleDelete = async () => {
    if (!deleting) return
    const id = deleting.docId || String(deleting.id)
    await deleteItem('products', id)
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Продукція</h2>
        <p className="text-sm text-gray-500 mt-0.5">Типи блоків, ціни та рецептура</p>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Немає продукції" message="Додайте перший тип блоку" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {products.map((p) => (
            <ProductCard
              key={p.docId || p.id}
              product={p}
              canEdit={canEdit()}
              onEdit={() => setEditing(p)}
              onDelete={() => setDeleting(p)}
            />
          ))}
        </div>
      )}

      {canEdit() && <FAB onClick={() => setShowForm(true)} />}

      <Sheet
        open={showForm}
        onClose={() => setShowForm(false)}
        title="Нова продукція"
        footer={
          <button type="submit" form="product-add-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Додати
          </button>
        }
      >
        <ProductForm formId="product-add-form" onSubmit={handleAdd} inventory={inventory} />
      </Sheet>

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Редагування"
        footer={
          <button type="submit" form="product-edit-form" className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all">
            Зберегти
          </button>
        }
      >
        {editing && (
          <ProductForm
            formId="product-edit-form"
            onSubmit={handleEdit}
            initial={{ name: editing.name, price: editing.price, recipe: editing.recipe, initialStock: editing.initialStock }}
            submitLabel="Зберегти"
            inventory={inventory}
          />
        )}
      </Sheet>

      <ConfirmDialog
        open={!!deleting}
        title="Видалити продукцію?"
        message={`${deleting?.name} буде видалено назавжди.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

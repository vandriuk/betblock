import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { toast } from 'sonner'
import { subscribeCollection, addDocument, updateDocument, deleteDocument } from '@/services/firestore'
import { logEvent } from '@/services/firebase'
import { DEFAULT_INVENTORY, DEFAULT_PRODUCTS } from '@/lib/constants'
import { useAuth } from './AuthContext'
import type {
  InventoryItem,
  Product,
  ProductionRecord,
  Order,
  Sale,
  Expense,
  InventoryMovement,
} from '@/types'
import type { DocumentData } from 'firebase/firestore'

interface DataContextValue {
  inventory: InventoryItem[]
  products: Product[]
  production: ProductionRecord[]
  orders: Order[]
  sales: Sale[]
  expenses: Expense[]
  movements: InventoryMovement[]
  loading: boolean
  addItem: (collection: string, data: DocumentData) => Promise<string>
  updateItem: (collection: string, docId: string, data: Partial<DocumentData>) => Promise<void>
  deleteItem: (collection: string, docId: string) => Promise<void>
  // Enhanced methods
  addProductionWithDeduction: (data: Omit<ProductionRecord, 'id' | 'docId'>) => Promise<{ success: boolean; error?: string }>
  createSaleFromOrder: (order: Order, userEmail: string) => Promise<void>
  undoDelete: () => Promise<void>
  lastDeleted: { collection: string; data: DocumentData } | null
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [production, setProduction] = useState<ProductionRecord[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [lastDeleted, setLastDeleted] = useState<{ collection: string; data: DocumentData } | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    let loaded = 0
    const total = 7
    const checkDone = () => {
      loaded++
      if (loaded >= total) setLoading(false)
    }

    const unsubs = [
      subscribeCollection<InventoryItem>('inventory', (items) => {
        setInventory(items.length > 0 ? items : (DEFAULT_INVENTORY as InventoryItem[]))
        checkDone()
      }),
      subscribeCollection<Product>('products', (items) => {
        setProducts(items.length > 0 ? items : (DEFAULT_PRODUCTS as Product[]))
        checkDone()
      }),
      subscribeCollection<ProductionRecord>('production', (items) => {
        setProduction(items)
        checkDone()
      }, 'date'),
      subscribeCollection<Order>('orders', (items) => {
        setOrders(items)
        checkDone()
      }, 'date'),
      subscribeCollection<Sale>('sales', (items) => {
        setSales(items)
        checkDone()
      }, 'date'),
      subscribeCollection<Expense>('expenses', (items) => {
        setExpenses(items)
        checkDone()
      }, 'date'),
      subscribeCollection<InventoryMovement>('movements', (items) => {
        setMovements(items)
        checkDone()
      }, 'date'),
    ]

    return () => unsubs.forEach((unsub) => unsub())
  }, [user])

  const addItem = useCallback(async (col: string, data: DocumentData) => {
    try {
      const id = await addDocument(col, data)
      logEvent('create_record', { collection: col })
      toast.success('Додано')
      return id
    } catch (e) {
      toast.error('Помилка при додаванні')
      throw e
    }
  }, [])

  const updateItem = useCallback(async (col: string, docId: string, data: Partial<DocumentData>) => {
    try {
      await updateDocument(col, docId, data)
      toast.success('Оновлено')
    } catch (e) {
      toast.error('Помилка при оновленні')
      throw e
    }
  }, [])

  const deleteItem = useCallback(async (col: string, docId: string) => {
    try {
      // Find the item data before deleting (for undo)
      let itemData: DocumentData | null = null
      const collections: Record<string, DocumentData[]> = {
        inventory, products, production, orders, sales, expenses, movements,
      }
      const items = collections[col]
      if (items) {
        const found = items.find((item: any) =>
          item.docId === docId || String(item.id) === docId
        )
        if (found) {
          const { docId: _d, id: _i, ...rest } = found as any
          itemData = rest
        }
      }

      await deleteDocument(col, docId)
      logEvent('delete_record', { collection: col })

      if (itemData) {
        setLastDeleted({ collection: col, data: itemData })
        toast.success('Видалено', {
          action: {
            label: 'Скасувати',
            onClick: () => {
              // Will be handled by undoDelete
              addDocument(col, itemData!).then(() => {
                toast.success('Відновлено')
                setLastDeleted(null)
                window.dispatchEvent(new CustomEvent('demo-data-change', { detail: col }))
              })
            },
          },
          duration: 5000,
        })
      } else {
        toast.success('Видалено')
      }
    } catch (e) {
      toast.error('Помилка при видаленні')
      throw e
    }
  }, [inventory, products, production, orders, sales, expenses, movements])

  const undoDelete = useCallback(async () => {
    if (!lastDeleted) return
    try {
      await addDocument(lastDeleted.collection, lastDeleted.data)
      toast.success('Відновлено')
      setLastDeleted(null)
    } catch (e) {
      toast.error('Помилка при відновленні')
    }
  }, [lastDeleted])

  // Add production record with automatic material deduction
  const addProductionWithDeduction = useCallback(async (
    data: Omit<ProductionRecord, 'id' | 'docId'>
  ): Promise<{ success: boolean; error?: string }> => {
    const product = products.find((p) => p.name === data.productName)
    if (!product) return { success: false, error: 'Продукт не знайдено' }

    const recipe = product.recipe
    if (recipe && recipe.length > 0) {
      // Check if we have enough materials
      const shortages: string[] = []
      for (const ingredient of recipe) {
        const material = inventory.find((inv) => inv.name === ingredient.materialName)
        const needed = ingredient.amountPerBlock * data.blocks
        if (!material) {
          shortages.push(`${ingredient.materialName}: матеріал не знайдено`)
        } else if (material.quantity < needed) {
          shortages.push(`${ingredient.materialName}: потрібно ${needed} ${material.unit}, є ${material.quantity} ${material.unit}`)
        }
      }

      if (shortages.length > 0) {
        return {
          success: false,
          error: `Недостатньо матеріалів:\n${shortages.join('\n')}`,
        }
      }

      // Deduct materials
      for (const ingredient of recipe) {
        const material = inventory.find((inv) => inv.name === ingredient.materialName)
        if (material) {
          const needed = ingredient.amountPerBlock * data.blocks
          const materialId = material.docId || String(material.id)
          await updateDocument('inventory', materialId, {
            quantity: material.quantity - needed,
          })

          // Log movement
          await addDocument('movements', {
            date: data.date,
            materialName: ingredient.materialName,
            type: 'production',
            quantity: -needed,
            reason: `Виробництво ${data.blocks} шт ${data.productName}`,
            createdBy: data.createdBy,
          })
        }
      }
    }

    // Add production record
    await addDocument('production', data)
    logEvent('create_record', { collection: 'production' })
    toast.success('Виробництво додано, матеріали списано')
    return { success: true }
  }, [products, inventory])

  // Create sale from order
  const createSaleFromOrder = useCallback(async (order: Order, userEmail: string) => {
    const product = products.find((p) => p.name === order.productName)
    const price = product?.price || 0

    const saleData = {
      date: new Date().toISOString().split('T')[0],
      customer: order.customer,
      productName: order.productName,
      blocks: order.quantity,
      pallets: 0,
      price,
      paid: false,
      createdBy: userEmail,
      orderId: order.docId || String(order.id),
    }

    const saleId = await addDocument('sales', saleData)

    // Update order status and link
    const orderId = order.docId || String(order.id)
    await updateDocument('orders', orderId, {
      status: 'Виконано',
      saleId,
    })

    logEvent('create_record', { collection: 'sales' })
    toast.success('Продаж створено з замовлення')
  }, [products])

  return (
    <DataContext.Provider
      value={{
        inventory,
        products,
        production,
        orders,
        sales,
        expenses,
        movements,
        loading,
        addItem,
        updateItem,
        deleteItem,
        addProductionWithDeduction,
        createSaleFromOrder,
        undoDelete,
        lastDeleted,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

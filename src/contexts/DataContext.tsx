import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { subscribeCollection, addDocument, updateDocument, deleteDocument } from '@/services/firestore'
import { DEFAULT_INVENTORY, DEFAULT_PRODUCTS } from '@/lib/constants'
import { useAuth } from './AuthContext'
import type {
  InventoryItem,
  Product,
  ProductionRecord,
  Order,
  Sale,
  Expense,
} from '@/types'
import type { DocumentData } from 'firebase/firestore'

interface DataContextValue {
  inventory: InventoryItem[]
  products: Product[]
  production: ProductionRecord[]
  orders: Order[]
  sales: Sale[]
  expenses: Expense[]
  loading: boolean
  addItem: (collection: string, data: DocumentData) => Promise<string>
  updateItem: (collection: string, docId: string, data: Partial<DocumentData>) => Promise<void>
  deleteItem: (collection: string, docId: string) => Promise<void>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    let loaded = 0
    const total = 6
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
    ]

    return () => unsubs.forEach((unsub) => unsub())
  }, [user])

  const addItem = (col: string, data: DocumentData) => addDocument(col, data)
  const updateItem = (col: string, docId: string, data: Partial<DocumentData>) =>
    updateDocument(col, docId, data)
  const deleteItem = (col: string, docId: string) => deleteDocument(col, docId)

  return (
    <DataContext.Provider
      value={{
        inventory,
        products,
        production,
        orders,
        sales,
        expenses,
        loading,
        addItem,
        updateItem,
        deleteItem,
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

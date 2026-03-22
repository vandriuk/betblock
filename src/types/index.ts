// === User & Auth ===

export type UserRole = 'admin' | 'manager' | 'worker'

export interface AppUser {
  uid: string
  email: string
  role: UserRole
}

// === Inventory ===

export interface InventoryItem {
  id?: number
  docId?: string
  name: string
  unit: string
  quantity: number
  minQuantity: number
  price: number
  notes: string
}

// === Products ===

export interface Product {
  id?: number
  docId?: string
  name: string
  price: number
}

// === Production ===

export type Shift = 'Денна' | 'Нічна'

export interface ProductionRecord {
  id?: number
  docId?: string
  date: string
  shift: Shift
  productName: string
  blocks: number
  createdBy: string
}

// === Orders ===

export type OrderStatus = 'Нове' | 'В роботі' | 'Готово' | 'Виконано'

export interface Order {
  id?: number
  docId?: string
  date: string
  customer: string
  productName: string
  quantity: number
  status: OrderStatus
  notes: string
  createdBy: string
}

// === Sales ===

export interface Sale {
  id?: number
  docId?: string
  date: string
  customer: string
  productName: string
  blocks: number
  pallets: number
  price: number
  paid: boolean
  createdBy: string
}

// === Expenses ===

export type ExpenseCategory =
  | 'Сировина'
  | 'Зарплата'
  | 'Електроенергія'
  | 'Обладнання'
  | 'Транспорт'
  | 'Оренда'
  | 'Інше'

export interface Expense {
  id?: number
  docId?: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number
  createdBy: string
}

// === Stats ===

export interface ProductStats {
  name: string
  produced: number
  sold: number
  inStock: number
  inOrders: number
}

export interface FinancialStats {
  totalRevenue: number
  totalExpenses: number
  profit: number
}

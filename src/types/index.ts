// === User & Auth ===

export type UserRole = 'admin' | 'manager' | 'worker'

export interface AppUser {
  uid: string
  email: string
  role: UserRole
}

export interface UserRecord {
  uid: string
  docId?: string
  email: string
  role: UserRole
  createdAt?: string
}

// === Customers ===

export interface Customer {
  id?: number
  docId?: string
  name: string
  phone: string
  notes: string
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

export interface RecipeItem {
  materialName: string // references InventoryItem.name
  amountPerBlock: number // how much material per 1 block
}

export interface Product {
  id?: number
  docId?: string
  name: string
  price: number
  recipe?: RecipeItem[] // recipe for auto-deduction
}

// === Inventory Movement Log ===

export type MovementType = 'income' | 'expense' | 'production' | 'adjustment'

export interface InventoryMovement {
  id?: number
  docId?: string
  date: string
  materialName: string
  type: MovementType
  quantity: number // positive = income, negative = expense
  reason: string
  createdBy: string
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
  saleId?: string // linked sale (when converted to sale)
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
  orderId?: string // linked order (when created from order)
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
  // Only for category "Сировина" — auto-income to inventory
  materialName?: string
  materialQuantity?: number // in the material's unit (kg, t, etc.)
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
  unpaidDebt: number // total unpaid sales amount
  profitByProduct: { name: string; revenue: number }[]
}

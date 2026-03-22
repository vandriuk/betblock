import type { ExpenseCategory, OrderStatus, Shift, InventoryItem, Product } from '@/types'

export const SHIFTS: Shift[] = ['Денна', 'Нічна']

export const ORDER_STATUSES: OrderStatus[] = ['Нове', 'В роботі', 'Готово', 'Виконано']

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Сировина',
  'Зарплата',
  'Електроенергія',
  'Обладнання',
  'Транспорт',
  'Оренда',
  'Інше',
]

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  'Нове': 'bg-blue-100 text-blue-800',
  'В роботі': 'bg-yellow-100 text-yellow-800',
  'Готово': 'bg-green-100 text-green-800',
  'Виконано': 'bg-gray-100 text-gray-600',
}

export const DEFAULT_INVENTORY: Omit<InventoryItem, 'docId'>[] = [
  { id: 1, name: 'Цемент', unit: 'кг', quantity: 0, minQuantity: 500, price: 5, notes: '' },
  { id: 2, name: 'Пісок', unit: 'кг', quantity: 0, minQuantity: 1000, price: 1, notes: '' },
  { id: 3, name: 'Щебінь', unit: 'кг', quantity: 0, minQuantity: 1000, price: 1.5, notes: '' },
]

export const DEFAULT_PRODUCTS: Omit<Product, 'docId'>[] = [
  { id: 1, name: 'Шлакоблок', price: 25 },
  { id: 2, name: 'Бетоноблок', price: 30 },
]

import * as XLSX from 'xlsx'
import type { InventoryItem, Product, ProductionRecord, Order, Sale, Expense } from '@/types'

interface ExportData {
  inventory: InventoryItem[]
  products: Product[]
  production: ProductionRecord[]
  orders: Order[]
  sales: Sale[]
  expenses: Expense[]
}

export function useExport() {
  const exportToExcel = (data: ExportData, includeFinances: boolean) => {
    const wb = XLSX.utils.book_new()

    // Склад
    const invData = data.inventory.map((i) => ({
      'Назва': i.name,
      'Кількість': i.quantity,
      'Одиниця': i.unit,
      'Мін. запас': i.minQuantity,
      'Ціна': i.price,
      'Примітки': i.notes,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invData), 'Склад')

    // Продукція
    const prodData = data.products.map((p) => ({
      'Назва': p.name,
      'Ціна': p.price,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prodData), 'Продукція')

    // Виробництво
    const prodListData = data.production.map((p) => ({
      'Дата': p.date,
      'Зміна': p.shift,
      'Продукція': p.productName,
      'Кількість': p.blocks,
      'Створив': p.createdBy,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prodListData), 'Виробництво')

    // Замовлення
    const ordData = data.orders.map((o) => ({
      'Дата': o.date,
      'Замовник': o.customer,
      'Продукція': o.productName,
      'Кількість': o.quantity,
      'Статус': o.status,
      'Примітки': o.notes,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordData), 'Замовлення')

    if (includeFinances) {
      // Продажі
      const salesData = data.sales.map((s) => ({
        'Дата': s.date,
        'Покупець': s.customer,
        'Продукція': s.productName,
        'Кількість': s.blocks,
        'Піддонів': s.pallets,
        'Ціна': s.price,
        'Сума': s.blocks * s.price,
        'Оплачено': s.paid ? 'Так' : 'Ні',
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(salesData), 'Продажі')

      // Витрати
      const expData = data.expenses.map((e) => ({
        'Дата': e.date,
        'Категорія': e.category,
        'Опис': e.description,
        'Сума': e.amount,
      }))
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expData), 'Витрати')
    }

    const date = new Date().toISOString().split('T')[0]
    XLSX.writeFile(wb, `backup_${date}.xlsx`)
  }

  const exportToJSON = (data: ExportData) => {
    const backup = {
      timestamp: new Date().toISOString(),
      ...data,
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return { exportToExcel, exportToJSON }
}

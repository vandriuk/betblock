import type { Product, ProductionRecord, Sale, Order, Expense, ProductStats, FinancialStats } from '@/types'

export function calculateProductStats(
  products: Product[],
  production: ProductionRecord[],
  sales: Sale[],
  orders: Order[]
): ProductStats[] {
  return products.map((product) => {
    const produced = production
      .filter((p) => p.productName === product.name)
      .reduce((sum, p) => sum + p.blocks, 0)

    const sold = sales
      .filter((s) => s.productName === product.name)
      .reduce((sum, s) => sum + s.blocks, 0)

    const inOrders = orders
      .filter((o) => o.productName === product.name && o.status !== 'Виконано')
      .reduce((sum, o) => sum + o.quantity, 0)

    return {
      name: product.name,
      produced,
      sold,
      inStock: produced - sold,
      inOrders,
    }
  })
}

export function calculateFinancialStats(
  sales: Sale[],
  expenses: Expense[]
): FinancialStats {
  const totalRevenue = sales
    .filter((s) => s.paid)
    .reduce((sum, s) => sum + s.blocks * s.price, 0)

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Unpaid debt — total amount from unpaid sales
  const unpaidDebt = sales
    .filter((s) => !s.paid)
    .reduce((sum, s) => sum + s.blocks * s.price, 0)

  // Revenue breakdown by product
  const revenueMap = new Map<string, number>()
  for (const s of sales.filter((s) => s.paid)) {
    const current = revenueMap.get(s.productName) || 0
    revenueMap.set(s.productName, current + s.blocks * s.price)
  }
  const profitByProduct = Array.from(revenueMap.entries())
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)

  return {
    totalRevenue,
    totalExpenses,
    profit: totalRevenue - totalExpenses,
    unpaidDebt,
    profitByProduct,
  }
}

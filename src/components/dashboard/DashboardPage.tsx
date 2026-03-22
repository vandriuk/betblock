import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { StatsCards } from './StatsCards'
import { InventoryAlerts } from './InventoryAlerts'
import { FinanceSummary } from './FinanceSummary'
import { ProductionChart } from './ProductionChart'
import { calculateProductStats, calculateFinancialStats } from '@/lib/stats'

export function DashboardPage() {
  const { products, production, sales, orders, expenses, inventory } = useData()
  const { canViewFinances } = useAuth()

  const productStats = calculateProductStats(products, production, sales, orders)
  const financialStats = calculateFinancialStats(sales, expenses)
  const lowStock = inventory.filter((item) => item.quantity < item.minQuantity)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Дашборд</h2>
        <p className="text-sm text-gray-500 mt-0.5">Огляд виробництва</p>
      </div>

      <StatsCards stats={productStats} />

      {lowStock.length > 0 && <InventoryAlerts items={lowStock} />}

      <ProductionChart production={production} />

      {canViewFinances() && <FinanceSummary stats={financialStats} />}
    </div>
  )
}

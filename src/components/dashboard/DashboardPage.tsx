import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { StatsCards } from './StatsCards'
import { InventoryAlerts } from './InventoryAlerts'
import { FinanceSummary } from './FinanceSummary'
import { ProductionChart } from './ProductionChart'
import { calculateProductStats, calculateFinancialStats } from '@/lib/stats'
import { Package, Factory, ClipboardList, ShoppingCart } from 'lucide-react'

export function DashboardPage() {
  const { products, production, sales, orders, expenses, inventory } = useData()
  const { canViewFinances } = useAuth()

  const productStats = calculateProductStats(products, production, sales, orders)
  const financialStats = calculateFinancialStats(sales, expenses)
  const lowStock = inventory.filter((item) => item.quantity < item.minQuantity)

  const counters = [
    { label: 'Матеріалів', value: inventory.length, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Виробництво', value: production.length, icon: Factory, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Замовлень', value: orders.length, icon: ClipboardList, color: 'text-accent-500', bg: 'bg-accent-50' },
    { label: 'Продажів', value: sales.length, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Дашборд</h2>
        <p className="text-sm text-gray-500 mt-0.5">Огляд виробництва</p>
      </div>

      {/* Quick counters */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counters.map((c) => {
          const Icon = c.icon
          return (
            <div key={c.label} className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-tight">{c.value}</p>
                <p className="text-xs text-gray-500 font-medium">{c.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <StatsCards stats={productStats} />

      {lowStock.length > 0 && <InventoryAlerts items={lowStock} />}

      <ProductionChart production={production} />

      {canViewFinances() && <FinanceSummary stats={financialStats} />}
    </div>
  )
}

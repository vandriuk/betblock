import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { FinancialStats } from '@/types'

interface FinanceSummaryProps {
  stats: FinancialStats
}

export function FinanceSummary({ stats }: FinanceSummaryProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Фінанси</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FinanceCard icon={TrendingUp} label="Дохід" value={stats.totalRevenue} color="text-green-600" bg="bg-green-50" border="border-green-200" />
        <FinanceCard icon={TrendingDown} label="Витрати" value={stats.totalExpenses} color="text-red-600" bg="bg-red-50" border="border-red-200" />
        <FinanceCard
          icon={DollarSign} label="Прибуток" value={stats.profit}
          color={stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}
          bg={stats.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}
          border={stats.profit >= 0 ? 'border-green-200' : 'border-red-200'}
        />
        {stats.unpaidDebt > 0 && (
          <FinanceCard icon={AlertCircle} label="Борги клієнтів" value={stats.unpaidDebt} color="text-orange-600" bg="bg-orange-50" border="border-orange-200" />
        )}
      </div>

      {stats.profitByProduct.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Дохід по продукції</h4>
          <div className="space-y-2">
            {stats.profitByProduct.map((item) => {
              const maxRevenue = stats.profitByProduct[0]?.revenue || 1
              const percent = Math.round((item.revenue / maxRevenue) * 100)
              return (
                <div key={item.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary-500 rounded-full h-2" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function FinanceCard({ icon: Icon, label, value, color, bg, border }: { icon: typeof DollarSign; label: string; value: number; color: string; bg: string; border: string }) {
  return (
    <div className={`${bg} ${border} border rounded-xl p-4 flex items-center gap-3`}>
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{formatCurrency(value)}</p>
      </div>
    </div>
  )
}

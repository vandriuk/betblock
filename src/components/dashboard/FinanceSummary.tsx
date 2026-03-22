import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { FinancialStats } from '@/types'

interface FinanceSummaryProps {
  stats: FinancialStats
}

export function FinanceSummary({ stats }: FinanceSummaryProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Фінанси</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FinanceCard
          icon={TrendingUp}
          label="Дохід"
          value={stats.totalRevenue}
          color="text-green-600"
          bg="bg-green-50"
          border="border-green-200"
        />
        <FinanceCard
          icon={TrendingDown}
          label="Витрати"
          value={stats.totalExpenses}
          color="text-red-600"
          bg="bg-red-50"
          border="border-red-200"
        />
        <FinanceCard
          icon={DollarSign}
          label="Прибуток"
          value={stats.profit}
          color={stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}
          bg={stats.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}
          border={stats.profit >= 0 ? 'border-green-200' : 'border-red-200'}
        />
      </div>
    </div>
  )
}

function FinanceCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  border,
}: {
  icon: typeof DollarSign
  label: string
  value: number
  color: string
  bg: string
  border: string
}) {
  return (
    <div className={`${bg} ${border} border rounded-xl p-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{formatCurrency(value)}</p>
      </div>
    </div>
  )
}

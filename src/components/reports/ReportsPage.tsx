import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Factory } from 'lucide-react'

type PeriodType = '6months' | '12months' | 'year'

function getMonthsRange(period: PeriodType): { label: string; from: string; to: string }[] {
  const now = new Date()
  const months: { label: string; from: string; to: string }[] = []

  const count = period === '6months' ? 6 : period === '12months' ? 12 : (() => {
    return now.getMonth() + 1
  })()

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`
    const label = d.toLocaleDateString('uk-UA', { month: 'short' })
    months.push({ label, from, to })
  }
  return months
}

export function ReportsPage() {
  const { sales, expenses, production } = useData()
  const [period, setPeriod] = useState<PeriodType>('6months')

  const months = useMemo(() => getMonthsRange(period), [period])

  const data = useMemo(() => {
    return months.map(({ label, from, to }) => {
      const monthSales = sales.filter((s) => {
        const d = s.date.split('T')[0]
        return d >= from && d <= to
      })
      const monthExpenses = expenses.filter((e) => {
        const d = e.date.split('T')[0]
        return d >= from && d <= to
      })
      const monthProduction = production.filter((p) => {
        const d = p.date.split('T')[0]
        return d >= from && d <= to
      })

      const revenue = monthSales.filter((s) => s.paid).reduce((sum, s) => sum + s.blocks * s.price, 0)
      const expenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
      const blocks = monthProduction.reduce((sum, p) => sum + p.blocks, 0)
      const salesCount = monthSales.length
      const unpaid = monthSales.filter((s) => !s.paid).reduce((sum, s) => sum + s.blocks * s.price, 0)

      return {
        label,
        revenue,
        expenses: expenseTotal,
        profit: revenue - expenseTotal,
        blocks,
        salesCount,
        unpaid,
      }
    })
  }, [months, sales, expenses, production])

  const totals = useMemo(() => ({
    revenue: data.reduce((s, d) => s + d.revenue, 0),
    expenses: data.reduce((s, d) => s + d.expenses, 0),
    profit: data.reduce((s, d) => s + d.profit, 0),
    blocks: data.reduce((s, d) => s + d.blocks, 0),
  }), [data])

  const PERIODS: { id: PeriodType; label: string }[] = [
    { id: '6months', label: '6 міс' },
    { id: '12months', label: '12 міс' },
    { id: 'year', label: 'Цей рік' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Звіти</h2>
        <p className="text-sm text-gray-500 mt-0.5">Фінанси та виробництво по місяцях</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              period === p.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon={TrendingUp} label="Дохід" value={formatCurrency(totals.revenue)} color="text-green-600" bg="bg-green-50" />
        <SummaryCard icon={TrendingDown} label="Витрати" value={formatCurrency(totals.expenses)} color="text-red-600" bg="bg-red-50" />
        <SummaryCard
          icon={DollarSign}
          label="Прибуток"
          value={formatCurrency(totals.profit)}
          color={totals.profit >= 0 ? 'text-green-600' : 'text-red-600'}
          bg={totals.profit >= 0 ? 'bg-green-50' : 'bg-red-50'}
        />
        <SummaryCard icon={Factory} label="Вироблено" value={`${totals.blocks.toLocaleString('uk-UA')} шт`} color="text-blue-600" bg="bg-blue-50" />
      </div>

      {/* Finance chart */}
      {data.some((d) => d.revenue > 0 || d.expenses > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Дохід / Витрати</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} width={50} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [formatCurrency(Number(value)), name === 'revenue' ? 'Дохід' : 'Витрати']}
              />
              <Legend formatter={(value) => value === 'revenue' ? 'Дохід' : 'Витрати'} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Production chart */}
      {data.some((d) => d.blocks > 0) && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Виробництво</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value} шт`, 'Вироблено']}
              />
              <Bar dataKey="blocks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly breakdown table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 pt-4 pb-2">Деталізація</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Місяць</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-green-600">Дохід</th>
                <th className="text-right px-3 py-2 text-xs font-semibold text-red-600">Витрати</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-700">Прибуток</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.label} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{row.label}</td>
                  <td className="text-right px-3 py-2.5 text-green-600">{formatCurrency(row.revenue)}</td>
                  <td className="text-right px-3 py-2.5 text-red-600">{formatCurrency(row.expenses)}</td>
                  <td className={`text-right px-4 py-2.5 font-bold ${row.profit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(row.profit)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-4 py-2.5 text-gray-900">Всього</td>
                <td className="text-right px-3 py-2.5 text-green-700">{formatCurrency(totals.revenue)}</td>
                <td className="text-right px-3 py-2.5 text-red-700">{formatCurrency(totals.expenses)}</td>
                <td className={`text-right px-4 py-2.5 ${totals.profit >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {formatCurrency(totals.profit)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, color, bg }: {
  icon: typeof TrendingUp; label: string; value: string; color: string; bg: string
}) {
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
}

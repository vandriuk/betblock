import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useAuth } from '@/contexts/AuthContext'
import { formatCurrency } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Factory, Wallet, Pencil } from 'lucide-react'
import { Sheet } from '@/components/shared/Sheet'

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
  const { sales, expenses, production, settings, updateAppSettings } = useData()
  const { canViewFinances } = useAuth()
  const [period, setPeriod] = useState<PeriodType>('6months')
  const [showBalanceForm, setShowBalanceForm] = useState(false)
  const [balanceInput, setBalanceInput] = useState('')

  const initialBalance = (settings.initialBalance as number) || 0

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

  const currentBalance = initialBalance + totals.profit

  const handleSaveBalance = async () => {
    const val = Number(balanceInput)
    if (isNaN(val)) return
    await updateAppSettings({ initialBalance: val })
    setShowBalanceForm(false)
  }

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

      {/* Initial balance card */}
      {canViewFinances() && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Початковий баланс</p>
                <p className="text-lg font-bold text-primary-700">{formatCurrency(initialBalance)}</p>
              </div>
            </div>
            <button
              onClick={() => { setBalanceInput(String(initialBalance)); setShowBalanceForm(true) }}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-primary-500 active:bg-primary-100"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-200/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Поточний баланс</span>
              <span className={`text-lg font-bold ${currentBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(currentBalance)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">= початковий {formatCurrency(initialBalance)} + прибуток {formatCurrency(totals.profit)}</p>
          </div>
        </div>
      )}

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
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} width={50} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
                formatter={(value, name) => [formatCurrency(Number(value)), name === 'revenue' ? 'Дохід' : 'Витрати']}
              />
              <Legend formatter={(value) => value === 'revenue' ? 'Дохід' : 'Витрати'} wrapperStyle={{ fontSize: '13px' }} />
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
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} width={50} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
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
          <table className="w-full text-sm md:text-base">
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

      {/* Balance edit sheet */}
      <Sheet
        open={showBalanceForm}
        onClose={() => setShowBalanceForm(false)}
        title="Початковий баланс"
        footer={
          <button
            onClick={handleSaveBalance}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold active:scale-[0.98] transition-all"
          >
            Зберегти
          </button>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Вкажіть суму коштів на момент початку використання системи. Ця сума буде додана до розрахунку поточного балансу.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Сума (₴)</label>
            <input
              type="number"
              inputMode="decimal"
              value={balanceInput}
              onChange={(e) => setBalanceInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="0"
              autoFocus
            />
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
            <p>Поточний баланс буде:</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
              {formatCurrency((Number(balanceInput) || 0) + totals.profit)}
            </p>
            <p className="text-xs text-gray-400 mt-1">= {formatCurrency(Number(balanceInput) || 0)} + прибуток {formatCurrency(totals.profit)}</p>
          </div>
        </div>
      </Sheet>
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

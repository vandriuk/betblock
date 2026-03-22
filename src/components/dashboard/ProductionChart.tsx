import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ProductionRecord } from '@/types'

interface ProductionChartProps {
  production: ProductionRecord[]
}

export function ProductionChart({ production }: ProductionChartProps) {
  // Last 7 days production
  const days = 7
  const today = new Date()
  const data: { date: string; blocks: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    const label = `${d.getDate()}.${d.getMonth() + 1}`
    const blocks = production
      .filter((p) => p.date === iso)
      .reduce((sum, p) => sum + p.blocks, 0)
    data.push({ date: label, blocks })
  }

  const hasData = data.some((d) => d.blocks > 0)
  if (!hasData) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        Виробництво за 7 днів
      </h3>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value) => [`${value} шт`, 'Вироблено']}
            />
            <Bar dataKey="blocks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

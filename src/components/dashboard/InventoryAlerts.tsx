import { AlertTriangle } from 'lucide-react'
import type { InventoryItem } from '@/types'

interface InventoryAlertsProps {
  items: InventoryItem[]
}

export function InventoryAlerts({ items }: InventoryAlertsProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h3 className="text-sm font-semibold text-red-700">Низький запас на складі</h3>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.docId || item.id} className="flex items-center justify-between text-sm">
            <span className="text-red-800 font-medium">{item.name}</span>
            <span className="text-red-600">
              {item.quantity} / {item.minQuantity} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

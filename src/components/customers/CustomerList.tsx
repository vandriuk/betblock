import { Trash2, Phone } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Customer, Order, Sale } from '@/types'

interface CustomerListProps {
  customers: Customer[]
  orders: Order[]
  sales: Sale[]
  onEdit: (customer: Customer) => void
  onDelete: (customer: Customer) => void
}

export function CustomerList({ customers, orders, sales, onEdit, onDelete }: CustomerListProps) {
  return (
    <div className="space-y-2">
      {customers.map((customer) => {
        const customerOrders = orders.filter((o) => o.customer === customer.name)
        const customerSales = sales.filter((s) => s.customer === customer.name)
        const totalRevenue = customerSales.reduce((sum, s) => sum + s.blocks * s.price, 0)
        const unpaid = customerSales.filter((s) => !s.paid).reduce((sum, s) => sum + s.blocks * s.price, 0)
        const activeOrders = customerOrders.filter((o) => o.status !== 'Виконано').length

        return (
          <div
            key={customer.docId || customer.id}
            className="bg-white border border-gray-200 rounded-xl p-4"
            onClick={() => onEdit(customer)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{customer.name}</span>
                  {activeOrders > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {activeOrders} замовл.
                    </span>
                  )}
                  {unpaid > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Борг {formatCurrency(unpaid)}
                    </span>
                  )}
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <a
                      href={`tel:${customer.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary-600 active:text-primary-800"
                    >
                      {customer.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{customerSales.length} продажів</span>
                  {totalRevenue > 0 && (
                    <span className="font-medium text-gray-700">{formatCurrency(totalRevenue)}</span>
                  )}
                </div>
                {customer.notes && (
                  <p className="text-xs text-gray-400 mt-1">{customer.notes}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(customer) }}
                className="w-12 h-12 flex items-center justify-center rounded-xl text-gray-400 active:text-red-500 active:bg-red-50 shrink-0"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

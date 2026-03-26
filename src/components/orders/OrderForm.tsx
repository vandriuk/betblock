import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { CustomerSelect } from '@/components/shared/CustomerSelect'
import type { Order, Product, Customer } from '@/types'

type FormData = Omit<Order, 'id' | 'docId' | 'saleId'>

interface OrderFormProps {
  products: Product[]
  customers: Customer[]
  userEmail: string
  formId?: string
  initial?: Partial<FormData>
  onSubmit: (data: FormData) => void
}

export function OrderForm({ products, customers, userEmail, formId, initial, onSubmit }: OrderFormProps) {
  const [date, setDate] = useState(initial?.date || todayISO())
  const [customer, setCustomer] = useState(initial?.customer || '')
  const [productName, setProductName] = useState(initial?.productName || products[0]?.name || '')
  const [quantity, setQuantity] = useState(initial?.quantity || 0)
  const [notes, setNotes] = useState(initial?.notes || '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customer.trim() || !productName || quantity <= 0) return
    onSubmit({
      date,
      customer: customer.trim(),
      productName,
      quantity,
      status: initial?.status || 'Нове',
      notes,
      createdBy: initial?.createdBy || userEmail,
    })
    if (!initial) {
      setCustomer('')
      setQuantity(0)
      setNotes('')
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Замовник</label>
        <CustomerSelect customers={customers} value={customer} onChange={setCustomer} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Продукція</label>
          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            required
          >
            {products.map((p) => (
              <option key={p.docId || p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Кількість</label>
          <input
            type="number"
            value={quantity || ''}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="1"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Примітки</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          rows={2}
          placeholder="Необов'язково"
        />
      </div>
      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {initial ? 'Зберегти' : 'Створити замовлення'}
        </button>
      )}
    </form>
  )
}

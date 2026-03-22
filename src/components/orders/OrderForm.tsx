import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import type { Product } from '@/types'

interface OrderFormProps {
  products: Product[]
  userEmail: string
  onSubmit: (data: {
    date: string
    customer: string
    productName: string
    quantity: number
    status: 'Нове'
    notes: string
    createdBy: string
  }) => void
}

export function OrderForm({ products, userEmail, onSubmit }: OrderFormProps) {
  const [date, setDate] = useState(todayISO())
  const [customer, setCustomer] = useState('')
  const [productName, setProductName] = useState(products[0]?.name || '')
  const [quantity, setQuantity] = useState(0)
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customer.trim() || !productName || quantity <= 0) return
    onSubmit({
      date,
      customer: customer.trim(),
      productName,
      quantity,
      status: 'Нове',
      notes,
      createdBy: userEmail,
    })
    setCustomer('')
    setQuantity(0)
    setNotes('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Ім'я або назва"
          required
        />
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
      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        Створити замовлення
      </button>
    </form>
  )
}

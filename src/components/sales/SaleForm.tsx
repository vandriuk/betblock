import { useState, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import type { Product } from '@/types'

interface SaleFormProps {
  products: Product[]
  userEmail: string
  onSubmit: (data: {
    date: string
    customer: string
    productName: string
    blocks: number
    pallets: number
    price: number
    paid: boolean
    createdBy: string
  }) => void
}

export function SaleForm({ products, userEmail, onSubmit }: SaleFormProps) {
  const [date, setDate] = useState(todayISO())
  const [customer, setCustomer] = useState('')
  const [productName, setProductName] = useState(products[0]?.name || '')
  const [blocks, setBlocks] = useState(0)
  const [pallets, setPallets] = useState(0)
  const [price, setPrice] = useState(products[0]?.price || 0)
  const [paid, setPaid] = useState(false)

  const handleProductChange = (name: string) => {
    setProductName(name)
    const p = products.find((pr) => pr.name === name)
    if (p) setPrice(p.price)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customer.trim() || blocks <= 0) return
    onSubmit({
      date,
      customer: customer.trim(),
      productName,
      blocks,
      pallets,
      price,
      paid,
      createdBy: userEmail,
    })
    setCustomer('')
    setBlocks(0)
    setPallets(0)
    setPaid(false)
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Покупець</label>
        <input
          type="text"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Ім'я або назва"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Продукція</label>
        <select
          value={productName}
          onChange={(e) => handleProductChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
          required
        >
          {products.map((p) => (
            <option key={p.docId || p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Кількість</label>
          <input
            type="number"
            value={blocks || ''}
            onChange={(e) => setBlocks(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Піддонів</label>
          <input
            type="number"
            value={pallets || ''}
            onChange={(e) => setPallets(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Ціна (₴)</label>
          <input
            type="number"
            value={price || ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>
      {blocks > 0 && price > 0 && (
        <div className="bg-primary-50 rounded-xl p-3 text-center">
          <span className="text-sm text-primary-600">Сума: </span>
          <span className="text-lg font-bold text-primary-700">{(blocks * price).toLocaleString('uk-UA')} ₴</span>
        </div>
      )}
      <label className="flex items-center gap-3 py-2 cursor-pointer">
        <input
          type="checkbox"
          checked={paid}
          onChange={(e) => setPaid(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-sm font-medium text-gray-700">Оплачено</span>
      </label>
      <button
        type="submit"
        className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        Додати продаж
      </button>
    </form>
  )
}

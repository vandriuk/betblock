import { useState, useMemo, type FormEvent } from 'react'
import { todayISO } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'
import { CustomerSelect } from '@/components/shared/CustomerSelect'
import type { Product, ProductionRecord, Sale, Customer } from '@/types'

type FormData = Omit<Sale, 'id' | 'docId' | 'orderId' | 'saleId'>

interface SaleFormProps {
  products: Product[]
  customers: Customer[]
  userEmail: string
  formId?: string
  production?: ProductionRecord[]
  sales?: Sale[]
  onSubmit: (data: FormData) => void
  initial?: Partial<FormData>
}

export function SaleForm({ products, customers, userEmail, formId, production = [], sales = [], onSubmit, initial }: SaleFormProps) {
  const [date, setDate] = useState(initial?.date || todayISO())
  const [customer, setCustomer] = useState(initial?.customer || '')
  const [productName, setProductName] = useState(initial?.productName || products[0]?.name || '')
  const [blocks, setBlocks] = useState(initial?.blocks || 0)
  const [pallets, setPallets] = useState(initial?.pallets || 0)
  const [price, setPrice] = useState(initial?.price || products[0]?.price || 0)
  const [paid, setPaid] = useState(initial?.paid ?? false)

  // Calculate stock for selected product
  const stock = useMemo(() => {
    const produced = production
      .filter((p) => p.productName === productName)
      .reduce((sum, p) => sum + p.blocks, 0)
    const sold = sales
      .filter((s) => s.productName === productName)
      .reduce((sum, s) => sum + s.blocks, 0)
    return produced - sold
  }, [production, sales, productName])

  const overStock = blocks > 0 && blocks > stock

  const handleProductChange = (name: string) => {
    setProductName(name)
    const p = products.find((pr) => pr.name === name)
    if (p) setPrice(p.price)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!customer.trim() || blocks <= 0 || price <= 0) return
    onSubmit({
      date,
      customer: customer.trim(),
      productName,
      blocks,
      pallets,
      price,
      paid,
      createdBy: initial?.createdBy || userEmail,
    })
    if (!initial) {
      setCustomer('')
      setBlocks(0)
      setPallets(0)
      setPaid(false)
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Покупець</label>
        <CustomerSelect customers={customers} value={customer} onChange={setCustomer} placeholder="Ім'я або назва" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Продукція
          {stock > 0 && <span className="text-xs text-gray-400 ml-2">на складі: {stock} шт</span>}
        </label>
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
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none ${
              overStock ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
            }`}
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
            min="0.01"
            step="0.01"
            required
          />
        </div>
      </div>

      {overStock && (
        <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Кількість ({blocks}) перевищує залишок ({stock}). Продаж все ще можливий, але перевірте дані.</span>
        </div>
      )}

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
      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {initial ? 'Зберегти' : 'Додати продаж'}
        </button>
      )}
    </form>
  )
}

import { useState, type FormEvent } from 'react'
import type { Customer } from '@/types'

type FormData = Omit<Customer, 'id' | 'docId'>

interface CustomerFormProps {
  formId?: string
  initial?: Partial<FormData>
  onSubmit: (data: FormData) => void
}

export function CustomerForm({ formId, initial, onSubmit }: CustomerFormProps) {
  const [name, setName] = useState(initial?.name || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [notes, setNotes] = useState(initial?.notes || '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), phone: phone.trim(), notes: notes.trim() })
    if (!initial) {
      setName('')
      setPhone('')
      setNotes('')
    }
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Ім'я / Назва</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="Іван Петренко"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
        <input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          placeholder="+380..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Примітки</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          rows={2}
          placeholder="Необов'язково"
        />
      </div>
      {!formId && (
        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all"
        >
          {initial ? 'Зберегти' : 'Додати клієнта'}
        </button>
      )}
    </form>
  )
}

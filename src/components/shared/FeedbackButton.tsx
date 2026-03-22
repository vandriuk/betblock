import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { toast } from 'sonner'
import { addDocument } from '@/services/firestore'
import { logEvent } from '@/services/firebase'
import { Sheet } from './Sheet'

interface FeedbackButtonProps {
  userEmail: string
}

export function FeedbackButton({ userEmail }: FeedbackButtonProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setSending(true)
    try {
      await addDocument('feedback', {
        text: text.trim(),
        userEmail,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
      logEvent('feedback_sent')
      toast.success('Дякуємо за відгук!')
      setText('')
      setOpen(false)
    } catch {
      toast.error('Не вдалося надіслати')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        title="Повідомити проблему"
      >
        <MessageSquarePlus className="w-5 h-5" />
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Зворотній зв'язок">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Опишіть проблему або пропозицію..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={5}
            required
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {sending ? 'Надсилання...' : 'Надіслати'}
          </button>
        </form>
      </Sheet>
    </>
  )
}

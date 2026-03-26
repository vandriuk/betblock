import { useState } from 'react'
import { MessageSquarePlus } from 'lucide-react'
import { toast } from 'sonner'
import { addDocument } from '@/services/firestore'
import { logEvent } from '@/services/firebase'
import { Sheet } from './Sheet'

interface FeedbackButtonProps {
  userEmail: string
  onDone?: () => void
}

export function FeedbackButton({ userEmail, onDone }: FeedbackButtonProps) {
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
      onDone?.()
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
        className="w-full flex items-center gap-3 px-4 h-12 text-sm text-gray-700 active:bg-gray-50"
        title="Повідомити проблему"
      >
        <MessageSquarePlus className="w-5 h-5 text-gray-400" />
        Зворотній зв'язок
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Зворотній зв'язок"
        footer={
          <button
            type="submit"
            form="feedback-form"
            disabled={sending || !text.trim()}
            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold active:bg-primary-700 disabled:opacity-50"
          >
            {sending ? 'Надсилання...' : 'Надіслати'}
          </button>
        }
      >
        <form id="feedback-form" onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Опишіть проблему або пропозицію..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={5}
            required
          />
        </form>
      </Sheet>
    </>
  )
}

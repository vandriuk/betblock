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
        className="flex items-center gap-2 h-11 px-3.5 rounded-xl text-sm font-medium text-gray-600 hover:text-blue-700 hover:bg-blue-50 active:scale-[0.97] transition-all"
        title="Повідомити проблему"
      >
        <MessageSquarePlus className="w-4.5 h-4.5" />
        <span className="hidden sm:inline">Відгук</span>
      </button>

      <Sheet open={open} onClose={() => setOpen(false)} title="Зворотній зв'язок">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Опишіть проблему або пропозицію..."
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={5}
            required
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-semibold hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {sending ? 'Надсилання...' : 'Надіслати'}
          </button>
        </form>
      </Sheet>
    </>
  )
}

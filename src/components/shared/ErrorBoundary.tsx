import { Component, type ReactNode } from 'react'
import { addDocument } from '@/services/firestore'
import { DEMO_MODE } from '@/services/firebase'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (!DEMO_MODE) {
      addDocument('errors', {
        message: error.message,
        stack: error.stack?.slice(0, 500) || '',
        componentStack: info.componentStack?.slice(0, 500) || '',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }).catch(() => {})
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-gray-900">Щось пішло не так</h2>
            <p className="text-sm text-gray-500">
              {this.state.error?.message || 'Невідома помилка'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Перезавантажити
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

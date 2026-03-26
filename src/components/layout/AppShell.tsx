import { useState, useCallback } from 'react'
import { Header } from './Header'
import { BottomNav, type TabId } from './BottomNav'
import { Sidebar } from './Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { PullToRefreshIndicator } from '@/components/shared/PullToRefresh'

interface AppShellProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: React.ReactNode
}

export function AppShell({ activeTab, onTabChange, children }: AppShellProps) {
  const { canViewFinances } = useAuth()
  const [moreOpen, setMoreOpen] = useState(false)

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    window.location.reload()
  }, [])

  const { containerRef, pullDistance, refreshing } = usePullToRefresh({ onRefresh: handleRefresh })

  const handleMoreClick = () => {
    setMoreOpen(true)
  }

  const handleMoreSelect = (tab: TabId) => {
    onTabChange(tab)
    setMoreOpen(false)
  }

  const moreItems = [
    { id: 'products' as const, label: 'Продукція' },
    { id: 'movements' as const, label: 'Рух складу' },
    ...(canViewFinances() ? [
      { id: 'sales' as const, label: 'Продажі' },
      { id: 'expenses' as const, label: 'Витрати' },
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        showFinances={canViewFinances()}
      />

      <main ref={containerRef} className="pb-20 md:pb-4 md:pl-64 overflow-y-auto">
        <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
        <div className="max-w-5xl mx-auto p-4">
          {children}
        </div>
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        showFinances={canViewFinances()}
        onMoreClick={handleMoreClick}
      />

      {/* More menu — simple full-screen overlay */}
      {moreOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-safe animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />
            <div className="px-4 pb-6 space-y-1">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMoreSelect(item.id)}
                  className={`w-full text-left px-4 py-4 rounded-xl text-base font-medium ${
                    activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700 active:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

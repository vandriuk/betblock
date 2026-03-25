import { useState, useCallback } from 'react'
import { Boxes, ArrowLeftRight, ShoppingCart, DollarSign } from 'lucide-react'
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

const MORE_ITEMS = [
  { id: 'products' as const, label: 'Продукція', icon: Boxes },
  { id: 'movements' as const, label: 'Рух складу', icon: ArrowLeftRight },
  { id: 'sales' as const, label: 'Продажі', icon: ShoppingCart, finance: true },
  { id: 'expenses' as const, label: 'Витрати', icon: DollarSign, finance: true },
]

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

  const visibleItems = MORE_ITEMS.filter((item) => !item.finance || canViewFinances())

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      <Header />

      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        showFinances={canViewFinances()}
      />

      {/* Main content */}
      <main ref={containerRef} className="pb-20 md:pb-4 md:pl-64 overflow-y-auto">
        <PullToRefreshIndicator pullDistance={pullDistance} refreshing={refreshing} />
        <div className="max-w-5xl mx-auto p-4">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        showFinances={canViewFinances()}
        onMoreClick={handleMoreClick}
      />

      {/* More Sheet (mobile) */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl pb-safe animate-slide-up">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3" />
            <div className="px-5 pt-5 pb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Розділи</p>
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMoreSelect(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-medium transition-all active:scale-[0.98] ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-primary-100' : 'bg-gray-100'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

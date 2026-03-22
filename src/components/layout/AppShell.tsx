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
    // Trigger a page reload to re-fetch Firestore data
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

  return (
    <div className="min-h-screen bg-background">
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pb-safe animate-slide-up">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
            <div className="px-4 pb-6 space-y-1">
              <MoreButton
                label="Продукція"
                active={activeTab === 'products'}
                onClick={() => handleMoreSelect('products')}
              />
              {canViewFinances() && (
                <>
                  <MoreButton
                    label="Продажі"
                    active={activeTab === 'sales'}
                    onClick={() => handleMoreSelect('sales')}
                  />
                  <MoreButton
                    label="Витрати"
                    active={activeTab === 'expenses'}
                    onClick={() => handleMoreSelect('expenses')}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MoreButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
        active ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}

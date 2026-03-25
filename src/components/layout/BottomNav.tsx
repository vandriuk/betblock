import { BarChart3, Package, Factory, ClipboardList, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'dashboard' | 'inventory' | 'products' | 'production' | 'orders' | 'sales' | 'expenses' | 'movements'

interface BottomNavProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  showFinances: boolean
  onMoreClick: () => void
}

const TABS = [
  { id: 'dashboard' as const, label: 'Дашборд', icon: BarChart3 },
  { id: 'inventory' as const, label: 'Склад', icon: Package },
  { id: 'production' as const, label: 'Виробн.', icon: Factory },
  { id: 'orders' as const, label: 'Замовл.', icon: ClipboardList },
]

export function BottomNav({ activeTab, onTabChange, onMoreClick }: BottomNavProps) {
  const isMoreActive = activeTab === 'products' || activeTab === 'sales' || activeTab === 'expenses' || activeTab === 'movements'

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all relative',
                isActive ? 'text-primary-600' : 'text-gray-400 active:text-gray-600'
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full" />
              )}
              <Icon className={cn('w-5 h-5 transition-transform', isActive && 'scale-110')} />
              <span className={cn('text-[10px] transition-all', isActive ? 'font-bold' : 'font-medium')}>{tab.label}</span>
            </button>
          )
        })}
        <button
          onClick={onMoreClick}
          className={cn(
            'flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all relative',
            isMoreActive ? 'text-primary-600' : 'text-gray-400 active:text-gray-600'
          )}
        >
          {isMoreActive && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full" />
          )}
          <MoreHorizontal className={cn('w-5 h-5 transition-transform', isMoreActive && 'scale-110')} />
          <span className={cn('text-[10px] transition-all', isMoreActive ? 'font-bold' : 'font-medium')}>Ще</span>
        </button>
      </div>
    </nav>
  )
}

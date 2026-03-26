import {
  BarChart3,
  Package,
  Factory,
  ClipboardList,
  ShoppingCart,
  DollarSign,
  Boxes,
  ArrowLeftRight,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import type { TabId } from './BottomNav'

interface SidebarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  showFinances: boolean
}

const NAV_ITEMS: { id: TabId; label: string; icon: typeof BarChart3; finance?: boolean; admin?: boolean }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
  { id: 'inventory', label: 'Склад', icon: Package },
  { id: 'products', label: 'Продукція', icon: Boxes },
  { id: 'production', label: 'Виробництво', icon: Factory },
  { id: 'orders', label: 'Замовлення', icon: ClipboardList },
  { id: 'movements', label: 'Рух складу', icon: ArrowLeftRight },
  { id: 'sales', label: 'Продажі', icon: ShoppingCart, finance: true },
  { id: 'expenses', label: 'Витрати', icon: DollarSign, finance: true },
  { id: 'users', label: 'Користувачі', icon: Users, admin: true },
]

export function Sidebar({ activeTab, onTabChange, showFinances }: SidebarProps) {
  const { isAdmin } = useAuth()
  const items = NAV_ITEMS.filter((item) => {
    if (item.finance && !showFinances) return false
    if (item.admin && !isAdmin()) return false
    return true
  })

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-30 hidden md:block">
      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

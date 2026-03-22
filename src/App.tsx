import { useState } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { DataProvider } from '@/contexts/DataContext'
import { logEvent } from '@/services/firebase'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import { InventoryPage } from '@/components/inventory/InventoryPage'
import { ProductsPage } from '@/components/products/ProductsPage'
import { ProductionPage } from '@/components/production/ProductionPage'
import { OrdersPage } from '@/components/orders/OrdersPage'
import { SalesPage } from '@/components/sales/SalesPage'
import { ExpensesPage } from '@/components/expenses/ExpensesPage'
import type { TabId } from '@/components/layout/BottomNav'

function AppContent() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    logEvent('page_view', { page: tab })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary-600 text-lg font-medium">
          Завантаження...
        </div>
      </div>
    )
  }

  if (!user) return <LoginScreen />

  const pages: Record<TabId, React.ReactNode> = {
    dashboard: <DashboardPage />,
    inventory: <InventoryPage />,
    products: <ProductsPage />,
    production: <ProductionPage />,
    orders: <OrdersPage />,
    sales: <SalesPage />,
    expenses: <ExpensesPage />,
  }

  return (
    <DataProvider>
      <AppShell activeTab={activeTab} onTabChange={handleTabChange}>
        {pages[activeTab]}
      </AppShell>
    </DataProvider>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </ErrorBoundary>
  )
}

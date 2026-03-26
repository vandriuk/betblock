import { useState, lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { DataProvider } from '@/contexts/DataContext'
import { logEvent } from '@/services/firebase'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { AppShell } from '@/components/layout/AppShell'
import type { TabId } from '@/components/layout/BottomNav'

const DashboardPage = lazy(() => import('@/components/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const InventoryPage = lazy(() => import('@/components/inventory/InventoryPage').then(m => ({ default: m.InventoryPage })))
const ProductsPage = lazy(() => import('@/components/products/ProductsPage').then(m => ({ default: m.ProductsPage })))
const ProductionPage = lazy(() => import('@/components/production/ProductionPage').then(m => ({ default: m.ProductionPage })))
const OrdersPage = lazy(() => import('@/components/orders/OrdersPage').then(m => ({ default: m.OrdersPage })))
const SalesPage = lazy(() => import('@/components/sales/SalesPage').then(m => ({ default: m.SalesPage })))
const ExpensesPage = lazy(() => import('@/components/expenses/ExpensesPage').then(m => ({ default: m.ExpensesPage })))
const MovementsPage = lazy(() => import('@/components/movements/MovementsPage').then(m => ({ default: m.MovementsPage })))
const CustomersPage = lazy(() => import('@/components/customers/CustomersPage').then(m => ({ default: m.CustomersPage })))
const UsersPage = lazy(() => import('@/components/users/UsersPage').then(m => ({ default: m.UsersPage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-primary-600 text-sm">Завантаження...</div>
    </div>
  )
}

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
    movements: <MovementsPage />,
    sales: <SalesPage />,
    expenses: <ExpensesPage />,
    customers: <CustomersPage />,
    users: <UsersPage />,
  }

  return (
    <DataProvider>
      <AppShell activeTab={activeTab} onTabChange={handleTabChange}>
        <Suspense fallback={<PageLoader />}>
          {pages[activeTab]}
        </Suspense>
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

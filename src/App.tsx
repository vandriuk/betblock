import { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/components/dashboard/DashboardPage'
import type { TabId } from '@/components/layout/BottomNav'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-200">
      <p className="text-gray-400 text-lg">{title} — скоро буде</p>
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

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
    inventory: <PlaceholderPage title="Склад" />,
    products: <PlaceholderPage title="Продукція" />,
    production: <PlaceholderPage title="Виробництво" />,
    orders: <PlaceholderPage title="Замовлення" />,
    sales: <PlaceholderPage title="Продажі" />,
    expenses: <PlaceholderPage title="Витрати" />,
  }

  return (
    <DataProvider>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        {pages[activeTab]}
      </AppShell>
    </DataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

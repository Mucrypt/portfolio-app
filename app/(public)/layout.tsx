import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'
import { AuthProvider } from '@/lib/auth/AuthProvider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className='min-h-screen'>
        <Header />
        <main className='min-h-screen pt-20'>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

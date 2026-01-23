import { Suspense } from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AnalyticsProvider from '@/components/analytics/AnalyticsProvider'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen'>
      <Header />
      <main className='min-h-screen pt-20'>
        <Suspense fallback={null}>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

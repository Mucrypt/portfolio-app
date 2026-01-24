'use client'

import AdminHeader from '@/components/admin/AdminHeader'
import Sidebar from '@/components/admin/Sidebar'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='flex h-screen bg-zinc-100 dark:bg-zinc-900 overflow-hidden'>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden'
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isMobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col overflow-hidden w-full'>
        <AdminHeader
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>{children}</main>
      </div>
    </div>
  )
}

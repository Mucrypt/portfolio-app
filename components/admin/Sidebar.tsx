'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  ShoppingBag,
  Image,
  User,
  Code,
  Building2,
  BookOpen,
  Activity,
  BarChart3,
  AlertTriangle,
  Shield,
  Database,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight,
  Zap,
  Eye,
  Settings,
} from 'lucide-react'

// Enterprise-grade organized menu structure
const menuSections = [
  {
    id: 'overview',
    title: 'Overview',
    icon: LayoutDashboard,
    collapsible: false,
    items: [
      {
        href: '/admin',
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null,
      },
    ],
  },
  {
    id: 'content',
    title: 'Content Management',
    icon: FileText,
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/admin/blog', label: 'Blog Posts', icon: FileText, badge: null },
      {
        href: '/admin/projects',
        label: 'Projects',
        icon: Briefcase,
        badge: null,
      },
      {
        href: '/admin/courses',
        label: 'Courses',
        icon: GraduationCap,
        badge: null,
      },
      { href: '/admin/services', label: 'Services', icon: Wrench, badge: null },
      { href: '/admin/shop', label: 'Shop', icon: ShoppingBag, badge: null },
      {
        href: '/admin/media',
        label: 'Media Library',
        icon: Image,
        badge: null,
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio Data',
    icon: User,
    collapsible: true,
    defaultOpen: true,
    items: [
      { href: '/admin/about', label: 'About Me', icon: User, badge: null },
      { href: '/admin/skills', label: 'Skills', icon: Code, badge: null },
      {
        href: '/admin/experiences',
        label: 'Work Experience',
        icon: Building2,
        badge: null,
      },
      {
        href: '/admin/education',
        label: 'Education',
        icon: BookOpen,
        badge: null,
      },
    ],
  },
  {
    id: 'monitoring',
    title: 'System Monitoring',
    icon: Activity,
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        href: '/admin/system',
        label: 'System Overview',
        icon: Activity,
        badge: 'live',
      },
      {
        href: '/admin/performance',
        label: 'Performance',
        icon: TrendingUp,
        badge: null,
      },
      { href: '/admin/security', label: 'Security', icon: Shield, badge: null },
      {
        href: '/admin/database',
        label: 'Database',
        icon: Database,
        badge: null,
      },
      {
        href: '/admin/monitoring',
        label: 'Uptime Monitor',
        icon: Eye,
        badge: null,
      },
      {
        href: '/admin/errors',
        label: 'Error Logs',
        icon: AlertTriangle,
        badge: null,
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    icon: BarChart3,
    collapsible: true,
    defaultOpen: false,
    items: [
      {
        href: '/admin/analytics',
        label: 'Analytics',
        icon: BarChart3,
        badge: null,
      },
      {
        href: '/admin/activity',
        label: 'User Activity',
        icon: Users,
        badge: null,
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    collapsible: false,
    items: [
      {
        href: '/admin/profile',
        label: 'Admin Profile',
        icon: Settings,
        badge: null,
      },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [systemInfo, setSystemInfo] = useState({
    uptime: '0s',
    memory: '0MB',
    status: 'online',
  })

  // Initialize collapsed sections based on defaults - useMemo to avoid re-computation
  const initialCollapsed = useState(() => {
    const collapsed = new Set<string>()
    menuSections.forEach((section) => {
      if (section.collapsible && !section.defaultOpen) {
        collapsed.add(section.id)
      }
    })
    return collapsed
  })[0]

  const [collapsedSections, setCollapsedSections] =
    useState<Set<string>>(initialCollapsed)

  useEffect(() => {
    // Fetch system info for footer
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.uptime) {
          const hours = Math.floor(data.uptime / 3600)
          const minutes = Math.floor((data.uptime % 3600) / 60)
          setSystemInfo({
            uptime: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
            memory: data.redis?.memory || 'N/A',
            status: 'online',
          })
        }
      })
      .catch(() => {
        setSystemInfo({ uptime: 'N/A', memory: 'N/A', status: 'offline' })
      })
  }, [])

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  return (
    <aside className='w-80 bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 border-r border-gray-200 dark:border-zinc-700 shadow-2xl flex flex-col h-full'>
      {/* Header */}
      <div className='p-6 border-b border-gray-200 dark:border-zinc-700 shrink-0 bg-linear-to-r from-blue-600 to-purple-600'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
            <Zap className='w-6 h-6 text-white' />
          </div>
          <div>
            <h2 className='text-xl font-bold text-white tracking-tight'>
              Admin Panel
            </h2>
            <p className='text-xs text-blue-100'>Portfolio Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto py-4 px-3 custom-scrollbar'>
        {menuSections.map((section, sectionIdx) => {
          const isCollapsed = collapsedSections.has(section.id)
          const SectionIcon = section.icon

          return (
            <div key={section.id} className={sectionIdx > 0 ? 'mt-6' : ''}>
              {/* Section Header */}
              {section.collapsible ? (
                <button
                  onClick={() => toggleSection(section.id)}
                  className='w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group'
                >
                  <div className='flex items-center gap-2'>
                    <SectionIcon className='w-4 h-4' />
                    <span>{section.title}</span>
                  </div>
                  {isCollapsed ? (
                    <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
                  ) : (
                    <ChevronDown className='w-4 h-4 transition-transform group-hover:translate-y-0.5' />
                  )}
                </button>
              ) : (
                <div className='flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wider'>
                  <SectionIcon className='w-4 h-4' />
                  <span>{section.title}</span>
                </div>
              )}

              {/* Section Items */}
              {!isCollapsed && (
                <div className='mt-2 space-y-1'>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    const ItemIcon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:translate-x-1'
                        }`}
                      >
                        <div className='flex items-center gap-3'>
                          <ItemIcon
                            className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-zinc-400 group-hover:text-gray-700 dark:group-hover:text-zinc-300'}`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.badge === 'live'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer - System Status */}
      <div className='border-t border-gray-200 dark:border-zinc-700 p-4 space-y-3 shrink-0 bg-linear-to-br from-gray-50 to-white dark:from-zinc-900 dark:to-zinc-800'>
        {/* System Status Card */}
        <div className='p-3 bg-white dark:bg-zinc-800/50 rounded-lg border border-gray-200 dark:border-zinc-700 space-y-2.5'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-semibold text-gray-600 dark:text-zinc-400'>
              System Status
            </span>
            <div className='flex items-center gap-1.5'>
              {systemInfo.status === 'online' ? (
                <>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                  </span>
                  <span className='text-[10px] text-green-600 dark:text-green-400 font-bold uppercase'>
                    Online
                  </span>
                </>
              ) : (
                <>
                  <span className='relative inline-flex rounded-full h-2 w-2 bg-red-500'></span>
                  <span className='text-[10px] text-red-600 dark:text-red-400 font-bold uppercase'>
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-zinc-700'>
            <div>
              <div className='text-[10px] text-gray-500 dark:text-zinc-500 uppercase'>
                Uptime
              </div>
              <div className='text-xs text-gray-800 dark:text-zinc-200 font-semibold mt-0.5'>
                {systemInfo.uptime}
              </div>
            </div>
            <div>
              <div className='text-[10px] text-gray-500 dark:text-zinc-500 uppercase'>
                Cache
              </div>
              <div className='text-xs text-gray-800 dark:text-zinc-200 font-semibold mt-0.5'>
                {systemInfo.memory}
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className='flex items-center justify-between px-2'>
          <span className='text-[10px] text-gray-500 dark:text-zinc-500 font-medium'>
            Version 0.1.0
          </span>
          <span className='text-[10px] text-gray-400 dark:text-zinc-600'>
            © 2026
          </span>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(113, 113, 122, 0.3);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(113, 113, 122, 0.5);
        }
      `}</style>
    </aside>
  )
}

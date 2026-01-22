"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Organized menu structure with categories
const menuSections = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: "📊" },
      { href: "/admin/monitoring", label: "Monitoring", icon: "🔍" },
      { href: "/admin/analytics", label: "Analytics", icon: "📈" },
      { href: "/admin/errors", label: "Error Logs", icon: "🚨" },
    ],
  },
  {
    title: "Content Management",
    items: [
      { href: "/admin/blog", label: "Blog", icon: "📝" },
      { href: "/admin/projects", label: "Projects", icon: "🚀" },
      { href: "/admin/courses", label: "Courses", icon: "📚" },
      { href: "/admin/services", label: "Services", icon: "⚡" },
      { href: "/admin/shop", label: "Shop", icon: "🛍️" },
      { href: "/admin/media", label: "Media", icon: "🖼️" },
    ],
  },
  {
    title: "Portfolio",
    items: [
      { href: "/admin/skills", label: "Skills", icon: "💡" },
      { href: "/admin/experiences", label: "Experiences", icon: "💼" },
      { href: "/admin/education", label: "Education", icon: "🎓" },
      { href: "/admin/about", label: "About", icon: "📖" },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/profile", label: "Profile", icon: "👤" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [systemInfo, setSystemInfo] = useState({ uptime: "0s", memory: "0MB" });

  useEffect(() => {
    // Fetch system info for footer
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.uptime) {
          const hours = Math.floor(data.uptime / 3600);
          const minutes = Math.floor((data.uptime % 3600) / 60);
          setSystemInfo({
            uptime: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
            memory: data.redis?.memory || "N/A",
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-80 bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border-r border-zinc-200 dark:border-zinc-700 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Admin Panel
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Portfolio Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuSections.map((section, sectionIdx) => (
          <div key={section.title} className={sectionIdx > 0 ? "mt-6" : ""}>
            <h3 className="px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-4 space-y-3 shrink-0 bg-zinc-50 dark:bg-zinc-900">
        {/* System Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Status</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Uptime</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{systemInfo.uptime}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Cache</span>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">{systemInfo.memory}</span>
          </div>
        </div>

        {/* Version & Copyright */}
        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-500">Version</span>
            <span className="text-zinc-600 dark:text-zinc-400 font-mono font-semibold">v0.1.0</span>
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2 text-center">
            © 2026 Portfolio App
          </p>
        </div>
      </div>
    </aside>
  );
}

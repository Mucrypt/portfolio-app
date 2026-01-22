"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/monitoring", label: "Monitoring", icon: "🔍" },
  { href: "/admin/analytics", label: "Analytics", icon: "📈" },
  { href: "/admin/errors", label: "Error Logs", icon: "🚨" },
  { href: "/admin/skills", label: "Skills", icon: "💡" },
  { href: "/admin/experiences", label: "Experiences", icon: "💼" },
  { href: "/admin/education", label: "Education", icon: "🎓" },
  { href: "/admin/projects", label: "Projects", icon: "🚀" },
  { href: "/admin/courses", label: "Courses", icon: "📚" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/services", label: "Services", icon: "⚡" },
  { href: "/admin/shop", label: "Shop", icon: "🛍️" },
  { href: "/admin/about", label: "About", icon: "📖" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
  { href: "/admin/media", label: "Media", icon: "🖼️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-zinc-800 shadow-lg flex flex-col h-full">
      <div className="p-6 shrink-0">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Admin Panel
        </h2>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

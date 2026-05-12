"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  TrendingUp,
  Newspaper,
  ClipboardCheck,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { label: "品种管理", href: "/admin/herbs", icon: Leaf },
  { label: "行情管理", href: "/admin/quotes", icon: TrendingUp },
  { label: "资讯管理", href: "/admin/news", icon: Newspaper },
  { label: "供求审核", href: "/admin/supply", icon: ClipboardCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-[100] flex bg-gray-50">
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-wide">管理后台</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/10 text-white shadow-sm border-l-[3px] border-white/60 pl-[13px]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-3 pb-4">
          <div className="border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
              返回前台
            </Link>
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-8 py-4 shrink-0">
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">管理后台</h1>
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}

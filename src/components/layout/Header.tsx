"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Leaf } from "lucide-react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "价格行情", href: "/prices" },
  { label: "品种数据库", href: "/herbs" },
  { label: "行业资讯", href: "/news" },
  { label: "供求信息", href: "/supply" },
  { label: "价格指数", href: "/index" },
  { label: "市场分析", href: "/analysis" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/30 transition-colors duration-500" />
              <div className="relative bg-gradient-to-br from-primary to-primary-light p-1.5 rounded-lg">
                <Leaf className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wide text-gradient">
              中药材信息网
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden relative p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="切换导航菜单"
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
              />
              <X
                className={`h-6 w-6 absolute inset-0 transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-0.5">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all duration-300"
              onClick={() => setMobileMenuOpen(false)}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}

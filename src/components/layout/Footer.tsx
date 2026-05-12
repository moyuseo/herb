import Link from "next/link";
import { Leaf } from "lucide-react";

const navColumns = [
  {
    title: "行情服务",
    links: [
      { label: "价格行情", href: "/prices" },
      { label: "价格指数", href: "/index" },
      { label: "涨跌排行", href: "/prices/rankings" },
    ],
  },
  {
    title: "信息服务",
    links: [
      { label: "品种数据库", href: "/herbs" },
      { label: "行业资讯", href: "/news" },
      { label: "市场分析", href: "/analysis" },
    ],
  },
  {
    title: "供求平台",
    links: [
      { label: "供求信息", href: "/supply" },
      { label: "发布供求", href: "/supply/publish" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <Leaf className="h-7 w-7 text-primary-200 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-xl font-bold tracking-wide">中药材信息网</span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              专注中药材行业数据服务，提供权威、及时、全面的市场行情与信息资讯。
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navColumns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-white/40 text-center">
            &copy; {new Date().getFullYear()} 中药材信息网 版权所有
          </p>
        </div>
      </div>
    </footer>
  );
}

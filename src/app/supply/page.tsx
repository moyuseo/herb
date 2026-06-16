import Link from "next/link";
import { format } from "date-fns";
import { Search, Plus } from "lucide-react";
import { getSupplyDemandList } from "@/lib/db";

function buildQuery(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) sp.set(key, value);
  }
  const str = sp.toString();
  return str ? `/supply?${str}` : "/supply";
}

export default async function SupplyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = typeof params.type === "string" ? params.type : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const currentPage = Number(params.page) || 1;
  const pageSize = 10;

  const result = await getSupplyDemandList({
    type,
    search,
    page: currentPage,
    pageSize,
  });

  const { data, totalPages } = result;

  const typeTabs = [
    { label: "全部", value: undefined },
    { label: "供应", value: "supply" },
    { label: "求购", value: "demand" },
  ];

  const paginationRange = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            供求信息
          </h1>
          <p className="mt-1 text-sm text-gray-500">中药材供应与求购信息发布平台</p>
        </div>
        <Link
          href="/supply/publish"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition-all text-sm font-semibold shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-200"
        >
          <Plus className="h-4 w-4" />
          发布信息
        </Link>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-4 sm:p-5 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-1.5 bg-gray-100/80 p-1 rounded-xl">
            {typeTabs.map((tab) => (
              <Link
                key={tab.label}
                href={buildQuery({ type: tab.value, search })}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  type === tab.value
                    ? tab.value === "supply"
                      ? "bg-blue-500 text-white shadow-sm shadow-blue-200"
                      : tab.value === "demand"
                        ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                        : "bg-gray-800 text-white shadow-sm shadow-gray-300"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <form method="GET" action="/supply" className="flex gap-2 flex-1 w-full sm:w-auto">
            <input type="hidden" name="type" value={type || ""} />
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="搜索品种名称..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors shrink-0"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200/60 py-20 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-7 w-7 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base font-medium">暂无供求信息</p>
          <p className="text-gray-400 text-sm mt-1">试试调整筛选条件或发布新信息</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-200/60 p-5 sm:p-6 hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-300/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      item.type === "supply"
                        ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200/60"
                        : "bg-amber-50 text-amber-600 ring-1 ring-amber-200/60"
                    }`}
                  >
                    {item.type === "supply" ? "供应" : "求购"}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {item.herb.name}
                  </h3>
                </div>
                <span className="text-xs text-gray-400 shrink-0 font-medium">
                  {format(new Date(item.createdAt), "yyyy-MM-dd")}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-gray-50/80 rounded-xl px-3.5 py-2.5">
                  <span className="text-xs text-gray-400 font-medium">数量</span>
                  <p className="text-sm text-gray-900 font-semibold mt-0.5">{item.quantity}</p>
                </div>
                <div className="bg-gray-50/80 rounded-xl px-3.5 py-2.5">
                  <span className="text-xs text-gray-400 font-medium">价格</span>
                  <p className="text-sm text-gray-900 font-semibold mt-0.5">{item.price || "面议"}</p>
                </div>
                <div className="bg-gray-50/80 rounded-xl px-3.5 py-2.5">
                  <span className="text-xs text-gray-400 font-medium">产地</span>
                  <p className="text-sm text-gray-900 font-semibold mt-0.5">{item.origin || "-"}</p>
                </div>
                <div className="bg-gray-50/80 rounded-xl px-3.5 py-2.5 min-w-0">
                  <span className="text-xs text-gray-400 font-medium">联系方式</span>
                  <p className="text-sm text-gray-900 font-semibold mt-0.5 truncate">{item.contact}</p>
                </div>
              </div>

              {item.description && (
                <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-10">
          <Link
            href={buildQuery({ type, search, page: currentPage > 1 ? String(currentPage - 1) : "1" })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage <= 1
                ? "text-gray-300 pointer-events-none"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-disabled={currentPage <= 1}
          >
            上一页
          </Link>

          {paginationRange().map((page, idx) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400 text-sm">
                ...
              </span>
            ) : (
              <Link
                key={page}
                href={buildQuery({ type, search, page: String(page) })}
                className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all ${
                  page === currentPage
                    ? "bg-gray-900 text-white shadow-sm shadow-gray-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {page}
              </Link>
            )
          )}

          <Link
            href={buildQuery({ type, search, page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages) })}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPage >= totalPages
                ? "text-gray-300 pointer-events-none"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-disabled={currentPage >= totalPages}
          >
            下一页
          </Link>
        </div>
      )}
    </div>
  );
}

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">供求信息</h1>
        <Link
          href="/supply/publish"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          发布信息
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-1">
            {typeTabs.map((tab) => (
              <Link
                key={tab.label}
                href={buildQuery({ type: tab.value, search })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  type === tab.value
                    ? tab.value === "supply"
                      ? "bg-blue-500 text-white"
                      : tab.value === "demand"
                        ? "bg-orange-500 text-white"
                        : "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <form method="GET" action="/supply" className="flex gap-2 flex-1 w-full sm:w-auto">
            <input type="hidden" name="type" value={type || ""} />
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search || ""}
                placeholder="搜索品种名称..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shrink-0"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">暂无供求信息</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === "supply"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.type === "supply" ? "供应" : "求购"}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.herb.name}
                  </h3>
                </div>
                <span className="text-sm text-gray-400 shrink-0">
                  {format(new Date(item.createdAt), "yyyy-MM-dd")}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">数量:</span>
                  <span className="text-gray-900 font-medium">{item.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">价格:</span>
                  <span className="text-gray-900 font-medium">{item.price || "面议"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">产地:</span>
                  <span className="text-gray-900">{item.origin || "-"}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-gray-500 shrink-0">联系方式:</span>
                  <span className="text-gray-900 truncate">{item.contact}</span>
                </div>
              </div>

              {item.description && (
                <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-8">
          <Link
            href={buildQuery({ type, search, page: currentPage > 1 ? String(currentPage - 1) : "1" })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage <= 1
                ? "text-gray-300 pointer-events-none"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-disabled={currentPage <= 1}
          >
            上一页
          </Link>

          {paginationRange().map((page, idx) =>
            typeof page === "string" ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400">
                ...
              </span>
            ) : (
              <Link
                key={page}
                href={buildQuery({ type, search, page: String(page) })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </Link>
            )
          )}

          <Link
            href={buildQuery({ type, search, page: currentPage < totalPages ? String(currentPage + 1) : String(totalPages) })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage >= totalPages
                ? "text-gray-300 pointer-events-none"
                : "text-gray-600 hover:bg-gray-100"
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

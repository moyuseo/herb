import { Suspense } from "react";
import { getHerbList } from "@/lib/db";
import HerbCard from "@/components/herbs/HerbCard";
import HerbFilters from "@/components/herbs/HerbFilters";
import Pagination from "@/components/herbs/Pagination";

interface HerbsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function HerbsPage({ searchParams }: HerbsPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const search = params.search || undefined;
  const page = parseInt(params.page || "1", 10);

  const result = await getHerbList({ category, search, page, pageSize: 12 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            品种数据库
          </h1>
        </div>
        <p className="text-gray-500 pl-4 ml-1">
          收录数千种中药材的详细信息与药典标准
        </p>
      </div>

      <div className="animate-fade-in-up [animation-delay:100ms]">
        <Suspense fallback={null}>
          <HerbFilters />
        </Suspense>
      </div>

      <div className="mt-6 mb-6 flex items-center gap-2 animate-fade-in-up [animation-delay:200ms]">
        <div className="flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 px-4 py-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-gray-500">
            共
            <span className="font-semibold text-gray-800 mx-1">
              {result.total}
            </span>
            个品种
          </span>
          {category && category !== "全部" && (
            <span className="text-sm text-gray-400">
              ·
              <span className="ml-1 font-medium text-emerald-600">
                {category}
              </span>
            </span>
          )}
          {search && (
            <span className="text-sm text-gray-400">
              ·
              <span className="ml-1 font-medium text-emerald-600">
                {search}
              </span>
            </span>
          )}
        </div>
      </div>

      {result.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {result.data.map((herb, index) => (
              <div
                key={herb.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${300 + index * 60}ms` }}
              >
                <HerbCard herb={herb} />
              </div>
            ))}
          </div>

          <div className="mt-10 animate-fade-in-up [animation-delay:500ms]">
            <Suspense fallback={null}>
              <Pagination page={result.page} totalPages={result.totalPages} />
            </Suspense>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up [animation-delay:200ms]">
          <div className="relative mb-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <svg
                className="h-10 w-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m6-6H6"
                />
              </svg>
            </div>
          </div>
          <p className="text-gray-500 text-lg font-medium">暂无匹配的品种数据</p>
          <p className="text-gray-400 text-sm mt-2">请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
}

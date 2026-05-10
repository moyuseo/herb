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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">品种数据库</h1>
        <p className="text-gray-500">
          收录数千种中药材的详细信息与药典标准
        </p>
      </div>

      <Suspense fallback={null}>
        <HerbFilters />
      </Suspense>

      <div className="mt-6 mb-4 text-sm text-gray-500">
        共 <span className="font-medium text-gray-900">{result.total}</span>{" "}
        个品种
        {category && category !== "全部" && (
          <span>
            {" "}
            · 分类：
            <span className="font-medium text-primary">{category}</span>
          </span>
        )}
        {search && (
          <span>
            {" "}
            · 搜索：
            <span className="font-medium text-primary">{search}</span>
          </span>
        )}
      </div>

      {result.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.data.map((herb) => (
              <HerbCard key={herb.id} herb={herb} />
            ))}
          </div>

          <Suspense fallback={null}>
            <Pagination page={result.page} totalPages={result.totalPages} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">暂无匹配的品种数据</p>
          <p className="text-gray-400 text-sm mt-2">请尝试调整筛选条件</p>
        </div>
      )}
    </div>
  );
}

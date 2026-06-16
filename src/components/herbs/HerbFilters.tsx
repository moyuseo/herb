"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

const CATEGORIES = [
  "全部",
  "根及根茎类",
  "果实种子类",
  "全草类",
  "花类",
  "叶类",
  "皮类",
  "藤木类",
  "树脂类",
  "菌藻类",
  "动物类",
  "矿物类",
  "其他类",
];

export default function HerbFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "全部";
  const currentSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value && value !== "全部") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }
      router.push(`/herbs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      updateParams({ category });
    },
    [updateParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParams({ search: searchInput });
    },
    [searchInput, updateParams]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              currentCategory === cat
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索品种名称或别名..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-md hover:shadow-primary/25"
        >
          搜索
        </button>
      </form>
    </div>
  );
}

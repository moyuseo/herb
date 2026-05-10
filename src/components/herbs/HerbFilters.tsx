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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentCategory === cat
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索品种名称或别名..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          搜索
        </button>
      </form>
    </div>
  );
}

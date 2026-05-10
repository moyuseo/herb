"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

const categories = [
  { value: "", label: "全部分类" },
  { value: "根及根茎类", label: "根及根茎类" },
  { value: "果实种子类", label: "果实种子类" },
  { value: "全草类", label: "全草类" },
  { value: "花类", label: "花类" },
  { value: "叶类", label: "叶类" },
  { value: "皮类", label: "皮类" },
  { value: "藤木类", label: "藤木类" },
  { value: "树脂类", label: "树脂类" },
  { value: "菌藻类", label: "菌藻类" },
  { value: "动物类", label: "动物类" },
  { value: "矿物类", label: "矿物类" },
  { value: "其他类", label: "其他类" },
];

export default function PriceFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const currentCategory = searchParams.get("category") || "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/prices?${params.toString()}`);
    });
  }

  function handleSearch() {
    updateParams("search", searchInput);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={currentCategory}
        onChange={(e) => updateParams("category", e.target.value)}
        className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <div className="relative flex-1 max-w-md w-full sm:w-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="搜索品种名称..."
          className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {isPending && (
        <span className="text-sm text-gray-400 self-center">加载中...</span>
      )}
    </div>
  );
}

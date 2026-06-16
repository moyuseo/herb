"use client";

import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  { label: "全部", value: "" },
  { label: "行业动态", value: "行业动态" },
  { label: "政策法规", value: "政策法规" },
  { label: "市场分析", value: "市场分析" },
  { label: "产地信息", value: "产地信息" },
  { label: "种植技术", value: "种植技术" },
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  function handleCategoryChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/news?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => handleCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === cat.value
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

interface Herb {
  id: number;
  name: string;
  category: string;
}

export default function PublishPage() {
  const router = useRouter();
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    type: "",
    herbId: "",
    quantity: "",
    price: "",
    origin: "",
    contact: "",
    description: "",
  });

  useEffect(() => {
    fetch("/api/herbs")
      .then((res) => res.json())
      .then((data) => setHerbs(data))
      .catch(() => {});
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.type) newErrors.type = "请选择类型";
    if (!form.herbId) newErrors.herbId = "请选择品种";
    if (!form.quantity) newErrors.quantity = "请输入数量";
    if (!form.contact) newErrors.contact = "请输入联系方式";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/supply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          herbId: Number(form.herbId),
          quantity: form.quantity,
          price: form.price || null,
          origin: form.origin || null,
          contact: form.contact,
          description: form.description || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          type: "",
          herbId: "",
          quantity: "",
          price: "",
          origin: "",
          contact: "",
          description: "",
        });
        setErrors({});
      }
    } catch {
      setErrors({ submit: "提交失败，请稍后重试" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">发布成功！</h2>
          <p className="text-gray-500 mb-6">
            您的供求信息已提交，审核通过后将对外展示。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setSuccess(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              继续发布
            </button>
            <button
              onClick={() => router.push("/supply")}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              查看列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/supply")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">发布供求信息</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            类型 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                form.type === "supply"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="type"
                value="supply"
                checked={form.type === "supply"}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">供应</span>
            </label>
            <label
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                form.type === "demand"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="type"
                value="demand"
                checked={form.type === "demand"}
                onChange={handleChange}
                className="sr-only"
              />
              <span className="font-medium">求购</span>
            </label>
          </div>
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="herbId" className="block text-sm font-medium text-gray-700 mb-2">
            品种 <span className="text-red-500">*</span>
          </label>
          <select
            id="herbId"
            name="herbId"
            value={form.herbId}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white ${
              errors.herbId ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">请选择品种</option>
            {herbs.map((herb) => (
              <option key={herb.id} value={herb.id}>
                {herb.name}（{herb.category}）
              </option>
            ))}
          </select>
          {errors.herbId && <p className="mt-1 text-sm text-red-500">{errors.herbId}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              数量 <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="如：100kg"
              className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              价格
            </label>
            <input
              id="price"
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="如：50元/kg 或 面议"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
            产地
          </label>
          <input
            id="origin"
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="如：甘肃岷县"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
            联系方式 <span className="text-red-500">*</span>
          </label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="手机号或微信号"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            描述
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="请输入详细描述信息..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {errors.submit && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {loading ? "提交中..." : "发布信息"}
        </button>
      </form>
    </div>
  );
}

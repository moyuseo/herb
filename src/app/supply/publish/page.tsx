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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-border shadow-sm p-10 sm:p-14 text-center animate-scale-in">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">发布成功！</h2>
          <p className="text-text-secondary leading-relaxed mb-8 max-w-sm mx-auto">
            您的供求信息已提交，审核通过后将对外展示。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setSuccess(false)}
              className="w-full sm:w-auto px-6 py-2.5 border border-border rounded-xl text-sm font-semibold text-text-secondary hover:bg-surface-alt hover:border-primary/30 transition-all"
            >
              继续发布
            </button>
            <button
              onClick={() => router.push("/supply")}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all"
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
      <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
        <button
          onClick={() => router.push("/supply")}
          className="p-2.5 rounded-xl border border-border hover:bg-surface-alt hover:border-primary/30 transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-text-secondary" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">发布供求信息</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 space-y-6 animate-fade-in-up delay-100">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-3">
            类型 <span className="text-accent-red">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`relative flex flex-col items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                form.type === "supply"
                  ? "border-blue-500 bg-blue-50/60 shadow-sm shadow-blue-100"
                  : "border-border hover:border-blue-200 hover:bg-blue-50/30"
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
              <span className={`text-xl font-bold ${form.type === "supply" ? "text-blue-600" : "text-text-tertiary"}`}>供应</span>
              {form.type === "supply" && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </label>
            <label
              className={`relative flex flex-col items-center justify-center gap-2 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                form.type === "demand"
                  ? "border-amber-500 bg-amber-50/60 shadow-sm shadow-amber-100"
                  : "border-border hover:border-amber-200 hover:bg-amber-50/30"
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
              <span className={`text-xl font-bold ${form.type === "demand" ? "text-amber-600" : "text-text-tertiary"}`}>求购</span>
              {form.type === "demand" && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </label>
          </div>
          {errors.type && <p className="mt-2 text-sm text-accent-red font-medium">{errors.type}</p>}
        </div>

        <div>
          <label htmlFor="herbId" className="block text-sm font-semibold text-text-primary mb-3">
            品种 <span className="text-accent-red">*</span>
          </label>
          <select
            id="herbId"
            name="herbId"
            value={form.herbId}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-xl text-sm bg-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              errors.herbId ? "border-accent-red" : "border-border hover:border-primary/30"
            }`}
          >
            <option value="">请选择品种</option>
            {herbs.map((herb) => (
              <option key={herb.id} value={herb.id}>
                {herb.name}（{herb.category}）
              </option>
            ))}
          </select>
          {errors.herbId && <p className="mt-2 text-sm text-accent-red font-medium">{errors.herbId}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="quantity" className="block text-sm font-semibold text-text-primary mb-3">
              数量 <span className="text-accent-red">*</span>
            </label>
            <input
              id="quantity"
              type="text"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="如：100kg"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                errors.quantity ? "border-accent-red" : "border-border hover:border-primary/30"
              }`}
            />
            {errors.quantity && <p className="mt-2 text-sm text-accent-red font-medium">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-text-primary mb-3">
              价格
            </label>
            <input
              id="price"
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="如：50元/kg 或 面议"
              className="w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="origin" className="block text-sm font-semibold text-text-primary mb-3">
            产地
          </label>
          <input
            id="origin"
            type="text"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="如：甘肃岷县"
            className="w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/30"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-semibold text-text-primary mb-3">
            联系方式 <span className="text-accent-red">*</span>
          </label>
          <input
            id="contact"
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="手机号或微信号"
            className={`w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              errors.contact ? "border-accent-red" : "border-border hover:border-primary/30"
            }`}
          />
          {errors.contact && <p className="mt-2 text-sm text-accent-red font-medium">{errors.contact}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-text-primary mb-3">
            描述
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="请输入详细描述信息..."
            className="w-full px-4 py-3 border border-border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/30 resize-none"
          />
        </div>

        {errors.submit && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-accent-red text-sm font-medium">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Send className="h-4 w-4" />
          {loading ? "提交中..." : "发布信息"}
        </button>
      </form>
    </div>
  );
}

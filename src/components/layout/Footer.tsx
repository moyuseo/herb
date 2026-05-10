import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            <span className="font-semibold">中药材信息网</span>
          </div>
          <p className="text-sm text-white/70">
            &copy; {new Date().getFullYear()} 中药材信息网 版权所有
          </p>
        </div>
      </div>
    </footer>
  );
}

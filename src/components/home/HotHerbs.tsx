import Link from "next/link";

interface HotHerb {
  id: number;
  herbId: number;
  price: number;
  change: number;
  changePercent: number;
  herb: { id: number; name: string; category: string };
}

interface HotHerbsProps {
  herbs: HotHerb[];
}

export default function HotHerbs({ herbs }: HotHerbsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {herbs.map((herb) => {
        const isUp = herb.changePercent > 0;
        const isFlat = herb.changePercent === 0;

        const accentGradient = isFlat
          ? "from-gray-200 to-gray-100"
          : isUp
            ? "from-accent-red/60 to-accent-red/10"
            : "from-accent-green/60 to-accent-green/10";

        const changeColor = isFlat
          ? "text-text-tertiary"
          : isUp
            ? "text-accent-red"
            : "text-accent-green";

        return (
          <Link
            key={herb.id}
            href={`/herbs/${herb.herb.id}`}
            className="card-hover block rounded-2xl border border-gray-100 bg-white overflow-hidden"
          >
            <div
              className={`h-1 bg-gradient-to-r ${accentGradient}`}
            />

            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-text-primary tracking-tight">
                  {herb.herb.name}
                </h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-gray-50 text-text-secondary font-medium border border-gray-100">
                  {herb.herb.category}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-text-tertiary mb-1">当前价格</p>
                  <p className="text-2xl font-bold text-text-primary tracking-tight">
                    ¥{herb.price.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`text-sm font-medium ${changeColor}`}>
                    {isUp ? "+" : ""}{herb.change.toFixed(2)}
                  </p>
                  <div className={`inline-flex items-center gap-1 text-base font-bold ${changeColor}`}>
                    <span className="text-[10px]">
                      {isUp ? "▲" : isFlat ? "—" : "▼"}
                    </span>
                    {isUp ? "+" : ""}{herb.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

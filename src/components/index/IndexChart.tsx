"use client";

import { useState, useEffect, useCallback } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { format } from "date-fns";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomComponent,
  ToolboxComponent,
  CanvasRenderer,
]);

interface IndexDataPoint {
  id: number;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  date: string;
  createdAt: string;
}

interface IndexChartProps {
  initialData: IndexDataPoint[];
}

const TIME_RANGES = [
  { label: "30天", days: 30 },
  { label: "90天", days: 90 },
  { label: "1年", days: 365 },
  { label: "全部", days: 3650 },
];

export default function IndexChart({ initialData }: IndexChartProps) {
  const [data, setData] = useState<IndexDataPoint[]>(initialData);
  const [activeRange, setActiveRange] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (days: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/index?name=${encodeURIComponent("综合指数")}&days=${days}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      console.error("获取指数数据失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeRange > 0) {
      fetchData(TIME_RANGES[activeRange].days);
    }
  }, [activeRange, fetchData]);

  const handleRangeChange = (index: number) => {
    setActiveRange(index);
  };

  const dates = data.map((d) => format(new Date(d.date), "MM-dd"));
  const values = data.map((d) => d.value);

  const option = {
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: Array<{ axisValue: string; value: number }>) => {
        const p = params[0];
        const idx = params[0] ? dates.indexOf(p.axisValue) : -1;
        const change = idx >= 0 ? data[idx]?.change : 0;
        const changePercent = idx >= 0 ? data[idx]?.changePercent : 0;
        const color = change >= 0 ? "#dc2626" : "#16a34a";
        const sign = change >= 0 ? "+" : "";
        return `
          <div style="font-size:13px;">
            <div style="font-weight:600;margin-bottom:4px;">${p.axisValue}</div>
            <div>指数: <b>${p.value.toFixed(2)}</b></div>
            <div style="color:${color}">涨跌: ${sign}${change.toFixed(2)}</div>
            <div style="color:${color}">涨跌幅: ${sign}${changePercent.toFixed(2)}%</div>
          </div>
        `;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      top: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category" as const,
      data: dates,
      boundaryGap: false,
      axisLabel: {
        fontSize: 11,
        interval: "auto" as const,
      },
    },
    yAxis: {
      type: "value" as const,
      scale: true,
      axisLabel: {
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          type: "dashed" as const,
        },
      },
    },
    dataZoom: [
      {
        type: "inside" as const,
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: "综合指数",
        type: "line",
        data: values,
        smooth: true,
        symbol: "none",
        lineStyle: {
          width: 2,
          color: "#16a34a",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(22,163,74,0.3)" },
            { offset: 1, color: "rgba(22,163,74,0.02)" },
          ]),
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">综合指数走势</h2>
        <div className="flex gap-1">
          {TIME_RANGES.map((range, index) => (
            <button
              key={range.days}
              onClick={() => handleRangeChange(index)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeRange === index
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <span className="text-sm text-gray-500">加载中...</span>
          </div>
        )}
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: "100%", width: "100%" }}
          className="h-64 sm:h-96"
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </div>
  );
}

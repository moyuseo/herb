"use client";

import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface IndexDataPoint {
  date: Date;
  value: number;
  change: number;
  changePercent: number;
}

interface IndexMiniChartProps {
  data: IndexDataPoint[];
}

export default function IndexMiniChart({ data }: IndexMiniChartProps) {
  const dates = data.map((d) => {
    const dt = new Date(d.date);
    return `${dt.getMonth() + 1}/${dt.getDate()}`;
  });
  const values = data.map((d) => d.value);

  const option = {
    grid: {
      top: 20,
      right: 16,
      bottom: 24,
      left: 50,
    },
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: unknown) => {
        const p = (params as { name: string; value: number }[])[0];
        return `${p.name}<br/>指数: ${p.value.toFixed(2)}`;
      },
    },
    xAxis: {
      type: "category" as const,
      data: dates,
      axisLabel: {
        fontSize: 10,
        color: "#9ca3af",
        interval: Math.floor(dates.length / 5),
      },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value" as const,
      scale: true,
      axisLabel: {
        fontSize: 10,
        color: "#9ca3af",
        formatter: (val: number) => val.toFixed(0),
      },
      splitLine: { lineStyle: { color: "#f3f4f6" } },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        symbol: "none",
        lineStyle: {
          color: "#16a34a",
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(22,163,74,0.25)" },
            { offset: 1, color: "rgba(22,163,74,0.02)" },
          ]),
        },
      },
    ],
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: "100%", width: "100%" }}
      className="h-48 sm:h-56"
      notMerge
      lazyUpdate
    />
  );
}

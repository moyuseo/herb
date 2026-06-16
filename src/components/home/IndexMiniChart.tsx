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
      top: 16,
      right: 12,
      bottom: 20,
      left: 44,
    },
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "rgba(255,255,255,0.96)",
      borderColor: "rgba(26,107,60,0.12)",
      borderWidth: 1,
      padding: [8, 12],
      textStyle: {
        color: "#1f2937",
        fontSize: 12,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
      },
      formatter: (params: unknown) => {
        const p = (params as { name: string; value: number }[])[0];
        return `<div style="font-size:11px;color:#9ca3af;margin-bottom:2px">${p.name}</div><div style="font-size:13px;font-weight:600;color:#1a6b3c">指数 ${p.value.toFixed(2)}</div>`;
      },
      extraCssText:
        "border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.08);",
    },
    xAxis: {
      type: "category" as const,
      data: dates,
      axisLabel: {
        fontSize: 9,
        color: "#b0b8c4",
        interval: Math.floor(dates.length / 5),
        margin: 8,
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value" as const,
      scale: true,
      axisLabel: {
        fontSize: 9,
        color: "#b0b8c4",
        formatter: (val: number) => val.toFixed(0),
        margin: 8,
      },
      splitLine: {
        lineStyle: {
          color: "rgba(0,0,0,0.04)",
          type: "dashed" as const,
        },
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "line",
        data: values,
        smooth: true,
        symbol: "none",
        lineStyle: {
          color: "#1a6b3c",
          width: 2,
          cap: "round" as const,
          join: "round" as const,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(26,107,60,0.22)" },
            { offset: 0.6, color: "rgba(26,107,60,0.06)" },
            { offset: 1, color: "rgba(26,107,60,0.0)" },
          ]),
        },
      },
    ],
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: "100%", width: "100%", minHeight: "12rem" }}
      className="h-48 sm:h-56"
      notMerge
      lazyUpdate
    />
  );
}

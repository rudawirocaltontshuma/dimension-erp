"use client";

import type { ReactNode } from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatMoneyCompact, formatNumber } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-chart-1)",
  "var(--color-chart-2)",
];

interface ChartCardProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

export function ChartCard({ title, description, action, children, className }: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface SeriesDef {
  key: string;
  label: string;
  color?: string;
}

interface XyChartProps {
  readonly data: Record<string, string | number>[];
  readonly xKey: string;
  readonly series: SeriesDef[];
  readonly height?: number;
  readonly money?: boolean;
  readonly stacked?: boolean;
}

function buildConfig(series: SeriesDef[]): ChartConfig {
  return series.reduce<ChartConfig>((config, entry, index) => {
    config[entry.key] = { label: entry.label, color: entry.color ?? CHART_COLORS[index % CHART_COLORS.length] };
    return config;
  }, {});
}

const axisTick = { fontSize: 11 };

export function ErpLineChart({ data, xKey, series, height = 260, money }: XyChartProps) {
  const config = buildConfig(series);
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} tick={axisTick} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={axisTick}
          tickFormatter={(value: number) => (money ? formatMoneyCompact(value) : formatNumber(value))}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((entry) => (
          <Line
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            stroke={`var(--color-${entry.key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

export function ErpAreaChart({ data, xKey, series, height = 260, money }: XyChartProps) {
  const config = buildConfig(series);
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} tick={axisTick} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={axisTick}
          tickFormatter={(value: number) => (money ? formatMoneyCompact(value) : formatNumber(value))}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((entry) => (
          <Area
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            stroke={`var(--color-${entry.key})`}
            fill={`var(--color-${entry.key})`}
            fillOpacity={0.18}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

export function ErpBarChart({ data, xKey, series, height = 260, money, stacked }: XyChartProps) {
  const config = buildConfig(series);
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} tick={axisTick} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={64}
          tick={axisTick}
          tickFormatter={(value: number) => (money ? formatMoneyCompact(value) : formatNumber(value))}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((entry) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            radius={[4, 4, 0, 0]}
            fill={`var(--color-${entry.key})`}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

interface PieChartProps {
  readonly data: { name: string; value: number }[];
  readonly height?: number;
  readonly donut?: boolean;
}

export function ErpPieChart({ data, height = 260, donut = true }: PieChartProps) {
  const config = data.reduce<ChartConfig>((accumulator, entry, index) => {
    accumulator[entry.name] = { label: entry.name, color: CHART_COLORS[index % CHART_COLORS.length] };
    return accumulator;
  }, {});

  return (
    <ChartContainer config={config} className="mx-auto w-full" style={{ height }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={donut ? 55 : 0}
          outerRadius={92}
          paddingAngle={2}
          strokeWidth={1}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} className="flex-wrap gap-2" />
      </PieChart>
    </ChartContainer>
  );
}

interface ProgressBarProps {
  readonly label: string;
  readonly value: number;
  readonly max: number;
  readonly hint?: string;
}

export function ProgressMeter({ label, value, max, hint }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 1000) / 10);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="truncate font-medium">{label}</span>
        <span className="text-muted-foreground tabular-nums">{hint ?? `${percent}%`}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}

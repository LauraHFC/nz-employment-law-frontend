"use client";
import type { ChartConfig } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B6FC7", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316", "#0F2A5C"];

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

interface DataChartProps { chart: ChartConfig; }

export function DataChart({ chart }: DataChartProps) {
  const isMobile = useMobile();

  try {
    switch (chart.type) {

      // ── Line ────────────────────────────────────────────────────────────────
      case "line": {
        // On mobile: show fewer X-axis labels to avoid overlap
        const tickInterval = isMobile
          ? Math.ceil(chart.data.length / 4)
          : Math.ceil(chart.data.length / 8);
        return (
          <div className="chart-wrap">
            <p className="chart-title">{chart.title}</p>
            <ResponsiveContainer width="100%" height={isMobile ? 240 : 300}>
              <LineChart data={chart.data} margin={{ top: 4, right: 16, left: 0, bottom: isMobile ? 20 : 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey={chart.x_key}
                  tick={{ fontSize: isMobile ? 10 : 11 }}
                  angle={isMobile ? -30 : -35}
                  textAnchor="end"
                  interval={tickInterval}
                  height={isMobile ? 40 : 50}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 11 }}
                  unit={chart.y_label ? ` ${chart.y_label}` : ""}
                  width={isMobile ? 44 : 56}
                />
                <Tooltip formatter={(v: number, name: string) => [`${v}${chart.y_label ? " " + chart.y_label : ""}`, name]} contentStyle={{ fontSize: isMobile ? 11 : 12, padding: "6px 10px" }} itemStyle={{ padding: "1px 0" }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 12, paddingTop: 8 }} />
                {chart.y_keys.map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} dot={false} strokeWidth={2} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }

      // ── Bar / Grouped Bar ────────────────────────────────────────────────────
      case "bar":
      case "grouped_bar": {
        // On mobile: switch to horizontal layout so category labels are readable
        const manyCategories = chart.data.length > 6;
        const useHorizontal = isMobile && manyCategories;
        const seriesCount = chart.y_keys.length;
        const rowHeight = useHorizontal
          ? Math.max(44, seriesCount * 14 + 20)
          : 36;
        const dynamicHeight = useHorizontal
          ? Math.max(300, chart.data.length * rowHeight)
          : isMobile ? 240 : 300;

        if (useHorizontal) {
          return (
            <div className="chart-wrap">
              <p className="chart-title">{chart.title}</p>
              <ResponsiveContainer width="100%" height={dynamicHeight}>
                <BarChart
                  layout="vertical"
                  data={chart.data}
                  margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    unit={chart.y_label ? ` ${chart.y_label}` : ""}
                    width={44}
                  />
                  <YAxis
                    type="category"
                    dataKey={chart.x_key}
                    tick={{ fontSize: 10, width: 130 }}
                    width={130}
                    interval={0}
                  />
                  <Tooltip formatter={(v: number, name: string) => [`${v}${chart.y_label ? " " + chart.y_label : ""}`, name]} contentStyle={{ fontSize: isMobile ? 11 : 12, padding: "6px 10px" }} itemStyle={{ padding: "1px 0" }} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  {chart.y_keys.map((key, i) => (
                    <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[0, 3, 3, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        }

        // Desktop or few categories — vertical bar chart
        return (
          <div className="chart-wrap">
            <p className="chart-title">{chart.title}</p>
            <ResponsiveContainer width="100%" height={dynamicHeight}>
              <BarChart data={chart.data} margin={{ top: 4, right: 16, left: 0, bottom: isMobile ? 40 : 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey={chart.x_key}
                  tick={{ fontSize: isMobile ? 10 : 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 10 : 11 }}
                  unit={chart.y_label ? ` ${chart.y_label}` : ""}
                  width={isMobile ? 44 : 56}
                />
                <Tooltip formatter={(v: number, name: string) => [`${v}${chart.y_label ? " " + chart.y_label : ""}`, name]} contentStyle={{ fontSize: isMobile ? 11 : 12, padding: "6px 10px" }} itemStyle={{ padding: "1px 0" }} />
                <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: isMobile ? 11 : 12, paddingBottom: 8 }} />
                {chart.y_keys.map((key, i) => (
                  <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }

      // ── Pie ─────────────────────────────────────────────────────────────────
      case "pie": {
        // On mobile: hide slice labels (they overlap), rely on legend instead
        return (
          <div className="chart-wrap">
            <p className="chart-title">{chart.title}</p>
            <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey={chart.y_keys[0]}
                  nameKey={chart.x_key}
                  cx="50%" cy={isMobile ? "45%" : "50%"}
                  outerRadius={isMobile ? 80 : 110}
                  label={isMobile
                    ? false
                    : ({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={!isMobile}
                >
                  {chart.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number, name: string) => [`${v}${chart.y_label ? " " + chart.y_label : ""}`, name]} contentStyle={{ fontSize: isMobile ? 11 : 12, padding: "6px 10px" }} itemStyle={{ padding: "1px 0" }} />
                <Legend wrapperStyle={{ fontSize: isMobile ? 11 : 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      }

      default:
        return null;
    }
  } catch {
    return null; // never crash on malformed chart data
  }
}

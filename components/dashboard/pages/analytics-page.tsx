"use client";

import { useState } from "react";
import { Activity, AlertTriangle, BadgeCheck, Filter, Gauge, Info, Sparkles, Target } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dailyPerformance, equityData, strategyPerformance } from "@/data/dashboard";
import type { Range } from "../types";
import { signedMoney } from "../formatters";
import { ChartTooltip, KpiCard, Panel, PanelHeading, Pill } from "../ui";

export default function AnalyticsPage({
  range,
  onToast,
}: {
  range: Range;
  onToast: (message: string) => void;
}) {
  const [metric, setMetric] = useState<"pnl" | "winRate">("pnl");
  const sourceData =
    range === "7D"
      ? equityData.slice(-4)
      : range === "30D"
        ? equityData.slice(-10)
        : range === "90D"
          ? equityData
          : equityData.filter((_, index) => index % 2 === 0 || index === equityData.length - 1);
  const performanceData = sourceData.map((item, index) => ({
    ...item,
    winRate: 48 + index * 1.3 + (index % 3) * 2.1,
  }));
  const radarData = [
    { subject: "Risk control", value: 91 },
    { subject: "Consistency", value: 82 },
    { subject: "Execution", value: 88 },
    { subject: "Selectivity", value: 68 },
    { subject: "R:R quality", value: 76 },
    { subject: "Plan adherence", value: 86 },
  ];
  const symbolData = [
    { name: "XAUUSD", value: 42, color: "#55d6be" },
    { name: "NAS100", value: 25, color: "#7396ff" },
    { name: "EURUSD", value: 18, color: "#b190ff" },
    { name: "Others", value: 15, color: "#46515d" },
  ];
  const totalTrades = strategyPerformance.reduce((sum, item) => sum + item.trades, 0);

  return (
    <div className="page-stack">
      <div className="kpi-grid">
        <KpiCard
          label="Expectancy"
          value="$48.72"
          detail="+$12.40 vs previous period"
          trend="up"
          icon={Sparkles}
          tone="green"
        />
        <KpiCard
          label="Profit factor"
          value="1.82"
          detail="Healthy · target above 1.50"
          trend="up"
          icon={Activity}
          tone="blue"
        />
        <KpiCard label="Average R:R" value="1 : 1.46" detail="Winners are 46% larger" icon={Target} />
        <KpiCard
          label="Sharpe ratio"
          value="1.28"
          detail="+0.18 risk-adjusted return"
          trend="up"
          icon={Gauge}
          tone="amber"
        />
      </div>

      <div className="analytics-main-grid">
        <Panel className="analytics-curve">
          <PanelHeading
            title="Cumulative performance"
            subtitle="Realized P&L across all selected accounts"
            action={
              <div className="segmented-control">
                <button className={metric === "pnl" ? "active" : ""} onClick={() => setMetric("pnl")}>
                  P&L
                </button>
                <button className={metric === "winRate" ? "active" : ""} onClick={() => setMetric("winRate")}>
                  Win rate
                </button>
              </div>
            }
          />
          <div className="chart-wrap chart-wrap--medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7396ff" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#7396ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71808f"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  stroke="#71808f"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  domain={metric === "pnl" ? [24800, 27200] : [40, 80]}
                  tickFormatter={(value) =>
                    metric === "pnl" ? `$${Math.round(value / 1000)}k` : `${Math.round(value)}%`
                  }
                />
                {metric === "pnl" && <Tooltip content={<ChartTooltip />} />}
                <Area
                  type="monotone"
                  dataKey={metric === "pnl" ? "balance" : "winRate"}
                  name={metric === "pnl" ? "Balance" : "Win rate"}
                  stroke="#7396ff"
                  strokeWidth={2.2}
                  fill="url(#performanceFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-banner">
            <Sparkles size={17} />
            <div>
              <strong>Your edge is strongest between 09:30–11:30 GMT+1</strong>
              <span>Trades in this window generate 43% more expectancy with 18% less adverse excursion.</span>
            </div>
            <button onClick={() => onToast("Insight added to your journal review queue")}>
              Explore insight <span aria-hidden>→</span>
            </button>
          </div>
        </Panel>
        <Panel className="score-panel">
          <PanelHeading
            title="Trader score"
            subtitle="Compared with your last 90 days"
            action={<Pill tone="green">+6 pts</Pill>}
          />
          <div className="score-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#313c47" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8997a5", fontSize: 10 }} />
                <Radar dataKey="value" stroke="#55d6be" fill="#55d6be" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="score-center">
              <strong>84</strong>
              <small>/ 100</small>
            </div>
          </div>
          <div className="score-footer">
            <span>
              <i className="positive-dot" />
              Strongest <strong>Risk control</strong>
            </span>
            <span>
              <i className="amber-dot" />
              Focus <strong>Selectivity</strong>
            </span>
          </div>
        </Panel>
      </div>

      <div className="three-grid">
        <Panel>
          <PanelHeading title="P&L by weekday" subtitle="Net performance and trade volume" />
          <div className="chart-wrap chart-wrap--small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPerformance} margin={{ left: -20, right: 5, top: 8 }}>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8997a5", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8997a5", fontSize: 10 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip cursor={{ fill: "#18212a" }} content={<ChartTooltip />} />
                <Bar dataKey="pnl" name="P&L" radius={[5, 5, 2, 2]}>
                  {dailyPerformance.map((item) => (
                    <Cell fill={item.pnl >= 0 ? "#55d6be" : "#f36d78"} key={item.day} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mini-insight">
            <BadgeCheck size={15} />
            Friday is your highest-expectancy day.
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Market allocation" subtitle={`${totalTrades} tagged trades`} />
          <div className="donut-layout">
            <div className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={symbolData}
                    dataKey="value"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {symbolData.map((item) => (
                      <Cell fill={item.color} key={item.name} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div>
                <strong>{totalTrades}</strong>
                <small>trades</small>
              </div>
            </div>
            <div className="donut-legend">
              {symbolData.map((item) => (
                <div key={item.name}>
                  <span style={{ background: item.color }} />
                  <strong>{item.name}</strong>
                  <small>{item.value}%</small>
                </div>
              ))}
            </div>
          </div>
          <div className="mini-insight">
            <Info size={15} />
            XAUUSD contributes 54% of net profit.
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Execution quality" subtitle="MFE captured vs MAE taken" />
          <div className="execution-bars">
            <div>
              <span>Profit capture</span>
              <strong>68%</strong>
              <div>
                <i style={{ width: "68%" }} />
              </div>
              <small>Of maximum favorable excursion</small>
            </div>
            <div>
              <span>Stop efficiency</span>
              <strong>81%</strong>
              <div>
                <i style={{ width: "81%" }} />
              </div>
              <small>Stops placed beyond normal noise</small>
            </div>
            <div>
              <span>Plan adherence</span>
              <strong>86%</strong>
              <div>
                <i style={{ width: "86%" }} />
              </div>
              <small>Trades matched pre-trade plan</small>
            </div>
          </div>
          <div className="mini-insight mini-insight--amber">
            <AlertTriangle size={15} />
            Early exits cost an estimated $312.
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeading
          title="Strategy edge"
          subtitle="Performance grouped by journal setup tags"
          action={
            <button
              className="button button--secondary"
              onClick={() => onToast("Strategy columns customized")}
            >
              <Filter size={14} /> Customize
            </button>
          }
        />
        <div className="strategy-table">
          <div className="strategy-row strategy-row--head">
            <span>Setup</span>
            <span>Trades</span>
            <span>Win rate</span>
            <span>Avg. R</span>
            <span>Net P&L</span>
            <span>Edge</span>
          </div>
          {strategyPerformance.map((item, index) => (
            <div className="strategy-row" key={item.name}>
              <span>
                <i>{index + 1}</i>
                <strong>{item.name}</strong>
              </span>
              <span>{item.trades}</span>
              <span>{item.winRate}%</span>
              <span className={item.avgR >= 0 ? "positive" : "negative"}>
                {item.avgR > 0 ? "+" : ""}
                {item.avgR}R
              </span>
              <span className={item.pnl >= 0 ? "positive" : "negative"}>{signedMoney(item.pnl)}</span>
              <span>
                <Pill tone={index < 2 ? "green" : index === 2 ? "blue" : "red"}>
                  {index < 2 ? "Proven" : index === 2 ? "Developing" : "Review"}
                </Pill>
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

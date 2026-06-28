"use client";

import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Ellipsis,
  Filter,
  Gauge,
  Radio,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { calendarEvents, equityData, trades, type TradingAccount } from "@/data/dashboard";
import type { Range } from "../types";
import { money, signedMoney } from "../formatters";
import { ChartTooltip, KpiCard, Panel, PanelHeading, Pill, RuleProgress } from "../ui";
import TradeTable from "../trade-table";

export default function OverviewPage({
  account,
  range,
  onNavigate,
  onToast,
}: {
  account: TradingAccount;
  range: Range;
  onNavigate: (to: string) => void;
  onToast: (message: string) => void;
}) {
  const netProfit = account.balance - account.startingBalance;
  const targetProgress = Math.max(0, (netProfit / account.profitTarget) * 100);
  const profitRemaining = Math.max(account.profitTarget - netProfit, 0);
  const maxLossFloor = account.startingBalance - account.maxLossLimit;
  const maxLossRoom = account.equity - maxLossFloor;
  const dailyStart = account.equity - account.dailyPnL;
  const dailyFloor = dailyStart - account.dailyLossLimit;
  const dailyRoom = account.equity - dailyFloor;
  const visibleEquityData =
    range === "7D"
      ? equityData.slice(-4)
      : range === "30D"
        ? equityData.slice(-10)
        : range === "90D"
          ? equityData
          : equityData.filter((_, index) => index % 2 === 0 || index === equityData.length - 1);

  return (
    <div className="page-stack">
      <Panel className="account-hero">
        <div className="account-hero-main">
          <div className="account-hero-head">
            <div>
              <Pill tone={account.status === "Funded" ? "green" : "blue"}>
                <span className="pulse-dot" />
                {account.status} · {account.phase}
              </Pill>
              <h2>{account.label}</h2>
              <p>
                {account.program} · {account.platform} · {account.id}
              </p>
            </div>
            <button className="icon-btn" onClick={() => onToast(`${account.label} actions opened`)}>
              <Ellipsis size={19} />
            </button>
          </div>
          <div className="hero-balance">
            <span>Current equity</span>
            <strong>{money(account.equity)}</strong>
            <small className={netProfit >= 0 ? "positive" : "negative"}>
              {signedMoney(netProfit)} ({((netProfit / account.startingBalance) * 100).toFixed(2)}%) since
              start
            </small>
          </div>
        </div>
        <div className="account-hero-target">
          <div
            className="target-ring"
            style={{ "--progress": `${Math.min(targetProgress, 100) * 3.6}deg` } as React.CSSProperties}
          >
            <div>
              <strong>{Math.round(targetProgress)}%</strong>
              <small>to target</small>
            </div>
          </div>
          <div>
            <span>Profit target</span>
            <strong>{money(account.startingBalance + account.profitTarget)}</strong>
            <small>{money(profitRemaining)} remaining</small>
          </div>
          <button className="button button--soft" onClick={() => onNavigate("/dashboard/risk")}>
            Open risk center <ArrowRight size={15} />
          </button>
        </div>
      </Panel>

      <div className="kpi-grid">
        <KpiCard
          label="Net P&L"
          value={signedMoney(netProfit)}
          detail="+2.14% vs previous period"
          trend="up"
          icon={TrendingUp}
          tone="green"
        />
        <KpiCard
          label="Drawdown runway"
          value={money(maxLossRoom)}
          detail="4.8 average losses available"
          trend="neutral"
          icon={ShieldCheck}
          tone="blue"
        />
        <KpiCard label="Win rate" value="62.3%" detail="+4.1 pts over 30 days" trend="up" icon={Target} />
        <KpiCard
          label="Discipline score"
          value="86 / 100"
          detail="Top 18% of funded traders"
          trend="up"
          icon={Gauge}
          tone="amber"
        />
      </div>

      <div className="dashboard-grid">
        <Panel className="equity-panel">
          <PanelHeading
            title="Equity & risk floor"
            subtitle="Balance growth plotted against the hard breach level"
            action={
              <div className="chart-legend">
                <span>
                  <i className="legend-green" />
                  Equity
                </span>
                <span>
                  <i className="legend-blue" />
                  Balance
                </span>
                <span>
                  <i className="legend-red" />
                  Risk floor
                </span>
              </div>
            }
          />
          <div className="chart-wrap chart-wrap--large">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visibleEquityData} margin={{ top: 12, right: 8, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#55d6be" stopOpacity={0.26} />
                    <stop offset="100%" stopColor="#55d6be" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#71808f"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  stroke="#71808f"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  domain={[22000, 27500]}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#52606d", strokeDasharray: "3 3" }} />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#55d6be"
                  strokeWidth={2.2}
                  fill="url(#equityFill)"
                  name="Equity"
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#7396ff"
                  strokeWidth={1.7}
                  dot={false}
                  name="Balance"
                />
                <Line
                  type="monotone"
                  dataKey="floor"
                  stroke="#f36d78"
                  strokeWidth={1.2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Risk floor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-summary">
            <div>
              <span>Period return</span>
              <strong className="positive">+7.37%</strong>
            </div>
            <div>
              <span>Peak equity</span>
              <strong>{money(26_842.6)}</strong>
            </div>
            <div>
              <span>Max drawdown</span>
              <strong>-1.42%</strong>
            </div>
            <div>
              <span>Profit factor</span>
              <strong>1.82</strong>
            </div>
          </div>
        </Panel>

        <Panel className="rules-panel">
          <PanelHeading
            title="Rule monitor"
            subtitle="Calculated from live equity"
            action={
              <Pill tone="green">
                <Radio size={11} /> Safe
              </Pill>
            }
          />
          <div className="risk-runway-callout">
            <div className="runway-icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span>Closest rule</span>
              <strong>{money(dailyRoom)} room</strong>
              <small>Daily loss resets in 8h 32m</small>
            </div>
          </div>
          <div className="rules-list">
            <RuleProgress
              label="Daily loss"
              value={`${money(dailyRoom)} left`}
              helper={`${money(dailyFloor)} breach threshold`}
              percent={Math.max(8, (1 - dailyRoom / account.dailyLossLimit) * 100)}
              tone="green"
            />
            <RuleProgress
              label="Maximum loss"
              value={`${money(maxLossRoom)} left`}
              helper={`${money(maxLossFloor)} hard floor`}
              percent={Math.max(8, (1 - maxLossRoom / account.maxLossLimit) * 100)}
              tone="blue"
            />
            <RuleProgress
              label="Profit target"
              value={`${Math.round(targetProgress)}% complete`}
              helper={`${money(profitRemaining)} still required`}
              percent={targetProgress}
              tone="amber"
            />
          </div>
          <button className="text-button" onClick={() => onNavigate("/dashboard/risk")}>
            See calculation details <ChevronRight size={15} />
          </button>
        </Panel>
      </div>

      <div className="dashboard-grid dashboard-grid--lower">
        <Panel className="trades-panel">
          <PanelHeading
            title="Recent trades"
            subtitle="Execution quality and realized results"
            action={
              <button className="text-button" onClick={() => onNavigate("/dashboard/journal")}>
                Full journal <ArrowRight size={14} />
              </button>
            }
          />
          <TradeTable items={trades.slice(0, 4)} compact onInspect={() => onNavigate("/dashboard/journal")} />
        </Panel>
        <Panel className="calendar-panel">
          <PanelHeading
            title="Today’s market risk"
            subtitle="Africa/Douala · GMT+1"
            action={
              <button
                className="icon-btn"
                onClick={() => onNavigate("/dashboard/calendar")}
                aria-label="Filter calendar"
              >
                <Filter size={16} />
              </button>
            }
          />
          <div className="event-warning">
            <AlertTriangle size={16} />
            Restricted window begins in 27 minutes
          </div>
          <div className="event-list">
            {calendarEvents.slice(0, 3).map((event) => (
              <div className="event-row" key={event.event}>
                <div className="event-time">
                  <strong>{event.time}</strong>
                  <small>GMT+1</small>
                </div>
                <span className={`impact-dot impact-dot--${event.impact.toLowerCase()}`} />
                <div>
                  <strong>{event.event}</strong>
                  <small>
                    {event.currency} · {event.impact} impact
                  </small>
                </div>
              </div>
            ))}
          </div>
          <button
            className="button button--secondary button--full"
            onClick={() => onNavigate("/dashboard/calendar")}
          >
            View full calendar <CalendarDays size={15} />
          </button>
        </Panel>
      </div>
    </div>
  );
}

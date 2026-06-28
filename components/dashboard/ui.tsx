"use client";

import clsx from "clsx";
import { Activity, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { money } from "./formatters";

export function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <div className={clsx("brand", small && "brand--small")}>
      <span className="brand-mark">
        <span />
        <span />
        <span />
      </span>
      {!small && (
        <span>
          <strong>NOVA</strong>
          <small>TRADER OS</small>
        </span>
      )}
    </div>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={clsx("panel", className)}>{children}</section>;
}

export function PanelHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  detail,
  trend,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  detail: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon | typeof Activity;
  tone?: "default" | "green" | "amber" | "blue";
}) {
  return (
    <article className={clsx("kpi-card", `kpi-card--${tone}`)}>
      <div className="kpi-top">
        <span>{label}</span>
        <span className="kpi-icon">
          <Icon size={17} />
        </span>
      </div>
      <strong>{value}</strong>
      <div className={clsx("kpi-detail", trend && `kpi-detail--${trend}`)}>
        {trend === "up" && <ArrowUpRight size={14} />}
        {trend === "down" && <ArrowDownLeft size={14} />}
        {detail}
      </div>
    </article>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "amber" | "blue" | "neutral" | "violet";
}) {
  return <span className={clsx("pill", `pill--${tone}`)}>{children}</span>;
}

export function RuleProgress({
  label,
  value,
  helper,
  percent,
  tone = "green",
}: {
  label: string;
  value: string;
  helper: string;
  percent: number;
  tone?: "green" | "amber" | "blue";
}) {
  return (
    <div className="rule-progress">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <span
          className={`progress-fill progress-fill--${tone}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <small>{helper}</small>
    </div>
  );
}

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p>{label}</p>
      {payload.map((item) => (
        <div key={item.name}>
          <span style={{ background: item.color }} />
          <small>{item.name}</small>
          <strong>{money(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}

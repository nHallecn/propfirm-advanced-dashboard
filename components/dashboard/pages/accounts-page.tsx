"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  BriefcaseBusiness,
  Clock3,
  Ellipsis,
  Eye,
  KeyRound,
  ListFilter,
  Plus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { accounts } from "@/data/dashboard";
import type { AppDialog } from "../types";
import { money, signedMoney } from "../formatters";
import { KpiCard, Panel, Pill, RuleProgress } from "../ui";

export default function AccountsPage({
  accountId,
  onSelect,
  onToast,
  onDialog,
}: {
  accountId: string;
  onSelect: (id: string) => void;
  onToast: (message: string) => void;
  onDialog: (dialog: AppDialog) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [reverseOrder, setReverseOrder] = useState(false);
  const visible = accounts.filter((account) => filter === "All" || account.status === filter);
  const orderedAccounts = reverseOrder ? [...visible].reverse() : visible;
  const totalCapital = accounts
    .filter((account) => account.status === "Funded")
    .reduce((sum, account) => sum + account.startingBalance, 0);
  const totalPnL = accounts.reduce((sum, account) => sum + account.balance - account.startingBalance, 0);

  return (
    <div className="page-stack">
      <div className="kpi-grid kpi-grid--accounts">
        <KpiCard
          label="Funded capital"
          value={money(totalCapital, true)}
          detail="Across 2 funded accounts"
          icon={BriefcaseBusiness}
          tone="blue"
        />
        <KpiCard
          label="Portfolio P&L"
          value={signedMoney(totalPnL)}
          detail="+1.62% this month"
          trend="up"
          icon={TrendingUp}
          tone="green"
        />
        <KpiCard
          label="Next payout"
          value="2 days"
          detail="$3,857 currently eligible"
          icon={Clock3}
          tone="amber"
        />
        <KpiCard
          label="Account health"
          value="3 / 4 safe"
          detail="1 account needs attention"
          icon={ShieldCheck}
        />
      </div>
      <Panel>
        <div className="filter-toolbar">
          <div className="filter-tabs">
            {["All", "Funded", "Evaluation", "Passed"].map((item) => (
              <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>
                {item}
                <small>
                  {item === "All"
                    ? accounts.length
                    : accounts.filter((account) => account.status === item).length}
                </small>
              </button>
            ))}
          </div>
          <div className="toolbar-actions">
            <button
              className="button button--secondary"
              onClick={() => {
                setReverseOrder((value) => !value);
                onToast(reverseOrder ? "Accounts sorted newest first" : "Accounts sorted oldest first");
              }}
            >
              <ListFilter size={15} /> Reverse order
            </button>
            <button
              className="button button--primary"
              onClick={() =>
                onDialog({
                  title: "Connect a trading account",
                  description:
                    "Select a supported platform and add read-only credentials. NOVA will import history and rule parameters automatically.",
                  detail: "Supported: MT4, MT5, cTrader and DXtrade",
                  actionLabel: "Begin connection",
                })
              }
            >
              <Plus size={15} /> Add account
            </button>
          </div>
        </div>
        <div className="account-card-grid">
          {orderedAccounts.map((account) => {
            const profit = account.balance - account.startingBalance;
            const progress = (profit / account.profitTarget) * 100;
            const floor = account.startingBalance - account.maxLossLimit;
            const room = account.equity - floor;
            return (
              <article
                className={clsx("account-card", account.id === accountId && "account-card--selected")}
                key={account.id}
              >
                <div className="account-card-top">
                  <span className={clsx("account-avatar", `account-avatar--${account.status.toLowerCase()}`)}>
                    {account.startingBalance / 1000}k
                  </span>
                  <div>
                    <strong>{account.label}</strong>
                    <small>
                      {account.program} · {account.id}
                    </small>
                  </div>
                  <Pill
                    tone={
                      account.status === "Funded" ? "green" : account.status === "Passed" ? "violet" : "blue"
                    }
                  >
                    {account.status}
                  </Pill>
                </div>
                <div className="account-card-balance">
                  <span>Balance</span>
                  <strong>{money(account.balance)}</strong>
                  <small className={profit >= 0 ? "positive" : "negative"}>
                    {signedMoney(profit)} total P&L
                  </small>
                </div>
                <div className="account-card-stats">
                  <div>
                    <span>Equity</span>
                    <strong>{money(account.equity)}</strong>
                  </div>
                  <div>
                    <span>Today</span>
                    <strong className={account.dailyPnL >= 0 ? "positive" : "negative"}>
                      {signedMoney(account.dailyPnL)}
                    </strong>
                  </div>
                  <div>
                    <span>Risk room</span>
                    <strong>{money(room)}</strong>
                  </div>
                </div>
                <RuleProgress
                  label={account.status === "Funded" ? "Payout progress" : "Profit target"}
                  value={`${Math.max(0, Math.round(progress))}%`}
                  helper={`${money(Math.max(account.profitTarget - profit, 0))} remaining`}
                  percent={Math.max(0, progress)}
                  tone={account.status === "Funded" ? "green" : "blue"}
                />
                <div className="account-card-actions">
                  <button
                    className="button button--primary"
                    onClick={() => {
                      onSelect(account.id);
                      onToast(`${account.label} selected`);
                    }}
                  >
                    <Eye size={15} /> View dashboard
                  </button>
                  <button
                    className="button button--secondary"
                    onClick={() => {
                      void navigator.clipboard?.writeText(
                        `Login: ${account.login}\nServer: ${account.server}`,
                      );
                      onToast("Credentials copied securely");
                    }}
                  >
                    <KeyRound size={15} /> Credentials
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() =>
                      onDialog({
                        title: `Manage ${account.label}`,
                        description:
                          "Rename this account, refresh its rule template, or disconnect the read-only synchronization.",
                        detail: `${account.platform} · ${account.server}`,
                        actionLabel: "Refresh account",
                      })
                    }
                    aria-label={`Manage ${account.label}`}
                  >
                    <Ellipsis size={17} />
                  </button>
                </div>
              </article>
            );
          })}
          <button
            className="add-account-card"
            onClick={() =>
              onDialog({
                title: "Connect another account",
                description: "Bring every prop account into one risk and analytics workspace.",
                detail: "Read-only access · encrypted at rest",
                actionLabel: "Choose platform",
              })
            }
          >
            <span>
              <Plus size={21} />
            </span>
            <strong>Connect another account</strong>
            <small>MT4, MT5, cTrader, DXtrade & more</small>
          </button>
        </div>
      </Panel>
    </div>
  );
}

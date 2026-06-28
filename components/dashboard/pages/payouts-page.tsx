"use client";

import { useState } from "react";
import { ArrowRight, Check, CheckCircle2, Clock3, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyPnL, payoutHistory } from "@/data/dashboard";
import { money } from "../formatters";
import { ChartTooltip, Panel, PanelHeading, Pill } from "../ui";

export default function PayoutsPage({ onToast }: { onToast: (message: string) => void }) {
  const [selected, setSelected] = useState("Funded $100K");
  const [scheduled, setScheduled] = useState(false);
  const eligible = selected === "Funded $100K" ? 3857.22 : 2284.4;
  const downloadStatements = () => {
    const rows = [
      "Request,Requested,Account,Gross amount,Split,Method,Status,Completed",
      ...payoutHistory.map((item) =>
        [
          item.id,
          item.requested,
          item.account,
          item.amount,
          item.split,
          item.method,
          item.status,
          item.completed,
        ]
          .map((value) => `"${value}"`)
          .join(","),
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nova-payout-statements.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    onToast("Payout statements downloaded");
  };

  return (
    <div className="page-stack">
      <Panel className="payout-hero">
        <div className="payout-hero-content">
          <Pill tone="green">
            <CheckCircle2 size={12} /> Eligible in 2 days
          </Pill>
          <h2>{money(eligible)}</h2>
          <p>Estimated amount available after your 90% profit split.</p>
          <div className="payout-account-select">
            <span>From</span>
            <select value={selected} onChange={(event) => setSelected(event.target.value)}>
              <option>Funded $100K</option>
              <option>Swing $50K</option>
            </select>
          </div>
          <button
            className="button button--primary"
            disabled={scheduled}
            onClick={() => {
              setScheduled(true);
              onToast("Payout request scheduled for June 30");
            }}
          >
            {scheduled ? (
              <>
                <Check size={15} /> Payout scheduled
              </>
            ) : (
              <>
                Schedule payout <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
        <div className="payout-readiness">
          <div className="readiness-ring">
            <div>
              <strong>92%</strong>
              <small>ready</small>
            </div>
          </div>
          <div className="eligibility-list">
            <div>
              <CheckCircle2 size={16} />
              <span>
                <strong>Minimum trading days</strong>
                <small>8 of 5 completed</small>
              </span>
            </div>
            <div>
              <CheckCircle2 size={16} />
              <span>
                <strong>Consistency</strong>
                <small>Best day is 21.8% of profit</small>
              </span>
            </div>
            <div>
              <Clock3 size={16} />
              <span>
                <strong>Payout cycle</strong>
                <small>Unlocks Jun 30 at 08:00</small>
              </span>
            </div>
          </div>
        </div>
      </Panel>
      <div className="payout-grid">
        <Panel>
          <PanelHeading
            title="Lifetime rewards"
            subtitle="Net payouts received"
            action={<Pill tone="green">3 paid</Pill>}
          />
          <div className="lifetime-value">
            <strong>{money(6029)}</strong>
            <span>+$2,840 in the last 30 days</span>
          </div>
          <div className="chart-wrap chart-wrap--small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPnL} margin={{ left: -25, right: 0, top: 10 }}>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8997a5", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8997a5", fontSize: 10 }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip cursor={{ fill: "#18212a" }} content={<ChartTooltip />} />
                <Bar dataKey="pnl" name="Payout" fill="#55d6be" radius={[5, 5, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHeading
            title="Scaling path"
            subtitle="Grow allocation through consistency"
            action={<Pill tone="blue">Level 2</Pill>}
          />
          <div className="scaling-track">
            <div className="scale-level complete">
              <span>
                <Check size={15} />
              </span>
              <div>
                <strong>$100K</strong>
                <small>Current allocation</small>
              </div>
            </div>
            <i className="complete" />
            <div className="scale-level active">
              <span>2</span>
              <div>
                <strong>$125K</strong>
                <small>+$8K profit required</small>
              </div>
            </div>
            <i />
            <div className="scale-level">
              <span>3</span>
              <div>
                <strong>$150K</strong>
                <small>Next milestone</small>
              </div>
            </div>
          </div>
          <div className="scale-progress">
            <div>
              <span>Progress to $125K</span>
              <strong>54%</strong>
            </div>
            <div className="progress-track">
              <span className="progress-fill progress-fill--blue" style={{ width: "54%" }} />
            </div>
            <small>$3,714 more net profit · minimum 2 months</small>
          </div>
        </Panel>
      </div>
      <Panel>
        <PanelHeading
          title="Payout history"
          subtitle="Every request, status change, and settlement"
          action={
            <button className="button button--secondary" onClick={downloadStatements}>
              <Download size={15} /> Statements
            </button>
          }
        />
        <div className="payout-table">
          <div className="payout-row payout-row--head">
            <span>Request</span>
            <span>Account</span>
            <span>Gross amount</span>
            <span>Split</span>
            <span>Method</span>
            <span>Status</span>
            <span>Completed</span>
          </div>
          {payoutHistory.map((item) => (
            <div className="payout-row" key={item.id}>
              <span>
                <strong>{item.id}</strong>
                <small>{item.requested}</small>
              </span>
              <span>{item.account}</span>
              <span>
                <strong>{money(item.amount)}</strong>
              </span>
              <span>{item.split}</span>
              <span>{item.method}</span>
              <span>
                <Pill tone="green">
                  <Check size={11} /> {item.status}
                </Pill>
              </span>
              <span>{item.completed}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

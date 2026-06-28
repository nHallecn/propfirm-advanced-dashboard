"use client";

import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  Filter,
  Search,
  Sparkles,
  TimerReset,
  TrendingDown,
  X,
} from "lucide-react";
import { trades, type Trade } from "@/data/dashboard";
import { formatNumber, signedMoney } from "../formatters";
import { Panel, PanelHeading, Pill } from "../ui";
import TradeTable from "../trade-table";

export default function JournalPage({
  onExport,
  onToast,
}: {
  onExport: () => void;
  onToast: (message: string) => void;
}) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("All");
  const filtered = trades.filter((trade) => {
    const matchesQuery = `${trade.symbol} ${trade.setup}`.toLowerCase().includes(query.toLowerCase());
    const matchesResult = result === "All" || (result === "Wins" ? trade.pnl > 0 : trade.pnl < 0);
    return matchesQuery && matchesResult;
  });

  return (
    <div className="page-stack">
      <Panel className="journal-summary">
        <div className="journal-summary-main">
          <div className="summary-score">
            <span>86</span>
            <small>Discipline</small>
          </div>
          <div>
            <span>Review streak</span>
            <strong>12 trading days</strong>
            <small>You have reviewed 94% of closed trades this month.</small>
          </div>
        </div>
        <div className="journal-summary-stats">
          <div>
            <span>Trades logged</span>
            <strong>61</strong>
            <small>30-day period</small>
          </div>
          <div>
            <span>Plan adherence</span>
            <strong>86%</strong>
            <small className="positive">+9% improvement</small>
          </div>
          <div>
            <span>Best setup</span>
            <strong>Liquidity sweep</strong>
            <small>+1.64R expectancy</small>
          </div>
          <div>
            <span>Cost of mistakes</span>
            <strong className="negative">-$412</strong>
            <small>4 off-plan trades</small>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="journal-toolbar">
          <label className="search-field">
            <Search size={16} />
            <input
              placeholder="Search market or setup…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <div className="filter-tabs filter-tabs--small">
            {["All", "Wins", "Losses"].map((item) => (
              <button className={result === item ? "active" : ""} onClick={() => setResult(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
          <button
            className="button button--secondary"
            onClick={() => onToast("Date range changed to the current 30-day period")}
          >
            <CalendarDays size={15} /> Jun 01 – Jun 28
          </button>
          <button
            className="button button--secondary"
            onClick={() => onToast("Advanced journal filters opened")}
          >
            <Filter size={15} /> More filters
          </button>
          <button className="button button--secondary" onClick={onExport}>
            <Download size={15} /> CSV
          </button>
        </div>
        <TradeTable items={filtered} onInspect={setSelectedTrade} />
      </Panel>

      <div className="journal-grid">
        <Panel>
          <PanelHeading
            title="Behavior pattern"
            subtitle="Detected across your last 30 sessions"
            action={
              <Pill tone="violet">
                <Sparkles size={12} /> AI insight
              </Pill>
            }
          />
          <div className="behavior-card">
            <div className="behavior-icon">
              <TimerReset size={21} />
            </div>
            <div>
              <strong>Your second trade after a loss is the danger zone.</strong>
              <p>
                You take 37% more size and enter 2.4× faster than usual. These trades generated{" "}
                <span className="negative">-$286</span> this month.
              </p>
              <div className="behavior-actions">
                <button
                  className="button button--primary"
                  onClick={() => onToast("Post-loss cooldown added to your risk plan")}
                >
                  Add 15-min cooldown
                </button>
                <button
                  className="text-button"
                  onClick={() => {
                    setResult("Losses");
                    setQuery("");
                  }}
                >
                  View matching trades <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Review queue" subtitle="Trades that need context" />
          <div className="review-queue">
            {trades
              .filter((trade) => !trade.followedPlan)
              .map((trade) => (
                <button key={trade.id} onClick={() => setSelectedTrade(trade)}>
                  <span className="market-short">
                    <TrendingDown size={15} />
                  </span>
                  <div>
                    <strong>
                      {trade.symbol} · {trade.setup}
                    </strong>
                    <small>
                      {trade.opened} · {signedMoney(trade.pnl)}
                    </small>
                  </div>
                  <Pill tone="amber">Review</Pill>
                  <ChevronRight size={15} />
                </button>
              ))}
          </div>
        </Panel>
      </div>
      {selectedTrade && (
        <TradeDrawer
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onSave={() => {
            setSelectedTrade(null);
            onToast("Journal review saved");
          }}
        />
      )}
    </div>
  );
}

function TradeDrawer({ trade, onClose, onSave }: { trade: Trade; onClose: () => void; onSave: () => void }) {
  const [emotion, setEmotion] = useState(trade.emotion);
  const [followedPlan, setFollowedPlan] = useState(trade.followedPlan);
  return (
    <>
      <button className="drawer-scrim" aria-label="Close trade" onClick={onClose} />
      <aside className="trade-drawer">
        <div className="drawer-head">
          <div>
            <Pill tone={trade.pnl >= 0 ? "green" : "red"}>{signedMoney(trade.pnl)}</Pill>
            <h2>
              {trade.symbol} · {trade.side}
            </h2>
            <p>
              {trade.opened} → {trade.closed}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="trade-detail-chart">
          <div className="fake-candles">
            {[42, 56, 35, 61, 48, 72, 64, 83, 68, 52, 44, 35, 30, 24, 18].map((height, index) => (
              <i className={index > 7 ? "down" : ""} style={{ height: `${height}%` }} key={index}>
                <span />
              </i>
            ))}
          </div>
          <span className="chart-entry">Entry {formatNumber(trade.entry, 2)}</span>
          <span className="chart-stop">Stop {formatNumber(trade.stop, 2)}</span>
        </div>
        <div className="drawer-metrics">
          <div>
            <span>Result</span>
            <strong className={trade.pnl >= 0 ? "positive" : "negative"}>{trade.resultR.toFixed(2)}R</strong>
          </div>
          <div>
            <span>MFE</span>
            <strong>{trade.mfe.toFixed(2)}R</strong>
          </div>
          <div>
            <span>MAE</span>
            <strong>{trade.mae.toFixed(2)}R</strong>
          </div>
          <div>
            <span>Duration</span>
            <strong>33 min</strong>
          </div>
        </div>
        <label className="drawer-field">
          <span>Trade plan</span>
          <textarea defaultValue={trade.plan} />
        </label>
        <label className="drawer-field">
          <span>Review note</span>
          <textarea defaultValue={trade.note} />
        </label>
        <div className="drawer-field">
          <span>Emotional state</span>
          <div className="emotion-picker">
            {(["Focused", "Patient", "Rushed", "Confident"] as const).map((item) => (
              <button
                className={emotion === item ? "active" : ""}
                onClick={() => setEmotion(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <label className="check-row">
          <input
            type="checkbox"
            checked={followedPlan}
            onChange={(event) => setFollowedPlan(event.target.checked)}
          />
          <span>
            <Check size={14} />
          </span>{" "}
          I followed my trading plan
        </label>
        <div className="drawer-actions">
          <button className="button button--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button button--primary" onClick={onSave}>
            Save review
          </button>
        </div>
      </aside>
    </>
  );
}

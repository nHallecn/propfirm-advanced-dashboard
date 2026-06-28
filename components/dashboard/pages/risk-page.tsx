"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Bot,
  Check,
  ChevronDown,
  Info,
  Lock,
  Radio,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { TradingAccount } from "@/data/dashboard";
import { money } from "../formatters";
import { Panel, PanelHeading, Pill } from "../ui";

export default function RiskPage({
  account,
  onToast,
}: {
  account: TradingAccount;
  onToast: (message: string) => void;
}) {
  const instruments = [
    { symbol: "XAUUSD", name: "Gold / US Dollar", entry: 2332.4 },
    { symbol: "NAS100", name: "Nasdaq 100", entry: 19_884.2 },
    { symbol: "EURUSD", name: "Euro / US Dollar", entry: 1.1672 },
  ];
  const [instrumentIndex, setInstrumentIndex] = useState(0);
  const [direction, setDirection] = useState<"Long" | "Short">("Long");
  const [riskPercent, setRiskPercent] = useState(0.5);
  const [stopDistance, setStopDistance] = useState(35);
  const [entry, setEntry] = useState(2332.4);
  const [maxTrades, setMaxTrades] = useState(4);
  const [dailyLoss, setDailyLoss] = useState(600);
  const [profitLock, setProfitLock] = useState(900);
  const [cooldown, setCooldown] = useState(true);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);
  const instrument = instruments[instrumentIndex];
  const riskAmount = account.equity * (riskPercent / 100);
  const lotSize = riskAmount / (stopDistance * 10);
  const currentRoom = account.equity - (account.startingBalance - account.maxLossLimit);
  const runwayAfter = currentRoom - riskAmount;
  const isSafe = riskAmount < currentRoom * 0.25 && riskAmount < account.dailyLossLimit * 0.25;

  return (
    <div className="page-stack">
      <div className="risk-status-banner">
        <div className="risk-status-icon">
          <ShieldCheck size={27} />
        </div>
        <div>
          <Pill tone="green">
            <Radio size={11} /> All systems normal
          </Pill>
          <h2>You have {money(currentRoom)} of maximum-loss runway</h2>
          <p>
            At your current average loss of $214, that is roughly{" "}
            <strong>{(currentRoom / 214).toFixed(1)} full-risk attempts</strong>.
          </p>
        </div>
        <div className="risk-status-stats">
          <div>
            <span>Daily room</span>
            <strong>{money(1611.4)}</strong>
          </div>
          <div>
            <span>Open risk</span>
            <strong>{money(198)}</strong>
          </div>
          <div>
            <span>Risk reset</span>
            <strong>8h 32m</strong>
          </div>
        </div>
      </div>

      <div className="risk-layout">
        <Panel className="trade-guard">
          <PanelHeading
            title="Pre-trade guard"
            subtitle="Simulate the next position against every account rule"
            action={
              <Pill tone="blue">
                <Bot size={12} /> Live calculator
              </Pill>
            }
          />
          <div className="trade-form">
            <label className="form-field">
              <span>Instrument</span>
              <button
                className="select-control"
                onClick={() => {
                  const nextIndex = (instrumentIndex + 1) % instruments.length;
                  setInstrumentIndex(nextIndex);
                  setEntry(instruments[nextIndex].entry);
                }}
              >
                <strong>{instrument.symbol}</strong>
                <small>{instrument.name}</small>
                <ChevronDown size={15} />
              </button>
            </label>
            <label className="form-field">
              <span>Direction</span>
              <span className="direction-toggle">
                <button className={direction === "Long" ? "active" : ""} onClick={() => setDirection("Long")}>
                  <TrendingUp size={15} /> Long
                </button>
                <button
                  className={direction === "Short" ? "active" : ""}
                  onClick={() => setDirection("Short")}
                >
                  <TrendingDown size={15} /> Short
                </button>
              </span>
            </label>
            <label className="form-field">
              <span>Entry price</span>
              <span className="input-suffix">
                <input
                  type="number"
                  value={entry}
                  onChange={(event) => setEntry(Number(event.target.value))}
                />
                <small>USD</small>
              </span>
            </label>
            <label className="form-field">
              <span>Stop distance</span>
              <span className="input-suffix">
                <input
                  type="number"
                  value={stopDistance}
                  onChange={(event) => setStopDistance(Number(event.target.value))}
                />
                <small>pips</small>
              </span>
            </label>
            <label className="form-field form-field--full">
              <span>
                Risk per trade <strong>{riskPercent.toFixed(2)}%</strong>
              </span>
              <input
                className="risk-slider"
                type="range"
                min="0.1"
                max="2"
                step="0.05"
                value={riskPercent}
                onChange={(event) => setRiskPercent(Number(event.target.value))}
                style={{ "--slider": `${(riskPercent / 2) * 100}%` } as React.CSSProperties}
              />
              <div className="slider-labels">
                <span>0.1%</span>
                <span>Personal max 1%</span>
                <span>2%</span>
              </div>
            </label>
          </div>
          <div className="calculator-result">
            <div>
              <span>Suggested size</span>
              <strong>{lotSize.toFixed(2)} lots</strong>
            </div>
            <div>
              <span>Cash at risk</span>
              <strong>{money(riskAmount)}</strong>
            </div>
            <div>
              <span>Stop price</span>
              <strong>{(entry + ((direction === "Long" ? -1 : 1) * stopDistance) / 10).toFixed(2)}</strong>
            </div>
            <div>
              <span>Runway after loss</span>
              <strong>{money(runwayAfter)}</strong>
            </div>
          </div>
          <div className={clsx("trade-verdict", !isSafe && "trade-verdict--warning")}>
            {isSafe ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
            <div>
              <strong>
                {isSafe ? "This trade fits your risk plan" : "This trade is too large for the current runway"}
              </strong>
              <span>
                {isSafe
                  ? `A full loss uses ${((riskAmount / currentRoom) * 100).toFixed(1)}% of your remaining drawdown room.`
                  : "Reduce size until a full stop uses less than 25% of remaining drawdown."}
              </span>
            </div>
            <Pill tone={isSafe ? "green" : "amber"}>{isSafe ? "Approved" : "Resize"}</Pill>
          </div>
        </Panel>

        <Panel className="risk-limits">
          <PanelHeading
            title="Personal circuit breakers"
            subtitle="Hard limits protect you from tilt"
            action={<Lock size={16} />}
          />
          <div className="limit-control">
            <div>
              <span>Daily loss stop</span>
              <small>Flatten and block new orders</small>
            </div>
            <span className="input-prefix">
              <small>$</small>
              <input
                type="number"
                value={dailyLoss}
                onChange={(event) => setDailyLoss(Number(event.target.value))}
              />
            </span>
          </div>
          <div className="limit-control">
            <div>
              <span>Daily profit lock</span>
              <small>Protect the green day</small>
            </div>
            <span className="input-prefix">
              <small>$</small>
              <input
                type="number"
                value={profitLock}
                onChange={(event) => setProfitLock(Number(event.target.value))}
              />
            </span>
          </div>
          <div className="limit-control">
            <div>
              <span>Maximum trades</span>
              <small>Entries allowed per session</small>
            </div>
            <span className="stepper">
              <button onClick={() => setMaxTrades(Math.max(1, maxTrades - 1))}>−</button>
              <strong>{maxTrades}</strong>
              <button onClick={() => setMaxTrades(maxTrades + 1)}>+</button>
            </span>
          </div>
          <div className="limit-control">
            <div>
              <span>Loss cooldown</span>
              <small>Pause after 2 consecutive losses</small>
            </div>
            <button
              className={clsx("toggle", cooldown && "active")}
              onClick={() => setCooldown((value) => !value)}
              aria-label="Toggle cooldown"
              aria-pressed={cooldown}
            >
              <span />
            </button>
          </div>
          <div className="lock-notice">
            <Info size={15} />
            Once locked, these settings cannot change until 17:00 CT.
          </div>
          <button
            className="button button--primary button--full"
            onClick={() => onToast("Circuit breakers locked for this session")}
          >
            <Lock size={15} /> Lock for this session
          </button>
        </Panel>
      </div>

      <div className="risk-bottom-grid">
        <Panel>
          <PanelHeading
            title="Rule engine"
            subtitle="Transparent calculations—no hidden thresholds"
            action={<Pill tone="green">3 / 3 safe</Pill>}
          />
          <div className="rule-engine">
            <RuleRow
              title="Daily loss limit"
              note="Resets at 00:00 CE(S)T using starting equity"
              firstLabel="Threshold"
              firstValue="$25,206.40"
              secondLabel="Current"
              secondValue="$26,817.20"
              pill="$1,610.80 room"
              id="daily"
              expanded={expandedRule}
              onExpand={setExpandedRule}
            />
            <RuleRow
              title="Maximum loss"
              note="Static · calculated from initial balance"
              firstLabel="Threshold"
              firstValue="$22,500.00"
              secondLabel="Current"
              secondValue="$26,817.20"
              pill="$4,317.20 room"
              id="maximum"
              expanded={expandedRule}
              onExpand={setExpandedRule}
            />
            <RuleRow
              title="Consistency objective"
              note="Best day must remain below 40% of net profit"
              firstLabel="Limit"
              firstValue="40.0%"
              secondLabel="Current"
              secondValue="21.8%"
              pill="18.2% buffer"
              id="consistency"
              expanded={expandedRule}
              onExpand={setExpandedRule}
            />
            {expandedRule && (
              <div className="rule-detail">
                <Info size={15} />
                <div>
                  <strong>
                    {expandedRule === "daily"
                      ? "Daily loss uses the higher of balance or equity"
                      : expandedRule === "maximum"
                        ? "Maximum loss is static for this program"
                        : "Consistency updates after each closed trading day"}
                  </strong>
                  <span>
                    {expandedRule === "daily"
                      ? "Open P&L, commissions and swaps are included. The baseline resets at midnight CE(S)T."
                      : expandedRule === "maximum"
                        ? "The $22,500 floor never trails upward, so realized profit increases your usable runway."
                        : "Your largest profitable day is divided by current net profit. Keep the result below 40%."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Panel>
        <Panel className="risk-forecast">
          <PanelHeading title="Runway forecast" subtitle="If your current risk stays constant" />
          <div className="runway-visual">
            <div className="runway-track">
              <i style={{ left: "66%" }} />
              <span className="runway-start">
                <small>Risk floor</small>
                <strong>$22.5K</strong>
              </span>
              <span className="runway-now">
                <small>Now</small>
                <strong>$26.8K</strong>
              </span>
            </div>
            <div className="runway-attempts">
              <strong>20.2</strong>
              <span>average losses before breach</span>
            </div>
          </div>
          <div className="scenario-list">
            <div>
              <span>At 0.25% risk</span>
              <strong>64 attempts</strong>
              <Pill tone="green">Conservative</Pill>
            </div>
            <div>
              <span>At 0.50% risk</span>
              <strong>32 attempts</strong>
              <Pill tone="blue">Your plan</Pill>
            </div>
            <div>
              <span>At 1.00% risk</span>
              <strong>16 attempts</strong>
              <Pill tone="amber">Elevated</Pill>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function RuleRow({
  title,
  note,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
  pill,
  id,
  expanded,
  onExpand,
}: {
  title: string;
  note: string;
  firstLabel: string;
  firstValue: string;
  secondLabel: string;
  secondValue: string;
  pill: string;
  id: string;
  expanded: string | null;
  onExpand: (id: string | null) => void;
}) {
  const isExpanded = expanded === id;
  return (
    <div className="rule-engine-row">
      <span className="rule-state rule-state--safe">
        <Check size={15} />
      </span>
      <div>
        <strong>{title}</strong>
        <small>{note}</small>
      </div>
      <div>
        <span>{firstLabel}</span>
        <strong>{firstValue}</strong>
      </div>
      <div>
        <span>{secondLabel}</span>
        <strong>{secondValue}</strong>
      </div>
      <Pill tone="green">{pill}</Pill>
      <button
        className="icon-btn icon-btn--small"
        onClick={() => onExpand(isExpanded ? null : id)}
        aria-label={`Explain ${title}`}
        aria-expanded={isExpanded}
      >
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

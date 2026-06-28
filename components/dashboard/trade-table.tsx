"use client";

import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import type { Trade } from "@/data/dashboard";
import { signedMoney } from "./formatters";
import { Pill } from "./ui";
import clsx from "clsx";

export default function TradeTable({
  items,
  compact = false,
  onInspect,
}: {
  items: Trade[];
  compact?: boolean;
  onInspect: (trade: Trade) => void;
}) {
  return (
    <div className="table-scroll">
      <table className={clsx("data-table", compact && "data-table--compact")}>
        <thead>
          <tr>
            <th>Market</th>
            <th>Setup</th>
            <th>Opened</th>
            <th>Result</th>
            <th>R multiple</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((trade) => (
            <tr key={trade.id}>
              <td>
                <div className="market-cell">
                  <span className={trade.side === "Long" ? "market-long" : "market-short"}>
                    {trade.side === "Long" ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                  </span>
                  <span>
                    <strong>{trade.symbol}</strong>
                    <small>
                      {trade.side} · {trade.lots} lots
                    </small>
                  </span>
                </div>
              </td>
              <td>
                <strong className="table-primary">{trade.setup}</strong>
                <small className="table-secondary">{trade.session}</small>
              </td>
              <td>
                <strong className="table-primary">{trade.opened.split(" · ")[0]}</strong>
                <small className="table-secondary">{trade.opened.split(" · ")[1]}</small>
              </td>
              <td>
                <strong className={trade.pnl >= 0 ? "positive" : "negative"}>{signedMoney(trade.pnl)}</strong>
              </td>
              <td>
                <Pill tone={trade.resultR >= 0 ? "green" : "red"}>
                  {trade.resultR > 0 ? "+" : ""}
                  {trade.resultR.toFixed(2)}R
                </Pill>
              </td>
              <td>
                <button
                  className="icon-btn icon-btn--small"
                  onClick={() => onInspect(trade)}
                  aria-label={`Inspect ${trade.symbol} trade`}
                >
                  <ChevronRight size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

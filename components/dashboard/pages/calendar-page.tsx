"use client";

import { useState } from "react";
import clsx from "clsx";
import { Bell, ChevronRight, Lock, Radio, Settings, X } from "lucide-react";
import { calendarEvents } from "@/data/dashboard";
import type { AppDialog } from "../types";
import { Panel, PanelHeading, Pill } from "../ui";

export default function CalendarPage({
  onToast,
  onDialog,
}: {
  onToast: (message: string) => void;
  onDialog: (dialog: AppDialog) => void;
}) {
  const [impact, setImpact] = useState("All");
  const [watching, setWatching] = useState<string[]>(["Core PCE Price Index m/m"]);
  const [dayOffset, setDayOffset] = useState(0);
  const selectedDate = new Date(2026, 5, 28 + dayOffset).toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const toggleWatch = (event: string) => {
    setWatching((items) =>
      items.includes(event) ? items.filter((item) => item !== event) : [...items, event],
    );
    onToast(watching.includes(event) ? "Event alert removed" : "Event alert created");
  };
  const visible = calendarEvents.filter((event) => impact === "All" || event.impact === impact);

  return (
    <div className="page-stack">
      <div className="calendar-alert-banner">
        <span className="alert-live">
          <Radio size={14} /> Live risk window
        </span>
        <div>
          <strong>USD high-impact news in 42 minutes</strong>
          <p>Your account restricts new orders 15 minutes before and 5 minutes after the release.</p>
        </div>
        <div className="countdown">
          <span>00</span>
          <i>:</i>
          <span>42</span>
          <i>:</i>
          <span>18</span>
          <small>HH&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;SS</small>
        </div>
      </div>
      <Panel>
        <div className="calendar-toolbar">
          <div className="date-navigator">
            <button
              className="icon-btn"
              onClick={() => setDayOffset((value) => value - 1)}
              aria-label="Previous day"
            >
              <ChevronRight className="rotate-180" size={16} />
            </button>
            <div>
              <strong>{selectedDate}</strong>
              <small>Africa/Douala · GMT+1</small>
            </div>
            <button
              className="icon-btn"
              onClick={() => setDayOffset((value) => value + 1)}
              aria-label="Next day"
            >
              <ChevronRight size={16} />
            </button>
            <button className="button button--secondary" onClick={() => setDayOffset(0)}>
              Today
            </button>
          </div>
          <div className="filter-tabs filter-tabs--small">
            {["All", "High", "Medium", "Low"].map((item) => (
              <button className={impact === item ? "active" : ""} onClick={() => setImpact(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
          <button
            className="button button--secondary"
            onClick={() => {
              setImpact("High");
              onToast("Showing only events that can restrict trading");
            }}
          >
            <Settings size={15} /> Risk events only
          </button>
        </div>
        <div className="calendar-table">
          <div className="calendar-row calendar-row--head">
            <span>Time</span>
            <span>Impact</span>
            <span>Event</span>
            <span>Forecast</span>
            <span>Previous</span>
            <span>Trading status</span>
            <span />
          </div>
          {visible.map((event) => (
            <div
              className={clsx("calendar-row", event.impact === "High" && "calendar-row--high")}
              key={event.event}
            >
              <span>
                <strong>{event.time}</strong>
                <small>GMT+1</small>
              </span>
              <span>
                <i className={`impact-bars impact-bars--${event.impact.toLowerCase()}`}>
                  <b />
                  <b />
                  <b />
                </i>
                <small>{event.impact}</small>
              </span>
              <span>
                <span className="currency-badge">{event.currency}</span>
                <div>
                  <strong>{event.event}</strong>
                  <small>Economic release</small>
                </div>
              </span>
              <span>{event.forecast}</span>
              <span>{event.previous}</span>
              <span>
                {event.impact === "High" ? (
                  <Pill tone="red">
                    <Lock size={11} /> Restricted
                  </Pill>
                ) : (
                  <Pill tone="green">Allowed</Pill>
                )}
              </span>
              <span>
                <button
                  className={clsx(
                    "icon-btn icon-btn--small",
                    watching.includes(event.event) && "icon-btn--active",
                  )}
                  onClick={() => toggleWatch(event.event)}
                >
                  <Bell size={14} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="calendar-info-grid">
        <Panel>
          <PanelHeading
            title="Your news rule"
            subtitle="Two-Step Pro · NX-204981"
            action={
              <button
                className="text-button"
                onClick={() =>
                  onDialog({
                    title: "Restricted news trading terms",
                    description:
                      "New entries, manual exits, and triggered pending orders are prohibited from 15 minutes before until 5 minutes after a high-impact release. Existing positions may remain open.",
                    detail: "Rule source: Two-Step Pro · version 4.2",
                    actionLabel: "I understand",
                  })
                }
              >
                View terms <span aria-hidden>→</span>
              </button>
            }
          />
          <div className="rule-explainer">
            <div className="timeline-rule">
              <span className="safe-zone">Allowed</span>
              <span className="blocked-zone">15m before</span>
              <i>Release</i>
              <span className="blocked-zone short">5m after</span>
              <span className="safe-zone">Allowed</span>
            </div>
            <p>
              You may hold positions through news. Opening or closing a trade inside the restricted window is
              a rule violation, including pending orders triggered during that window.
            </p>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Upcoming alerts" subtitle={`${watching.length} events watched`} />
          <div className="watch-list">
            {watching.map((item) => (
              <div key={item}>
                <span>
                  <Bell size={15} />
                </span>
                <div>
                  <strong>{item}</strong>
                  <small>15 minutes before · Push + email</small>
                </div>
                <button className="icon-btn icon-btn--small" onClick={() => toggleWatch(item)}>
                  <X size={14} />
                </button>
              </div>
            ))}
            {watching.length === 0 && <p className="empty-state">No event alerts yet.</p>}
          </div>
        </Panel>
      </div>
    </div>
  );
}

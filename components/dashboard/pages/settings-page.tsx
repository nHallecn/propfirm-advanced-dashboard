"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  BadgeCheck,
  Bell,
  Check,
  ChevronRight,
  KeyRound,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import type { AppDialog } from "../types";
import { Panel, PanelHeading, Pill } from "../ui";

type SettingsTab = "profile" | "connections" | "notifications" | "security";

export default function SettingsPage({
  onToast,
  onDialog,
}: {
  onToast: (message: string) => void;
  onDialog: (dialog: AppDialog) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const tabs = [
    { id: "profile", label: "Profile & preferences", icon: UserRound },
    { id: "connections", label: "Platform connections", icon: RefreshCw },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & sessions", icon: Shield },
  ] satisfies Array<{ id: SettingsTab; label: string; icon: typeof UserRound }>;

  return (
    <div className="settings-layout">
      <Panel className="settings-nav">
        <div className="settings-profile">
          <span>NH</span>
          <div>
            <strong>Nji Halle</strong>
            <small>nji.halle@example.com</small>
          </div>
          <Pill tone="green">
            <BadgeCheck size={11} /> Verified
          </Pill>
        </div>
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} key={item.id}>
              <Icon size={16} />
              {item.label}
              <ChevronRight size={14} />
            </button>
          );
        })}
      </Panel>

      <Panel className="settings-content">
        {tab === "profile" && (
          <>
            <PanelHeading
              title="Profile & preferences"
              subtitle="Used for certificates, payouts, and support"
            />
            <div className="settings-form">
              <label>
                <span>Full legal name</span>
                <input defaultValue="Nji Halle Cho-Nkwenti" />
              </label>
              <label>
                <span>Display name</span>
                <input defaultValue="Nji Halle" />
              </label>
              <label>
                <span>Email address</span>
                <input type="email" defaultValue="nji.halle@example.com" />
              </label>
              <label>
                <span>Phone number</span>
                <input type="tel" defaultValue="+237 6 70 00 00 00" />
              </label>
              <label>
                <span>Timezone</span>
                <select defaultValue="Africa/Douala">
                  <option>Africa/Douala</option>
                  <option>Europe/London</option>
                  <option>America/New_York</option>
                </select>
              </label>
              <label>
                <span>Base currency</span>
                <select defaultValue="USD">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </label>
            </div>
            <div className="settings-actions">
              <button
                className="button button--secondary"
                onClick={() => onToast("Profile changes discarded")}
              >
                Discard
              </button>
              <button className="button button--primary" onClick={() => onToast("Profile preferences saved")}>
                Save changes
              </button>
            </div>
          </>
        )}
        {tab === "connections" && (
          <>
            <PanelHeading
              title="Platform connections"
              subtitle="Read-only synchronization for trades and account rules"
              action={
                <button
                  className="button button--primary"
                  onClick={() =>
                    onDialog({
                      title: "Connect a platform",
                      description:
                        "Choose your platform, then add investor credentials or authorize the secure API connection.",
                      detail: "MT4 · MT5 · cTrader · DXtrade",
                      actionLabel: "Choose platform",
                    })
                  }
                >
                  <Plus size={14} /> Add connection
                </button>
              }
            />
            <div className="connection-list">
              {[
                {
                  name: "MetaTrader 5",
                  account: "NX-204981 · NOVA-Live 02",
                  sync: "8 seconds ago",
                  tone: "green",
                },
                {
                  name: "cTrader",
                  account: "NX-184023 · NOVA-cT Live",
                  sync: "42 seconds ago",
                  tone: "blue",
                },
                { name: "DXtrade", account: "NX-095426 · NOVA-Demo", sync: "2 minutes ago", tone: "violet" },
              ].map((connection) => (
                <div key={connection.account}>
                  <span className={`connection-logo connection-logo--${connection.tone}`}>
                    {connection.name.slice(0, 2)}
                  </span>
                  <div>
                    <strong>{connection.name}</strong>
                    <small>{connection.account}</small>
                  </div>
                  <span className="connection-sync">
                    <i />
                    Synced {connection.sync}
                  </span>
                  <button
                    className="button button--secondary"
                    onClick={() => onToast(`${connection.name} synchronized`)}
                  >
                    <RefreshCw size={14} /> Sync now
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() =>
                      onDialog({
                        title: `Disconnect ${connection.name}?`,
                        description:
                          "Historical analytics will remain available, but live equity, rules and new trades will stop updating.",
                        actionLabel: "Disconnect",
                      })
                    }
                    aria-label={`Disconnect ${connection.name}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {tab === "notifications" && (
          <>
            <PanelHeading title="Notification preferences" subtitle="Choose what reaches you and where" />
            <div className="preference-list">
              {[
                {
                  title: "Email alerts",
                  detail: "Payouts, verification and account status",
                  value: emailAlerts,
                  set: setEmailAlerts,
                },
                {
                  title: "Push notifications",
                  detail: "Live risk and economic-event warnings",
                  value: pushAlerts,
                  set: setPushAlerts,
                },
                {
                  title: "Risk threshold alerts",
                  detail: "Warn at 50%, 75% and 90% rule utilization",
                  value: riskAlerts,
                  set: setRiskAlerts,
                },
                {
                  title: "Weekly performance report",
                  detail: "Analytics summary every Sunday",
                  value: weeklyReport,
                  set: setWeeklyReport,
                },
              ].map((preference) => (
                <div key={preference.title}>
                  <div>
                    <strong>{preference.title}</strong>
                    <small>{preference.detail}</small>
                  </div>
                  <button
                    className={clsx("toggle", preference.value && "active")}
                    onClick={() => preference.set(!preference.value)}
                    aria-pressed={preference.value}
                  >
                    <span />
                  </button>
                </div>
              ))}
            </div>
            <div className="settings-actions">
              <button
                className="button button--primary"
                onClick={() => onToast("Notification preferences saved")}
              >
                Save preferences
              </button>
            </div>
          </>
        )}
        {tab === "security" && (
          <>
            <PanelHeading
              title="Security & sessions"
              subtitle="Protect access to accounts and payout details"
            />
            <div className="security-cards">
              <div>
                <span>
                  <KeyRound size={19} />
                </span>
                <div>
                  <strong>Two-factor authentication</strong>
                  <small>Authenticator app enabled · recovery codes saved</small>
                </div>
                <button
                  className="button button--secondary"
                  onClick={() =>
                    onDialog({
                      title: "Manage two-factor authentication",
                      description:
                        "Generate new recovery codes or move your authenticator to another device.",
                      actionLabel: "Continue securely",
                    })
                  }
                >
                  Manage
                </button>
              </div>
              <div>
                <span>
                  <ShieldCheck size={19} />
                </span>
                <div>
                  <strong>Identity verification</strong>
                  <small>Verified on June 04, 2026</small>
                </div>
                <Pill tone="green">
                  <Check size={11} /> Complete
                </Pill>
              </div>
              <div>
                <span>
                  <RefreshCw size={19} />
                </span>
                <div>
                  <strong>Active sessions</strong>
                  <small>2 devices · last active just now</small>
                </div>
                <button
                  className="button button--secondary"
                  onClick={() =>
                    onDialog({
                      title: "Sign out other sessions?",
                      description:
                        "This browser will remain signed in. Every other device will need to authenticate again.",
                      actionLabel: "Sign out others",
                    })
                  }
                >
                  Review
                </button>
              </div>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

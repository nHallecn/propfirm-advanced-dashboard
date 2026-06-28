"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Command,
  Download,
  Info,
  Lock,
  LogOut,
  Menu,
  MessageCircleQuestion,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import { accounts, type TradingAccount } from "@/data/dashboard";
import { navGroups } from "./config";
import type { AppDialog, PageMeta, Range } from "./types";
import { BrandMark } from "./ui";

export function Sidebar({
  active,
  compact,
  mobileOpen,
  onClose,
  onCompact,
  onChallenge,
}: {
  active: string;
  compact: boolean;
  mobileOpen: boolean;
  onClose: () => void;
  onCompact: () => void;
  onChallenge: () => void;
}) {
  return (
    <aside className={clsx("sidebar", compact && "sidebar--compact", mobileOpen && "sidebar--mobile-open")}>
      <div className="sidebar-head">
        <BrandMark small={compact} />
        <button className="icon-btn mobile-only" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>
      <button className="sidebar-challenge" onClick={onChallenge}>
        <span className="challenge-icon">
          <Zap size={16} />
        </span>
        {!compact && (
          <span>
            <strong>Start a challenge</strong>
            <small>Get funded from $49</small>
          </span>
        )}
        {!compact && <ChevronRight size={16} />}
      </button>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            {!compact && <p>{group.label}</p>}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  href={item.href}
                  className={clsx("nav-item", active === item.id && "nav-item--active")}
                  key={item.id}
                  title={compact ? item.label : undefined}
                  onClick={onClose}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {!compact && <span>{item.label}</span>}
                  {!compact && "count" in item && item.count && <small>{item.count}</small>}
                  {!compact && "badge" in item && item.badge && <em>{item.badge}</em>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        {!compact && (
          <Link className="support-card" href="/dashboard/support">
            <span>
              <MessageCircleQuestion size={17} />
            </span>
            <div>
              <strong>Need a hand?</strong>
              <small>Average reply · 3 min</small>
            </div>
            <ChevronRight size={15} />
          </Link>
        )}
        <button className="collapse-button" onClick={onCompact}>
          {compact ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          {!compact && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}

export function Topbar({
  account,
  accountMenuOpen,
  notificationsOpen,
  profileMenuOpen,
  onMenu,
  onAccountMenu,
  onNotifications,
  onProfileMenu,
  onCommand,
  onSelectAccount,
  onNavigate,
  onSignOut,
}: {
  account: TradingAccount;
  accountMenuOpen: boolean;
  notificationsOpen: boolean;
  profileMenuOpen: boolean;
  onMenu: () => void;
  onAccountMenu: () => void;
  onNotifications: () => void;
  onProfileMenu: () => void;
  onCommand: () => void;
  onSelectAccount: (id: string) => void;
  onNavigate: (href: string) => void;
  onSignOut: () => void;
}) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-button" onClick={onMenu} aria-label="Open menu">
        <Menu size={19} />
      </button>
      <div className="account-switcher-wrap">
        <button className="account-switcher" onClick={onAccountMenu} aria-expanded={accountMenuOpen}>
          <span className="switcher-dot" />
          <span>
            <small>Viewing account</small>
            <strong>{account.label}</strong>
          </span>
          <ChevronDown size={16} />
        </button>
        {accountMenuOpen && (
          <div className="account-menu popover">
            <p>Switch account</p>
            {accounts.map((item) => (
              <button key={item.id} onClick={() => onSelectAccount(item.id)}>
                <span className={clsx("account-avatar", `account-avatar--${item.status.toLowerCase()}`)}>
                  {item.label.replace(/[^0-9]/g, "").slice(0, 2) || "10"}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>
                    {item.phase} · {item.id}
                  </small>
                </span>
                {item.id === account.id && <Check size={16} />}
              </button>
            ))}
            <Link href="/dashboard/accounts">
              Manage all accounts <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
      <button className="command-search" onClick={onCommand}>
        <Search size={17} />
        <span>Search anything</span>
        <kbd>
          <Command size={11} /> K
        </kbd>
      </button>
      <div className="topbar-actions">
        <div className="sync-status">
          <span />
          Live<small>8s ago</small>
        </div>
        <button
          className={clsx("icon-btn", notificationsOpen && "icon-btn--active")}
          onClick={onNotifications}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>
        <div className="profile-menu-wrap">
          <button className="profile-button" onClick={onProfileMenu} aria-expanded={profileMenuOpen}>
            <span>NH</span>
            <div>
              <strong>Nji Halle</strong>
              <small>Pro trader</small>
            </div>
            <ChevronDown size={15} />
          </button>
          {profileMenuOpen && (
            <div className="profile-menu popover">
              <div className="profile-menu-head">
                <span>NH</span>
                <div>
                  <strong>Nji Halle</strong>
                  <small>nji.halle@example.com</small>
                </div>
                <BadgeCheck size={17} />
              </div>
              <button onClick={() => onNavigate("/dashboard/settings")}>
                <UserRound size={16} /> Profile & verification
              </button>
              <button onClick={() => onNavigate("/dashboard/settings")}>
                <Settings size={16} /> Workspace settings
              </button>
              <button onClick={() => onNavigate("/dashboard/payouts")}>
                <WalletCards size={16} /> Payout methods
              </button>
              <button className="profile-menu-signout" onClick={onSignOut}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function PageHeader({
  meta,
  range,
  onRange,
  onExport,
  section,
  onAction,
}: {
  meta: PageMeta;
  range: Range;
  onRange: (range: Range) => void;
  onExport: () => void;
  section: string;
  onAction: () => void;
}) {
  const action =
    section === "risk"
      ? "Lock settings"
      : section === "journal"
        ? "New entry"
        : section === "accounts"
          ? "Add account"
          : null;
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{meta.eyebrow}</p>
        <h1>{meta.title}</h1>
        <p className="page-subtitle">{meta.subtitle}</p>
      </div>
      <div className="page-header-actions">
        {["overview", "analytics"].includes(section) && (
          <div className="range-tabs" aria-label="Date range">
            {(["7D", "30D", "90D", "All"] as Range[]).map((item) => (
              <button className={range === item ? "active" : ""} onClick={() => onRange(item)} key={item}>
                {item}
              </button>
            ))}
          </div>
        )}
        {["overview", "analytics", "journal"].includes(section) && (
          <button className="button button--secondary" onClick={onExport}>
            <Download size={16} />
            Export
          </button>
        )}
        {action && (
          <button className="button button--primary" onClick={onAction}>
            {section === "risk" ? <Lock size={15} /> : <Plus size={16} />}
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

export function ActionDialog({
  dialog,
  onClose,
  onConfirm,
}: {
  dialog: AppDialog;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="action-dialog-overlay" onMouseDown={onClose}>
      <div
        className="action-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="action-dialog-icon">
          <Sparkles size={22} />
        </div>
        <button className="icon-btn action-dialog-close" onClick={onClose} aria-label="Close dialog">
          <X size={17} />
        </button>
        <h2 id="action-dialog-title">{dialog.title}</h2>
        <p>{dialog.description}</p>
        {dialog.detail && (
          <div className="action-dialog-detail">
            <Info size={15} />
            {dialog.detail}
          </div>
        )}
        <div className="action-dialog-actions">
          <button className="button button--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="button button--primary" onClick={onConfirm}>
            {dialog.actionLabel ?? "Done"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationsPanel({
  onClose,
  onNavigate,
  onMarkRead,
  onSettings,
}: {
  onClose: () => void;
  onNavigate: (href: string) => void;
  onMarkRead: () => void;
  onSettings: () => void;
}) {
  return (
    <>
      <button className="drawer-scrim" aria-label="Close notifications" onClick={onClose} />
      <aside className="notifications-panel">
        <div className="notifications-head">
          <div>
            <h2>Notifications</h2>
            <p>3 new updates</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="notification-group">
          <p>Today</p>
          <button onClick={() => onNavigate("/dashboard/calendar")}>
            <span className="notification-icon notification-icon--red">
              <AlertTriangle size={17} />
            </span>
            <div>
              <strong>High-impact USD event</strong>
              <p>Your restricted trading window begins in 27 minutes.</p>
              <small>15 min ago</small>
            </div>
            <i />
          </button>
          <button onClick={() => onNavigate("/dashboard/risk")}>
            <span className="notification-icon notification-icon--green">
              <ShieldCheck size={17} />
            </span>
            <div>
              <strong>Risk level back to safe</strong>
              <p>Open exposure dropped below your personal 1% threshold.</p>
              <small>1 hour ago</small>
            </div>
            <i />
          </button>
          <button onClick={() => onNavigate("/dashboard/payouts")}>
            <span className="notification-icon notification-icon--blue">
              <WalletCards size={17} />
            </span>
            <div>
              <strong>Payout window approaching</strong>
              <p>Your $100K funded account becomes eligible in 2 days.</p>
              <small>3 hours ago</small>
            </div>
            <i />
          </button>
        </div>
        <div className="notification-group">
          <p>Yesterday</p>
          <button onClick={() => onNavigate("/dashboard/journal")}>
            <span className="notification-icon notification-icon--violet">
              <Sparkles size={17} />
            </span>
            <div>
              <strong>New behavior insight</strong>
              <p>We found a pattern in your post-loss trading.</p>
              <small>Yesterday · 18:42</small>
            </div>
          </button>
          <button onClick={() => onNavigate("/dashboard/accounts")}>
            <span className="notification-icon">
              <RefreshCw size={17} />
            </span>
            <div>
              <strong>Account synchronized</strong>
              <p>61 trades imported successfully from MT5.</p>
              <small>Yesterday · 17:05</small>
            </div>
          </button>
        </div>
        <div className="notifications-footer">
          <button onClick={onMarkRead}>Mark all as read</button>
          <button onClick={onSettings}>Notification settings</button>
        </div>
      </aside>
    </>
  );
}

export function CommandPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const [query, setQuery] = useState("");
  const actions = useMemo(
    () =>
      [
        ...navGroups.flatMap((group) =>
          group.items.map((item) => ({
            label: item.label,
            sub: group.label,
            icon: item.icon,
            href: item.href,
          })),
        ),
        { label: "Open trade reports", sub: "Action", icon: Download, href: "/dashboard/journal" },
        { label: "Open position size calculator", sub: "Action", icon: Target, href: "/dashboard/risk" },
        { label: "Open payout center", sub: "Action", icon: WalletCards, href: "/dashboard/payouts" },
      ].filter((action) => `${action.label} ${action.sub}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="command-overlay" onMouseDown={onClose}>
      <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input">
          <Search size={19} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, accounts, trades, or actions…"
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-results">
          <p>{query ? "Results" : "Quick access"}</p>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button onClick={() => onNavigate(action.href)} key={`${action.label}-${action.sub}`}>
                <span>
                  <Icon size={17} />
                </span>
                <div>
                  <strong>{action.label}</strong>
                  <small>{action.sub}</small>
                </div>
                <kbd>↵</kbd>
              </button>
            );
          })}
          {actions.length === 0 && (
            <div className="command-empty">
              <Search size={25} />
              <strong>No matching result</strong>
              <span>Try a page name, account, or action.</span>
            </div>
          )}
        </div>
        <div className="command-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span>
            <kbd>esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

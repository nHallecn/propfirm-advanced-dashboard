"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Command,
  Copy,
  Download,
  Ellipsis,
  Eye,
  FileText,
  Filter,
  Gauge,
  GraduationCap,
  Headphones,
  HelpCircle,
  Info,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  ListFilter,
  Lock,
  LogOut,
  Menu,
  MessageCircleQuestion,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  WalletCards,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  accounts,
  achievements,
  calendarEvents,
  dailyPerformance,
  equityData,
  monthlyPnL,
  payoutHistory,
  strategyPerformance,
  trades,
  type Trade,
  type TradingAccount,
} from "@/data/dashboard";

const money = (value: number, compact = false) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: compact ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(value);

const signedMoney = (value: number) =>
  `${value >= 0 ? "+" : "-"}${money(Math.abs(value))}`;

const number = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const navGroups = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      { id: "accounts", label: "My accounts", icon: BriefcaseBusiness, href: "/dashboard/accounts", count: "4" },
      { id: "analytics", label: "Performance", icon: BarChart3, href: "/dashboard/analytics" },
      { id: "risk", label: "Risk center", icon: Shield, href: "/dashboard/risk", badge: "Live" },
      { id: "journal", label: "Trade journal", icon: BookOpen, href: "/dashboard/journal" },
    ],
  },
  {
    label: "Funding",
    items: [
      { id: "payouts", label: "Payouts", icon: WalletCards, href: "/dashboard/payouts" },
      { id: "calendar", label: "Market calendar", icon: CalendarDays, href: "/dashboard/calendar", count: "2" },
      { id: "achievements", label: "Growth & awards", icon: Trophy, href: "/dashboard/achievements" },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "academy", label: "Trading academy", icon: GraduationCap, href: "/dashboard/academy" },
      { id: "support", label: "Help & support", icon: LifeBuoy, href: "/dashboard/support" },
      { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
];

const titleMap: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  overview: {
    eyebrow: "Sunday, 28 June",
    title: "Good morning, Nji",
    subtitle: "Your risk is controlled and the target is within reach.",
  },
  accounts: {
    eyebrow: "Portfolio",
    title: "Trading accounts",
    subtitle: "One trusted view across every phase, platform, and account.",
  },
  analytics: {
    eyebrow: "Performance intelligence",
    title: "Know where your edge lives",
    subtitle: "Separate repeatable skill from noise, luck, and avoidable risk.",
  },
  risk: {
    eyebrow: "Pre-trade protection",
    title: "Risk center",
    subtitle: "Know whether the next trade fits before you place it.",
  },
  journal: {
    eyebrow: "Review & improve",
    title: "Trade journal",
    subtitle: "Turn each execution into a useful feedback loop.",
  },
  payouts: {
    eyebrow: "Rewards",
    title: "Payout center",
    subtitle: "Track eligibility, requests, splits, and every dollar earned.",
  },
  calendar: {
    eyebrow: "Market intelligence",
    title: "Economic calendar",
    subtitle: "See restricted windows and market-moving events in your timezone.",
  },
  achievements: {
    eyebrow: "Trader progression",
    title: "Growth & awards",
    subtitle: "Your funding journey, documented and ready to share.",
  },
  academy: {
    eyebrow: "NOVA Academy",
    title: "Build durable trading skill",
    subtitle: "Short, practical lessons based on your actual performance.",
  },
  support: {
    eyebrow: "We are here to help",
    title: "Support center",
    subtitle: "Find a clear answer or reach a real person quickly.",
  },
  settings: {
    eyebrow: "Workspace preferences",
    title: "Settings",
    subtitle: "Manage your profile, connections, alerts, security, and billing.",
  },
};

type Range = "7D" | "30D" | "90D" | "All";
type AppDialog = {
  title: string;
  description: string;
  actionLabel?: string;
  detail?: string;
};

export default function DashboardApp() {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/")[2] || "overview";
  const section = titleMap[segment] ? segment : "overview";
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [range, setRange] = useState<Range>("30D");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<AppDialog | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const account = accounts.find((item) => item.id === accountId) ?? accounts[0];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setNotificationsOpen(false);
        setAccountMenuOpen(false);
        setProfileMenuOpen(false);
        setDialog(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);
  const openDialog = (nextDialog: AppDialog) => setDialog(nextDialog);
  const meta = titleMap[section];

  const exportTrades = () => {
    const headers = ["id", "symbol", "side", "opened", "setup", "lots", "pnl", "resultR"];
    const rows = trades.map((trade) =>
      [trade.id, trade.symbol, trade.side, trade.opened, trade.setup, trade.lots, trade.pnl, trade.resultR]
        .map((value) => `"${value}"`)
        .join(","),
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nova-trade-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Trade report exported");
  };

  return (
    <div className="app-shell">
      <Sidebar
        active={section}
        compact={sidebarCompact}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCompact={() => setSidebarCompact((value) => !value)}
        onChallenge={() =>
          openDialog({
            title: "Start a new challenge",
            description: "Choose an account size and evaluation model. Your current risk preferences will be carried into the new account.",
            detail: "$25K Two-Step Pro · $89 · 90% reward split",
            actionLabel: "Continue to checkout",
          })
        }
      />
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

      <div className={clsx("app-main", sidebarCompact && "app-main--compact")}>
        <Topbar
          account={account}
          accountMenuOpen={accountMenuOpen}
          notificationsOpen={notificationsOpen}
          profileMenuOpen={profileMenuOpen}
          onMenu={() => setSidebarOpen(true)}
          onAccountMenu={() => setAccountMenuOpen((value) => !value)}
          onNotifications={() => setNotificationsOpen((value) => !value)}
          onProfileMenu={() => setProfileMenuOpen((value) => !value)}
          onCommand={() => setCommandOpen(true)}
          onSelectAccount={(id) => {
            setAccountId(id);
            setAccountMenuOpen(false);
            showToast("Account view updated");
          }}
          onNavigate={(href) => {
            setProfileMenuOpen(false);
            router.push(href);
          }}
          onSignOut={() => {
            setProfileMenuOpen(false);
            openDialog({
              title: "Sign out of NOVA?",
              description: "Your synchronized account data is safe. You will need to verify your identity again to access payout settings.",
              actionLabel: "Sign out",
            });
          }}
        />

        <main className="page-wrap">
          <PageHeader
            meta={meta}
            range={range}
            onRange={setRange}
            onExport={exportTrades}
            section={section}
            onAction={() => {
              if (section === "risk") showToast("Risk settings locked until the next session");
              else if (section === "journal") openDialog({ title: "Create a journal entry", description: "Start a manual review for an unimported trade or a session-level note.", detail: "The entry will be attached to Primary $25K and today’s session.", actionLabel: "Create entry" });
              else if (section === "accounts") openDialog({ title: "Connect a trading account", description: "Choose MT4, MT5, cTrader or DXtrade, then authenticate with read-only investor credentials.", detail: "Credentials are encrypted and can never place or modify trades.", actionLabel: "Connect account" });
              else router.push("/dashboard/accounts");
            }}
          />

          {section === "overview" && <Overview account={account} range={range} onNavigate={(to) => router.push(to)} onToast={showToast} />}
          {section === "accounts" && (
            <AccountsPage accountId={accountId} onSelect={setAccountId} onToast={showToast} onDialog={openDialog} />
          )}
          {section === "analytics" && <AnalyticsPage range={range} onToast={showToast} />}
          {section === "risk" && <RiskPage account={account} onToast={showToast} />}
          {section === "journal" && <JournalPage onExport={exportTrades} onToast={showToast} />}
          {section === "payouts" && <PayoutsPage onToast={showToast} />}
          {section === "calendar" && <CalendarPage onToast={showToast} onDialog={openDialog} />}
          {section === "achievements" && <AchievementsPage onToast={showToast} />}
          {section === "academy" && <AcademyPage onToast={showToast} />}
          {section === "support" && <SupportPage onToast={showToast} />}
          {section === "settings" && <SettingsPage onToast={showToast} onDialog={openDialog} />}
        </main>
      </div>

      {notificationsOpen && (
        <NotificationsPanel
          onClose={() => setNotificationsOpen(false)}
          onNavigate={(href) => {
            setNotificationsOpen(false);
            router.push(href);
          }}
          onMarkRead={() => showToast("All notifications marked as read")}
          onSettings={() => {
            setNotificationsOpen(false);
            router.push("/dashboard/settings");
          }}
        />
      )}
      {commandOpen && (
        <CommandPalette
          onClose={() => setCommandOpen(false)}
          onNavigate={(href) => {
            setCommandOpen(false);
            router.push(href);
          }}
        />
      )}
      {dialog && (
        <ActionDialog
          dialog={dialog}
          onClose={() => setDialog(null)}
          onConfirm={() => {
            showToast(`${dialog.actionLabel ?? "Action"} completed`);
            setDialog(null);
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function BrandMark({ small = false }: { small?: boolean }) {
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

function Sidebar({
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
                  {!compact && item.count && <small>{item.count}</small>}
                  {!compact && item.badge && <em>{item.badge}</em>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        {!compact && (
          <div className="support-card">
            <span>
              <MessageCircleQuestion size={17} />
            </span>
            <div>
              <strong>Need a hand?</strong>
              <small>Average reply · 3 min</small>
            </div>
            <ChevronRight size={15} />
          </div>
        )}
        <button className="collapse-button" onClick={onCompact}>
          {compact ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          {!compact && "Collapse sidebar"}
        </button>
      </div>
    </aside>
  );
}

function Topbar({
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
          Live
          <small>8s ago</small>
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
                <div><strong>Nji Halle</strong><small>nji.halle@example.com</small></div>
                <BadgeCheck size={17} />
              </div>
              <button onClick={() => onNavigate("/dashboard/settings")}><UserRound size={16} /> Profile & verification</button>
              <button onClick={() => onNavigate("/dashboard/settings")}><Settings size={16} /> Workspace settings</button>
              <button onClick={() => onNavigate("/dashboard/payouts")}><WalletCards size={16} /> Payout methods</button>
              <button className="profile-menu-signout" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function PageHeader({
  meta,
  range,
  onRange,
  onExport,
  section,
  onAction,
}: {
  meta: { eyebrow: string; title: string; subtitle: string };
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

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={clsx("panel", className)}>{children}</section>;
}

function PanelHeading({
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

function KpiCard({
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
  icon: typeof Activity;
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

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "green" | "red" | "amber" | "blue" | "neutral" | "violet";
}) {
  return <span className={clsx("pill", `pill--${tone}`)}>{children}</span>;
}

function RuleProgress({
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
        <span className={`progress-fill progress-fill--${tone}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <small>{helper}</small>
    </div>
  );
}

function ChartTooltip({
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

function Overview({
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
  const visibleEquityData = range === "7D" ? equityData.slice(-4) : range === "30D" ? equityData.slice(-10) : range === "90D" ? equityData : equityData.filter((_, index) => index % 2 === 0 || index === equityData.length - 1);

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
              {signedMoney(netProfit)} ({((netProfit / account.startingBalance) * 100).toFixed(2)}%) since start
            </small>
          </div>
        </div>
        <div className="account-hero-target">
          <div className="target-ring" style={{ "--progress": `${Math.min(targetProgress, 100) * 3.6}deg` } as React.CSSProperties}>
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
        <KpiCard
          label="Win rate"
          value="62.3%"
          detail="+4.1 pts over 30 days"
          trend="up"
          icon={Target}
        />
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
                <span><i className="legend-green" />Equity</span>
                <span><i className="legend-blue" />Balance</span>
                <span><i className="legend-red" />Risk floor</span>
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
                <XAxis dataKey="date" stroke="#71808f" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
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
                <Line type="monotone" dataKey="balance" stroke="#7396ff" strokeWidth={1.7} dot={false} name="Balance" />
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
            action={<Pill tone="green"><Radio size={11} /> Safe</Pill>}
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
            action={<button className="icon-btn" onClick={() => onNavigate("/dashboard/calendar")} aria-label="Filter calendar"><Filter size={16} /></button>}
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
                  <small>{event.currency} · {event.impact} impact</small>
                </div>
              </div>
            ))}
          </div>
          <button className="button button--secondary button--full" onClick={() => onNavigate("/dashboard/calendar")}>
            View full calendar <CalendarDays size={15} />
          </button>
        </Panel>
      </div>
    </div>
  );
}

function TradeTable({
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
                    <small>{trade.side} · {trade.lots} lots</small>
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
              <td><strong className={trade.pnl >= 0 ? "positive" : "negative"}>{signedMoney(trade.pnl)}</strong></td>
              <td><Pill tone={trade.resultR >= 0 ? "green" : "red"}>{trade.resultR > 0 ? "+" : ""}{trade.resultR.toFixed(2)}R</Pill></td>
              <td><button className="icon-btn icon-btn--small" onClick={() => onInspect(trade)} aria-label={`Inspect ${trade.symbol} trade`}><ChevronRight size={15} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AccountsPage({
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
        <KpiCard label="Funded capital" value={money(totalCapital, true)} detail="Across 2 funded accounts" icon={BriefcaseBusiness} tone="blue" />
        <KpiCard label="Portfolio P&L" value={signedMoney(totalPnL)} detail="+1.62% this month" trend="up" icon={TrendingUp} tone="green" />
        <KpiCard label="Next payout" value="2 days" detail="$3,857 currently eligible" icon={Clock3} tone="amber" />
        <KpiCard label="Account health" value="3 / 4 safe" detail="1 account needs attention" icon={ShieldCheck} />
      </div>
      <Panel>
        <div className="filter-toolbar">
          <div className="filter-tabs">
            {["All", "Funded", "Evaluation", "Passed"].map((item) => (
              <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>
                {item}
                <small>{item === "All" ? accounts.length : accounts.filter((account) => account.status === item).length}</small>
              </button>
            ))}
          </div>
          <div className="toolbar-actions">
            <button className="button button--secondary" onClick={() => { setReverseOrder((value) => !value); onToast(reverseOrder ? "Accounts sorted newest first" : "Accounts sorted oldest first"); }}><ListFilter size={15} /> Reverse order</button>
            <button className="button button--primary" onClick={() => onDialog({ title: "Connect a trading account", description: "Select a supported platform and add read-only credentials. NOVA will import history and rule parameters automatically.", detail: "Supported: MT4, MT5, cTrader and DXtrade", actionLabel: "Begin connection" })}><Plus size={15} /> Add account</button>
          </div>
        </div>
        <div className="account-card-grid">
          {orderedAccounts.map((account) => {
            const profit = account.balance - account.startingBalance;
            const progress = (profit / account.profitTarget) * 100;
            const floor = account.startingBalance - account.maxLossLimit;
            const room = account.equity - floor;
            return (
              <article className={clsx("account-card", account.id === accountId && "account-card--selected")} key={account.id}>
                <div className="account-card-top">
                  <span className={clsx("account-avatar", `account-avatar--${account.status.toLowerCase()}`)}>
                    {account.startingBalance / 1000}k
                  </span>
                  <div>
                    <strong>{account.label}</strong>
                    <small>{account.program} · {account.id}</small>
                  </div>
                  <Pill tone={account.status === "Funded" ? "green" : account.status === "Passed" ? "violet" : "blue"}>
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
                  <div><span>Equity</span><strong>{money(account.equity)}</strong></div>
                  <div><span>Today</span><strong className={account.dailyPnL >= 0 ? "positive" : "negative"}>{signedMoney(account.dailyPnL)}</strong></div>
                  <div><span>Risk room</span><strong>{money(room)}</strong></div>
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
                  <button className="button button--secondary" onClick={() => { void navigator.clipboard?.writeText(`Login: ${account.login}\nServer: ${account.server}`); onToast("Credentials copied securely"); }}>
                    <KeyRound size={15} /> Credentials
                  </button>
                  <button className="icon-btn" onClick={() => onDialog({ title: `Manage ${account.label}`, description: "Rename this account, refresh its rule template, or disconnect the read-only synchronization.", detail: `${account.platform} · ${account.server}`, actionLabel: "Refresh account" })} aria-label={`Manage ${account.label}`}><Ellipsis size={17} /></button>
                </div>
              </article>
            );
          })}
          <button className="add-account-card" onClick={() => onDialog({ title: "Connect another account", description: "Bring every prop account into one risk and analytics workspace.", detail: "Read-only access · encrypted at rest", actionLabel: "Choose platform" })}>
            <span><Plus size={21} /></span>
            <strong>Connect another account</strong>
            <small>MT4, MT5, cTrader, DXtrade & more</small>
          </button>
        </div>
      </Panel>
    </div>
  );
}

function AnalyticsPage({ range, onToast }: { range: Range; onToast: (message: string) => void }) {
  const [metric, setMetric] = useState<"pnl" | "winRate">("pnl");
  const sourceData = range === "7D" ? equityData.slice(-4) : range === "30D" ? equityData.slice(-10) : range === "90D" ? equityData : equityData.filter((_, index) => index % 2 === 0 || index === equityData.length - 1);
  const performanceData = sourceData.map((item, index) => ({ ...item, winRate: 48 + index * 1.3 + (index % 3) * 2.1 }));
  const radarData = [
    { subject: "Risk control", value: 91 },
    { subject: "Consistency", value: 82 },
    { subject: "Execution", value: 88 },
    { subject: "Selectivity", value: 68 },
    { subject: "R:R quality", value: 76 },
    { subject: "Plan adherence", value: 86 },
  ];
  const symbolData = [
    { name: "XAUUSD", value: 42, color: "#55d6be" },
    { name: "NAS100", value: 25, color: "#7396ff" },
    { name: "EURUSD", value: 18, color: "#b190ff" },
    { name: "Others", value: 15, color: "#46515d" },
  ];
  const totalTrades = strategyPerformance.reduce((sum, item) => sum + item.trades, 0);

  return (
    <div className="page-stack">
      <div className="kpi-grid">
        <KpiCard label="Expectancy" value="$48.72" detail="+$12.40 vs previous period" trend="up" icon={Sparkles} tone="green" />
        <KpiCard label="Profit factor" value="1.82" detail="Healthy · target above 1.50" trend="up" icon={Activity} tone="blue" />
        <KpiCard label="Average R:R" value="1 : 1.46" detail="Winners are 46% larger" icon={Target} />
        <KpiCard label="Sharpe ratio" value="1.28" detail="+0.18 risk-adjusted return" trend="up" icon={Gauge} tone="amber" />
      </div>

      <div className="analytics-main-grid">
        <Panel className="analytics-curve">
          <PanelHeading
            title="Cumulative performance"
            subtitle="Realized P&L across all selected accounts"
            action={
              <div className="segmented-control">
                <button className={metric === "pnl" ? "active" : ""} onClick={() => setMetric("pnl")}>P&L</button>
                <button className={metric === "winRate" ? "active" : ""} onClick={() => setMetric("winRate")}>Win rate</button>
              </div>
            }
          />
          <div className="chart-wrap chart-wrap--medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="performanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7396ff" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#7396ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="date" stroke="#71808f" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#71808f"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  domain={metric === "pnl" ? [24800, 27200] : [40, 80]}
                  tickFormatter={(value) => metric === "pnl" ? `$${Math.round(value / 1000)}k` : `${Math.round(value)}%`}
                />
                {metric === "pnl" && <Tooltip content={<ChartTooltip />} />}
                <Area type="monotone" dataKey={metric === "pnl" ? "balance" : "winRate"} name={metric === "pnl" ? "Balance" : "Win rate"} stroke="#7396ff" strokeWidth={2.2} fill="url(#performanceFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="insight-banner">
            <Sparkles size={17} />
            <div>
              <strong>Your edge is strongest between 09:30–11:30 GMT+1</strong>
              <span>Trades in this window generate 43% more expectancy with 18% less adverse excursion.</span>
            </div>
            <button onClick={() => onToast("Insight added to your journal review queue")}>Explore insight <ArrowRight size={14} /></button>
          </div>
        </Panel>
        <Panel className="score-panel">
          <PanelHeading title="Trader score" subtitle="Compared with your last 90 days" action={<Pill tone="green">+6 pts</Pill>} />
          <div className="score-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#313c47" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#8997a5", fontSize: 10 }} />
                <Radar dataKey="value" stroke="#55d6be" fill="#55d6be" fillOpacity={0.18} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="score-center"><strong>84</strong><small>/ 100</small></div>
          </div>
          <div className="score-footer">
            <span><i className="positive-dot" />Strongest <strong>Risk control</strong></span>
            <span><i className="amber-dot" />Focus <strong>Selectivity</strong></span>
          </div>
        </Panel>
      </div>

      <div className="three-grid">
        <Panel>
          <PanelHeading title="P&L by weekday" subtitle="Net performance and trade volume" />
          <div className="chart-wrap chart-wrap--small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPerformance} margin={{ left: -20, right: 5, top: 8 }}>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#8997a5", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8997a5", fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip cursor={{ fill: "#18212a" }} content={<ChartTooltip />} />
                <Bar dataKey="pnl" name="P&L" radius={[5, 5, 2, 2]}>
                  {dailyPerformance.map((item) => <Cell fill={item.pnl >= 0 ? "#55d6be" : "#f36d78"} key={item.day} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mini-insight"><BadgeCheck size={15} />Friday is your highest-expectancy day.</div>
        </Panel>

        <Panel>
          <PanelHeading title="Market allocation" subtitle={`${totalTrades} tagged trades`} />
          <div className="donut-layout">
            <div className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={symbolData} dataKey="value" innerRadius={52} outerRadius={74} paddingAngle={3} stroke="none">
                    {symbolData.map((item) => <Cell fill={item.color} key={item.name} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div><strong>{totalTrades}</strong><small>trades</small></div>
            </div>
            <div className="donut-legend">
              {symbolData.map((item) => (
                <div key={item.name}><span style={{ background: item.color }} /><strong>{item.name}</strong><small>{item.value}%</small></div>
              ))}
            </div>
          </div>
          <div className="mini-insight"><Info size={15} />XAUUSD contributes 54% of net profit.</div>
        </Panel>

        <Panel>
          <PanelHeading title="Execution quality" subtitle="MFE captured vs MAE taken" />
          <div className="execution-bars">
            <div>
              <span>Profit capture</span>
              <strong>68%</strong>
              <div><i style={{ width: "68%" }} /></div>
              <small>Of maximum favorable excursion</small>
            </div>
            <div>
              <span>Stop efficiency</span>
              <strong>81%</strong>
              <div><i style={{ width: "81%" }} /></div>
              <small>Stops placed beyond normal noise</small>
            </div>
            <div>
              <span>Plan adherence</span>
              <strong>86%</strong>
              <div><i style={{ width: "86%" }} /></div>
              <small>Trades matched pre-trade plan</small>
            </div>
          </div>
          <div className="mini-insight mini-insight--amber"><AlertTriangle size={15} />Early exits cost an estimated $312.</div>
        </Panel>
      </div>

      <Panel>
        <PanelHeading
          title="Strategy edge"
          subtitle="Performance grouped by journal setup tags"
          action={<button className="button button--secondary" onClick={() => onToast("Strategy columns customized")}><Filter size={14} /> Customize</button>}
        />
        <div className="strategy-table">
          <div className="strategy-row strategy-row--head">
            <span>Setup</span><span>Trades</span><span>Win rate</span><span>Avg. R</span><span>Net P&L</span><span>Edge</span>
          </div>
          {strategyPerformance.map((item, index) => (
            <div className="strategy-row" key={item.name}>
              <span><i>{index + 1}</i><strong>{item.name}</strong></span>
              <span>{item.trades}</span>
              <span>{item.winRate}%</span>
              <span className={item.avgR >= 0 ? "positive" : "negative"}>{item.avgR > 0 ? "+" : ""}{item.avgR}R</span>
              <span className={item.pnl >= 0 ? "positive" : "negative"}>{signedMoney(item.pnl)}</span>
              <span><Pill tone={index < 2 ? "green" : index === 2 ? "blue" : "red"}>{index < 2 ? "Proven" : index === 2 ? "Developing" : "Review"}</Pill></span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function RiskPage({ account, onToast }: { account: TradingAccount; onToast: (message: string) => void }) {
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
        <div className="risk-status-icon"><ShieldCheck size={27} /></div>
        <div>
          <Pill tone="green"><Radio size={11} /> All systems normal</Pill>
          <h2>You have {money(currentRoom)} of maximum-loss runway</h2>
          <p>At your current average loss of $214, that is roughly <strong>{(currentRoom / 214).toFixed(1)} full-risk attempts</strong>.</p>
        </div>
        <div className="risk-status-stats">
          <div><span>Daily room</span><strong>{money(1611.4)}</strong></div>
          <div><span>Open risk</span><strong>{money(198)}</strong></div>
          <div><span>Risk reset</span><strong>8h 32m</strong></div>
        </div>
      </div>

      <div className="risk-layout">
        <Panel className="trade-guard">
          <PanelHeading
            title="Pre-trade guard"
            subtitle="Simulate the next position against every account rule"
            action={<Pill tone="blue"><Bot size={12} /> Live calculator</Pill>}
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
                <strong>{instrument.symbol}</strong><small>{instrument.name}</small><ChevronDown size={15} />
              </button>
            </label>
            <label className="form-field">
              <span>Direction</span>
              <span className="direction-toggle">
                <button className={direction === "Long" ? "active" : ""} onClick={() => setDirection("Long")}><TrendingUp size={15} /> Long</button>
                <button className={direction === "Short" ? "active" : ""} onClick={() => setDirection("Short")}><TrendingDown size={15} /> Short</button>
              </span>
            </label>
            <label className="form-field">
              <span>Entry price</span>
              <span className="input-suffix">
                <input type="number" value={entry} onChange={(event) => setEntry(Number(event.target.value))} />
                <small>USD</small>
              </span>
            </label>
            <label className="form-field">
              <span>Stop distance</span>
              <span className="input-suffix">
                <input type="number" value={stopDistance} onChange={(event) => setStopDistance(Number(event.target.value))} />
                <small>pips</small>
              </span>
            </label>
            <label className="form-field form-field--full">
              <span>Risk per trade <strong>{riskPercent.toFixed(2)}%</strong></span>
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
              <div className="slider-labels"><span>0.1%</span><span>Personal max 1%</span><span>2%</span></div>
            </label>
          </div>
          <div className="calculator-result">
            <div><span>Suggested size</span><strong>{lotSize.toFixed(2)} lots</strong></div>
            <div><span>Cash at risk</span><strong>{money(riskAmount)}</strong></div>
            <div><span>Stop price</span><strong>{(entry + (direction === "Long" ? -1 : 1) * stopDistance / 10).toFixed(2)}</strong></div>
            <div><span>Runway after loss</span><strong>{money(runwayAfter)}</strong></div>
          </div>
          <div className={clsx("trade-verdict", !isSafe && "trade-verdict--warning")}>
            {isSafe ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
            <div>
              <strong>{isSafe ? "This trade fits your risk plan" : "This trade is too large for the current runway"}</strong>
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
          <PanelHeading title="Personal circuit breakers" subtitle="Hard limits protect you from tilt" action={<Lock size={16} />} />
          <div className="limit-control">
            <div><span>Daily loss stop</span><small>Flatten and block new orders</small></div>
            <span className="input-prefix"><small>$</small><input type="number" value={dailyLoss} onChange={(e) => setDailyLoss(Number(e.target.value))} /></span>
          </div>
          <div className="limit-control">
            <div><span>Daily profit lock</span><small>Protect the green day</small></div>
            <span className="input-prefix"><small>$</small><input type="number" value={profitLock} onChange={(e) => setProfitLock(Number(e.target.value))} /></span>
          </div>
          <div className="limit-control">
            <div><span>Maximum trades</span><small>Entries allowed per session</small></div>
            <span className="stepper">
              <button onClick={() => setMaxTrades(Math.max(1, maxTrades - 1))}>−</button>
              <strong>{maxTrades}</strong>
              <button onClick={() => setMaxTrades(maxTrades + 1)}>+</button>
            </span>
          </div>
          <div className="limit-control">
            <div><span>Loss cooldown</span><small>Pause after 2 consecutive losses</small></div>
            <button className={clsx("toggle", cooldown && "active")} onClick={() => setCooldown((value) => !value)} aria-label="Toggle cooldown" aria-pressed={cooldown}><span /></button>
          </div>
          <div className="lock-notice"><Info size={15} />Once locked, these settings cannot change until 17:00 CT.</div>
          <button className="button button--primary button--full" onClick={() => onToast("Circuit breakers locked for this session")}>
            <Lock size={15} /> Lock for this session
          </button>
        </Panel>
      </div>

      <div className="risk-bottom-grid">
        <Panel>
          <PanelHeading title="Rule engine" subtitle="Transparent calculations—no hidden thresholds" action={<Pill tone="green">3 / 3 safe</Pill>} />
          <div className="rule-engine">
            <div className="rule-engine-row">
              <span className="rule-state rule-state--safe"><Check size={15} /></span>
              <div><strong>Daily loss limit</strong><small>Resets at 00:00 CE(S)T using starting equity</small></div>
              <div><span>Threshold</span><strong>$25,206.40</strong></div>
              <div><span>Current</span><strong>$26,817.20</strong></div>
              <Pill tone="green">$1,610.80 room</Pill>
              <button className="icon-btn icon-btn--small" onClick={() => setExpandedRule(expandedRule === "daily" ? null : "daily")} aria-label="Explain daily loss rule" aria-expanded={expandedRule === "daily"}><ChevronDown size={14} /></button>
            </div>
            <div className="rule-engine-row">
              <span className="rule-state rule-state--safe"><Check size={15} /></span>
              <div><strong>Maximum loss</strong><small>Static · calculated from initial balance</small></div>
              <div><span>Threshold</span><strong>$22,500.00</strong></div>
              <div><span>Current</span><strong>$26,817.20</strong></div>
              <Pill tone="green">$4,317.20 room</Pill>
              <button className="icon-btn icon-btn--small" onClick={() => setExpandedRule(expandedRule === "maximum" ? null : "maximum")} aria-label="Explain maximum loss rule" aria-expanded={expandedRule === "maximum"}><ChevronDown size={14} /></button>
            </div>
            <div className="rule-engine-row">
              <span className="rule-state rule-state--safe"><Check size={15} /></span>
              <div><strong>Consistency objective</strong><small>Best day must remain below 40% of net profit</small></div>
              <div><span>Limit</span><strong>40.0%</strong></div>
              <div><span>Current</span><strong>21.8%</strong></div>
              <Pill tone="green">18.2% buffer</Pill>
              <button className="icon-btn icon-btn--small" onClick={() => setExpandedRule(expandedRule === "consistency" ? null : "consistency")} aria-label="Explain consistency rule" aria-expanded={expandedRule === "consistency"}><ChevronDown size={14} /></button>
            </div>
            {expandedRule && (
              <div className="rule-detail">
                <Info size={15} />
                <div>
                  <strong>{expandedRule === "daily" ? "Daily loss uses the higher of balance or equity" : expandedRule === "maximum" ? "Maximum loss is static for this program" : "Consistency updates after each closed trading day"}</strong>
                  <span>{expandedRule === "daily" ? "Open P&L, commissions and swaps are included. The baseline resets at midnight CE(S)T." : expandedRule === "maximum" ? "The $22,500 floor never trails upward, so realized profit increases your usable runway." : "Your largest profitable day is divided by current net profit. Keep the result below 40%."}</span>
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
              <span className="runway-start"><small>Risk floor</small><strong>$22.5K</strong></span>
              <span className="runway-now"><small>Now</small><strong>$26.8K</strong></span>
            </div>
            <div className="runway-attempts">
              <strong>20.2</strong>
              <span>average losses before breach</span>
            </div>
          </div>
          <div className="scenario-list">
            <div><span>At 0.25% risk</span><strong>64 attempts</strong><Pill tone="green">Conservative</Pill></div>
            <div><span>At 0.50% risk</span><strong>32 attempts</strong><Pill tone="blue">Your plan</Pill></div>
            <div><span>At 1.00% risk</span><strong>16 attempts</strong><Pill tone="amber">Elevated</Pill></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function JournalPage({ onExport, onToast }: { onExport: () => void; onToast: (message: string) => void }) {
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
          <div className="summary-score"><span>86</span><small>Discipline</small></div>
          <div>
            <span>Review streak</span>
            <strong>12 trading days</strong>
            <small>You have reviewed 94% of closed trades this month.</small>
          </div>
        </div>
        <div className="journal-summary-stats">
          <div><span>Trades logged</span><strong>61</strong><small>30-day period</small></div>
          <div><span>Plan adherence</span><strong>86%</strong><small className="positive">+9% improvement</small></div>
          <div><span>Best setup</span><strong>Liquidity sweep</strong><small>+1.64R expectancy</small></div>
          <div><span>Cost of mistakes</span><strong className="negative">-$412</strong><small>4 off-plan trades</small></div>
        </div>
      </Panel>

      <Panel>
        <div className="journal-toolbar">
          <label className="search-field"><Search size={16} /><input placeholder="Search market or setup…" value={query} onChange={(e) => setQuery(e.target.value)} /></label>
          <div className="filter-tabs filter-tabs--small">
            {["All", "Wins", "Losses"].map((item) => <button className={result === item ? "active" : ""} onClick={() => setResult(item)} key={item}>{item}</button>)}
          </div>
          <button className="button button--secondary" onClick={() => onToast("Date range changed to the current 30-day period")}><CalendarDays size={15} /> Jun 01 – Jun 28</button>
          <button className="button button--secondary" onClick={() => onToast("Advanced journal filters opened")}><Filter size={15} /> More filters</button>
          <button className="button button--secondary" onClick={onExport}><Download size={15} /> CSV</button>
        </div>
        <TradeTable items={filtered} onInspect={setSelectedTrade} />
      </Panel>

      <div className="journal-grid">
        <Panel>
          <PanelHeading title="Behavior pattern" subtitle="Detected across your last 30 sessions" action={<Pill tone="violet"><Sparkles size={12} /> AI insight</Pill>} />
          <div className="behavior-card">
            <div className="behavior-icon"><TimerReset size={21} /></div>
            <div>
              <strong>Your second trade after a loss is the danger zone.</strong>
              <p>You take 37% more size and enter 2.4× faster than usual. These trades generated <span className="negative">-$286</span> this month.</p>
              <div className="behavior-actions">
                <button className="button button--primary" onClick={() => onToast("Post-loss cooldown added to your risk plan")}>Add 15-min cooldown</button>
                <button className="text-button" onClick={() => { setResult("Losses"); setQuery(""); }}>View matching trades <ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Review queue" subtitle="Trades that need context" />
          <div className="review-queue">
            {trades.filter((trade) => !trade.followedPlan).map((trade) => (
              <button key={trade.id} onClick={() => setSelectedTrade(trade)}>
                <span className="market-short"><TrendingDown size={15} /></span>
                <div><strong>{trade.symbol} · {trade.setup}</strong><small>{trade.opened} · {signedMoney(trade.pnl)}</small></div>
                <Pill tone="amber">Review</Pill>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </Panel>
      </div>

      {selectedTrade && <TradeDrawer trade={selectedTrade} onClose={() => setSelectedTrade(null)} onSave={() => { setSelectedTrade(null); onToast("Journal review saved"); }} />}
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
          <div><Pill tone={trade.pnl >= 0 ? "green" : "red"}>{signedMoney(trade.pnl)}</Pill><h2>{trade.symbol} · {trade.side}</h2><p>{trade.opened} → {trade.closed}</p></div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="trade-detail-chart">
          <div className="fake-candles">
            {[42, 56, 35, 61, 48, 72, 64, 83, 68, 52, 44, 35, 30, 24, 18].map((height, index) => (
              <i className={index > 7 ? "down" : ""} style={{ height: `${height}%` }} key={index}><span /></i>
            ))}
          </div>
          <span className="chart-entry">Entry {number(trade.entry, 2)}</span>
          <span className="chart-stop">Stop {number(trade.stop, 2)}</span>
        </div>
        <div className="drawer-metrics">
          <div><span>Result</span><strong className={trade.pnl >= 0 ? "positive" : "negative"}>{trade.resultR.toFixed(2)}R</strong></div>
          <div><span>MFE</span><strong>{trade.mfe.toFixed(2)}R</strong></div>
          <div><span>MAE</span><strong>{trade.mae.toFixed(2)}R</strong></div>
          <div><span>Duration</span><strong>33 min</strong></div>
        </div>
        <label className="drawer-field"><span>Trade plan</span><textarea defaultValue={trade.plan} /></label>
        <label className="drawer-field"><span>Review note</span><textarea defaultValue={trade.note} /></label>
        <div className="drawer-field">
          <span>Emotional state</span>
          <div className="emotion-picker">
            {(["Focused", "Patient", "Rushed", "Confident"] as const).map((item) => <button className={emotion === item ? "active" : ""} onClick={() => setEmotion(item)} key={item}>{item}</button>)}
          </div>
        </div>
        <label className="check-row"><input type="checkbox" checked={followedPlan} onChange={(event) => setFollowedPlan(event.target.checked)} /><span><Check size={14} /></span> I followed my trading plan</label>
        <div className="drawer-actions"><button className="button button--secondary" onClick={onClose}>Cancel</button><button className="button button--primary" onClick={onSave}>Save review</button></div>
      </aside>
    </>
  );
}

function PayoutsPage({ onToast }: { onToast: (message: string) => void }) {
  const [selected, setSelected] = useState("Funded $100K");
  const [scheduled, setScheduled] = useState(false);
  const eligible = selected === "Funded $100K" ? 3857.22 : 2284.4;
  const downloadStatements = () => {
    const rows = [
      "Request,Requested,Account,Gross amount,Split,Method,Status,Completed",
      ...payoutHistory.map((item) => [item.id, item.requested, item.account, item.amount, item.split, item.method, item.status, item.completed].map((value) => `"${value}"`).join(",")),
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
          <Pill tone="green"><CheckCircle2 size={12} /> Eligible in 2 days</Pill>
          <h2>{money(eligible)}</h2>
          <p>Estimated amount available after your 90% profit split.</p>
          <div className="payout-account-select">
            <span>From</span>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option>Funded $100K</option>
              <option>Swing $50K</option>
            </select>
          </div>
          <button className="button button--primary" disabled={scheduled} onClick={() => { setScheduled(true); onToast("Payout request scheduled for June 30"); }}>
            {scheduled ? <><Check size={15} /> Payout scheduled</> : <>Schedule payout <ArrowRight size={15} /></>}
          </button>
        </div>
        <div className="payout-readiness">
          <div className="readiness-ring"><div><strong>92%</strong><small>ready</small></div></div>
          <div className="eligibility-list">
            <div><CheckCircle2 size={16} /><span><strong>Minimum trading days</strong><small>8 of 5 completed</small></span></div>
            <div><CheckCircle2 size={16} /><span><strong>Consistency</strong><small>Best day is 21.8% of profit</small></span></div>
            <div><Clock3 size={16} /><span><strong>Payout cycle</strong><small>Unlocks Jun 30 at 08:00</small></span></div>
          </div>
        </div>
      </Panel>

      <div className="payout-grid">
        <Panel>
          <PanelHeading title="Lifetime rewards" subtitle="Net payouts received" action={<Pill tone="green">3 paid</Pill>} />
          <div className="lifetime-value"><strong>{money(6029)}</strong><span>+$2,840 in the last 30 days</span></div>
          <div className="chart-wrap chart-wrap--small">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPnL} margin={{ left: -25, right: 0, top: 10 }}>
                <CartesianGrid stroke="#27313a" strokeDasharray="3 5" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8997a5", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8997a5", fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip cursor={{ fill: "#18212a" }} content={<ChartTooltip />} />
                <Bar dataKey="pnl" name="Payout" fill="#55d6be" radius={[5, 5, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Scaling path" subtitle="Grow allocation through consistency" action={<Pill tone="blue">Level 2</Pill>} />
          <div className="scaling-track">
            <div className="scale-level complete"><span><Check size={15} /></span><div><strong>$100K</strong><small>Current allocation</small></div></div>
            <i className="complete" />
            <div className="scale-level active"><span>2</span><div><strong>$125K</strong><small>+$8K profit required</small></div></div>
            <i />
            <div className="scale-level"><span>3</span><div><strong>$150K</strong><small>Next milestone</small></div></div>
          </div>
          <div className="scale-progress">
            <div><span>Progress to $125K</span><strong>54%</strong></div>
            <div className="progress-track"><span className="progress-fill progress-fill--blue" style={{ width: "54%" }} /></div>
            <small>$3,714 more net profit · minimum 2 months</small>
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHeading title="Payout history" subtitle="Every request, status change, and settlement" action={<button className="button button--secondary" onClick={downloadStatements}><Download size={15} /> Statements</button>} />
        <div className="payout-table">
          <div className="payout-row payout-row--head"><span>Request</span><span>Account</span><span>Gross amount</span><span>Split</span><span>Method</span><span>Status</span><span>Completed</span></div>
          {payoutHistory.map((item) => (
            <div className="payout-row" key={item.id}>
              <span><strong>{item.id}</strong><small>{item.requested}</small></span>
              <span>{item.account}</span>
              <span><strong>{money(item.amount)}</strong></span>
              <span>{item.split}</span>
              <span>{item.method}</span>
              <span><Pill tone="green"><Check size={11} /> {item.status}</Pill></span>
              <span>{item.completed}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function CalendarPage({ onToast, onDialog }: { onToast: (message: string) => void; onDialog: (dialog: AppDialog) => void }) {
  const [impact, setImpact] = useState("All");
  const [watching, setWatching] = useState<string[]>(["Core PCE Price Index m/m"]);
  const [dayOffset, setDayOffset] = useState(0);
  const selectedDate = new Date(2026, 5, 28 + dayOffset).toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const toggleWatch = (event: string) => {
    setWatching((items) => items.includes(event) ? items.filter((item) => item !== event) : [...items, event]);
    onToast(watching.includes(event) ? "Event alert removed" : "Event alert created");
  };
  const visible = calendarEvents.filter((event) => impact === "All" || event.impact === impact);
  return (
    <div className="page-stack">
      <div className="calendar-alert-banner">
        <span className="alert-live"><Radio size={14} /> Live risk window</span>
        <div><strong>USD high-impact news in 42 minutes</strong><p>Your account restricts new orders 15 minutes before and 5 minutes after the release.</p></div>
        <div className="countdown"><span>00</span><i>:</i><span>42</span><i>:</i><span>18</span><small>HH&nbsp;&nbsp;&nbsp;MM&nbsp;&nbsp;&nbsp;SS</small></div>
      </div>
      <Panel>
        <div className="calendar-toolbar">
          <div className="date-navigator"><button className="icon-btn" onClick={() => setDayOffset((value) => value - 1)} aria-label="Previous day"><ChevronRight className="rotate-180" size={16} /></button><div><strong>{selectedDate}</strong><small>Africa/Douala · GMT+1</small></div><button className="icon-btn" onClick={() => setDayOffset((value) => value + 1)} aria-label="Next day"><ChevronRight size={16} /></button><button className="button button--secondary" onClick={() => setDayOffset(0)}>Today</button></div>
          <div className="filter-tabs filter-tabs--small">{["All", "High", "Medium", "Low"].map((item) => <button className={impact === item ? "active" : ""} onClick={() => setImpact(item)} key={item}>{item}</button>)}</div>
          <button className="button button--secondary" onClick={() => { setImpact("High"); onToast("Showing only events that can restrict trading"); }}><Settings size={15} /> Risk events only</button>
        </div>
        <div className="calendar-table">
          <div className="calendar-row calendar-row--head"><span>Time</span><span>Impact</span><span>Event</span><span>Forecast</span><span>Previous</span><span>Trading status</span><span /></div>
          {visible.map((event) => (
            <div className={clsx("calendar-row", event.impact === "High" && "calendar-row--high")} key={event.event}>
              <span><strong>{event.time}</strong><small>GMT+1</small></span>
              <span><i className={`impact-bars impact-bars--${event.impact.toLowerCase()}`}><b /><b /><b /></i><small>{event.impact}</small></span>
              <span><span className="currency-badge">{event.currency}</span><div><strong>{event.event}</strong><small>Economic release</small></div></span>
              <span>{event.forecast}</span>
              <span>{event.previous}</span>
              <span>{event.impact === "High" ? <Pill tone="red"><Lock size={11} /> Restricted</Pill> : <Pill tone="green">Allowed</Pill>}</span>
              <span><button className={clsx("icon-btn icon-btn--small", watching.includes(event.event) && "icon-btn--active")} onClick={() => toggleWatch(event.event)}><Bell size={14} /></button></span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="calendar-info-grid">
        <Panel>
          <PanelHeading title="Your news rule" subtitle="Two-Step Pro · NX-204981" action={<button className="text-button" onClick={() => onDialog({ title: "Restricted news trading terms", description: "New entries, manual exits, and triggered pending orders are prohibited from 15 minutes before until 5 minutes after a high-impact release. Existing positions may remain open.", detail: "Rule source: Two-Step Pro · version 4.2", actionLabel: "I understand" })}>View terms <ArrowRight size={14} /></button>} />
          <div className="rule-explainer">
            <div className="timeline-rule"><span className="safe-zone">Allowed</span><span className="blocked-zone">15m before</span><i>Release</i><span className="blocked-zone short">5m after</span><span className="safe-zone">Allowed</span></div>
            <p>You may hold positions through news. Opening or closing a trade inside the restricted window is a rule violation, including pending orders triggered during that window.</p>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Upcoming alerts" subtitle={`${watching.length} events watched`} />
          <div className="watch-list">
            {watching.map((item) => <div key={item}><span><Bell size={15} /></span><div><strong>{item}</strong><small>15 minutes before · Push + email</small></div><button className="icon-btn icon-btn--small" onClick={() => toggleWatch(item)}><X size={14} /></button></div>)}
            {watching.length === 0 && <p className="empty-state">No event alerts yet.</p>}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AchievementsPage({ onToast }: { onToast: (message: string) => void }) {
  const downloadCertificate = (title: string, subtitle: string, date: string) => {
    const certificate = `NOVA FUNDING CERTIFICATE\n\n${title}\n${subtitle}\n\nAwarded to Nji Halle\n${date}\n\nVerification: nova.fund/trader/njihalle`;
    const blob = new Blob([certificate], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title.toLowerCase().replaceAll(" ", "-")}-certificate.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    onToast(`${title} certificate downloaded`);
  };
  return (
    <div className="page-stack">
      <Panel className="level-hero">
        <div>
          <Pill tone="violet"><Trophy size={12} /> Level 4 trader</Pill>
          <h2>Consistent Operator</h2>
          <p>You are building the habits prop firms want to scale: controlled losses, repeatable execution, and clean reviews.</p>
          <div className="level-progress"><div><span>2,840 XP</span><span>3,500 XP to Level 5</span></div><div className="progress-track"><span className="progress-fill progress-fill--violet" style={{ width: "81%" }} /></div></div>
        </div>
        <div className="level-medal"><Trophy size={52} /><span>04</span></div>
      </Panel>
      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <article className={`achievement-card achievement-card--${achievement.tone}`} key={achievement.title}>
            <div className="certificate-pattern" />
            <span className="achievement-seal">{achievement.tone === "amber" ? <CircleDollarSign size={24} /> : achievement.tone === "blue" ? <ShieldCheck size={24} /> : <Award size={24} />}</span>
            <p>NOVA FUNDING CERTIFICATE</p>
            <h3>{achievement.title}</h3>
            <span>{achievement.subtitle}</span>
            <small>Awarded to Nji Halle · {achievement.date}</small>
            <button onClick={() => downloadCertificate(achievement.title, achievement.subtitle, achievement.date)}><Download size={14} /> Download</button>
          </article>
        ))}
      </div>
      <div className="achievement-lower-grid">
        <Panel>
          <PanelHeading title="Milestone path" subtitle="Next achievements within reach" />
          <div className="milestone-list">
            <div><span className="milestone-icon complete"><Check size={16} /></span><div><strong>First payout</strong><small>Completed Apr 01, 2026</small></div><strong>+500 XP</strong></div>
            <div><span className="milestone-icon active"><Trophy size={16} /></span><div><strong>$10K lifetime rewards</strong><small>$6,029 of $10,000 · 60% complete</small><div className="progress-track"><span className="progress-fill progress-fill--amber" style={{ width: "60%" }} /></div></div><strong>+1,000 XP</strong></div>
            <div><span className="milestone-icon"><Shield size={16} /></span><div><strong>60-day discipline streak</strong><small>30 of 60 days completed</small></div><strong>+750 XP</strong></div>
          </div>
        </Panel>
        <Panel>
          <PanelHeading title="Public trader profile" subtitle="A verified record you control" action={<Pill tone="green"><Check size={11} /> Verified</Pill>} />
          <div className="public-profile">
            <div className="public-profile-head"><span>NH</span><div><strong>Nji Halle</strong><small>@njihalle · Cameroon</small></div><BadgeCheck size={18} /></div>
            <div className="public-stats"><div><strong>$150K</strong><span>Funded</span></div><div><strong>3</strong><span>Payouts</span></div><div><strong>86</strong><span>Discipline</span></div></div>
            <div className="profile-url"><span>nova.fund/trader/njihalle</span><button onClick={() => { void navigator.clipboard?.writeText("https://nova.fund/trader/njihalle"); onToast("Public profile link copied"); }}><Copy size={14} /> Copy</button></div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AcademyPage({ onToast }: { onToast: (message: string) => void }) {
  const [activeLesson, setActiveLesson] = useState("Stop giving back green days");
  const lessons = [
    { icon: Shield, title: "Mastering drawdown math", detail: "8 min · Risk management", progress: 100 },
    { icon: Target, title: "Build a repeatable pre-trade routine", detail: "12 min · Psychology", progress: 62 },
    { icon: BarChart3, title: "Use MFE and MAE to refine exits", detail: "10 min · Analytics", progress: 0 },
    { icon: Newspaper, title: "Trading around high-impact news", detail: "6 min · Firm rules", progress: 0 },
  ];
  return (
    <div className="page-stack">
      <Panel className="academy-hero">
        <div><Pill tone="violet"><Sparkles size={12} /> Recommended for you</Pill><h2>Stop giving back green days</h2><p>Your journal shows that 68% of avoidable loss happens after you reach +1.5R on the day. This 8-minute lesson builds a practical stop-for-the-day rule.</p><button className="button button--primary" onClick={() => { setActiveLesson("Stop giving back green days"); onToast("Lesson resumed at 04:18"); }}>Continue lesson <ArrowRight size={15} /></button></div>
        <div className="lesson-visual"><div><span><BookOpen size={26} /></span><strong>68%</strong><small>of avoidable loss</small></div></div>
      </Panel>
      <div className="academy-grid">
        {lessons.map((lesson) => {
          const Icon = lesson.icon;
          return <article className={clsx("lesson-card", activeLesson === lesson.title && "lesson-card--active")} key={lesson.title}><span><Icon size={20} /></span><Pill tone={lesson.progress === 100 ? "green" : lesson.progress > 0 ? "blue" : "neutral"}>{lesson.progress === 100 ? "Completed" : lesson.progress > 0 ? "In progress" : "New"}</Pill><h3>{lesson.title}</h3><p>{lesson.detail}</p><div className="progress-track"><span className="progress-fill progress-fill--blue" style={{ width: `${lesson.progress}%` }} /></div><button onClick={() => { setActiveLesson(lesson.title); onToast(`${lesson.title} opened`); }}>{lesson.progress > 0 ? "Continue" : "Start lesson"} <ArrowRight size={14} /></button></article>;
        })}
      </div>
      <Panel>
        <PanelHeading title="Learning paths" subtitle="Structured skills for each funding stage" />
        <div className="learning-paths">
          <div><span><ShieldCheck size={22} /></span><div><Pill tone="green">6 of 8 complete</Pill><h3>Evaluation survival</h3><p>Rule mastery, sizing, drawdown and consistency.</p></div><button className="icon-btn" onClick={() => onToast("Evaluation survival path opened")} aria-label="Open evaluation survival path"><ArrowRight size={16} /></button></div>
          <div><span><CircleDollarSign size={22} /></span><div><Pill tone="blue">2 of 7 complete</Pill><h3>Funded longevity</h3><p>Payout planning, scaling, and capital preservation.</p></div><button className="icon-btn" onClick={() => onToast("Funded longevity path opened")} aria-label="Open funded longevity path"><ArrowRight size={16} /></button></div>
          <div><span><Activity size={22} /></span><div><Pill tone="neutral">0 of 6 complete</Pill><h3>Professional analytics</h3><p>Expectancy, excursions, regimes, and robust review.</p></div><button className="icon-btn" onClick={() => onToast("Professional analytics path opened")} aria-label="Open professional analytics path"><ArrowRight size={16} /></button></div>
        </div>
      </Panel>
    </div>
  );
}

function SupportPage({ onToast }: { onToast: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const topics = [
    { icon: Shield, title: "Rules & objectives", count: "18 articles" },
    { icon: WalletCards, title: "Payouts", count: "12 articles" },
    { icon: BriefcaseBusiness, title: "Account setup", count: "9 articles" },
    { icon: BarChart3, title: "Platform & data", count: "14 articles" },
    { icon: UserRound, title: "Profile & verification", count: "8 articles" },
    { icon: CircleDollarSign, title: "Billing", count: "11 articles" },
  ];
  return (
    <div className="page-stack">
      <Panel className="support-search-panel">
        <div><span><HelpCircle size={28} /></span><h2>What can we help you with?</h2><p>Clear answers about your account, rules, payouts, and platform.</p><label className="support-search"><Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for an answer…" /><kbd>Enter</kbd></label></div>
      </Panel>
      <div className="support-topics">
        {topics.filter((topic) => topic.title.toLowerCase().includes(query.toLowerCase())).map((topic) => { const Icon = topic.icon; return <button className={selectedTopic === topic.title ? "active" : ""} onClick={() => { setSelectedTopic(topic.title); onToast(`${topic.title} articles loaded`); }} key={topic.title}><span><Icon size={20} /></span><div><strong>{topic.title}</strong><small>{topic.count}</small></div><ChevronRight size={16} /></button>; })}
      </div>
      <div className="support-lower">
        <Panel>
          <PanelHeading title="Popular answers" subtitle="Most useful this week" />
          <div className="faq-list">
            {["How is the daily loss limit calculated?", "When does my dashboard update?", "What makes an account payout eligible?", "How do restricted news windows work?", "Can I hold trades overnight and on weekends?"].map((item, index) => (
              <div className="faq-item" key={item}>
                <button onClick={() => setExpandedFaq(expandedFaq === item ? null : item)} aria-expanded={expandedFaq === item}><span>{index + 1}</span>{item}<ChevronRight className={expandedFaq === item ? "rotate-90" : ""} size={15} /></button>
                {expandedFaq === item && <p>{index === 0 ? "The limit includes realized P&L, floating P&L, commissions and swaps. Its reference equity resets at the firm’s stated trading-day boundary." : index === 1 ? "Live equity updates continuously. Settled objectives and consistency metrics finalize after the trading day closes." : index === 2 ? "Eligibility combines minimum profitable days, consistency, available profit and the account’s payout-cycle date." : index === 3 ? "NOVA marks the exact restricted window around each high-impact release and alerts you before it begins." : "Overnight and weekend holding depends on the program. Your account card and rule engine show the policy that applies to the selected account."}</p>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="contact-panel">
          <PanelHeading title="Still need help?" subtitle="Our trader success team is online" />
          <div className="agent-stack"><span>AM</span><span>JK</span><span>RS</span><i /></div>
          <h3>Talk to a real person</h3>
          <p>Average first reply is under 3 minutes. Include your account ID so we can help faster.</p>
          <button className="button button--primary button--full" onClick={() => onToast("Live support conversation started")}><Headphones size={16} /> Start live chat</button>
          <button className="button button--secondary button--full" onClick={() => onToast("Support ticket draft created")}><FileText size={16} /> Submit a ticket</button>
          <small>Support available 24/5 · English, French + 8 more</small>
        </Panel>
      </div>
    </div>
  );
}

function SettingsPage({
  onToast,
  onDialog,
}: {
  onToast: (message: string) => void;
  onDialog: (dialog: AppDialog) => void;
}) {
  const [tab, setTab] = useState<"profile" | "connections" | "notifications" | "security">("profile");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  return (
    <div className="settings-layout">
      <Panel className="settings-nav">
        <div className="settings-profile">
          <span>NH</span>
          <div><strong>Nji Halle</strong><small>nji.halle@example.com</small></div>
          <Pill tone="green"><BadgeCheck size={11} /> Verified</Pill>
        </div>
        {[
          { id: "profile", label: "Profile & preferences", icon: UserRound },
          { id: "connections", label: "Platform connections", icon: RefreshCw },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security & sessions", icon: Shield },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id as typeof tab)} key={item.id}>
              <Icon size={16} />{item.label}<ChevronRight size={14} />
            </button>
          );
        })}
      </Panel>

      <Panel className="settings-content">
        {tab === "profile" && (
          <>
            <PanelHeading title="Profile & preferences" subtitle="Used for certificates, payouts, and support" />
            <div className="settings-form">
              <label><span>Full legal name</span><input defaultValue="Nji Halle Cho-Nkwenti" /></label>
              <label><span>Display name</span><input defaultValue="Nji Halle" /></label>
              <label><span>Email address</span><input type="email" defaultValue="nji.halle@example.com" /></label>
              <label><span>Phone number</span><input type="tel" defaultValue="+237 6 70 00 00 00" /></label>
              <label><span>Timezone</span><select defaultValue="Africa/Douala"><option>Africa/Douala</option><option>Europe/London</option><option>America/New_York</option></select></label>
              <label><span>Base currency</span><select defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option></select></label>
            </div>
            <div className="settings-actions"><button className="button button--secondary" onClick={() => onToast("Profile changes discarded")}>Discard</button><button className="button button--primary" onClick={() => onToast("Profile preferences saved")}>Save changes</button></div>
          </>
        )}

        {tab === "connections" && (
          <>
            <PanelHeading title="Platform connections" subtitle="Read-only synchronization for trades and account rules" action={<button className="button button--primary" onClick={() => onDialog({ title: "Connect a platform", description: "Choose your platform, then add investor credentials or authorize the secure API connection.", detail: "MT4 · MT5 · cTrader · DXtrade", actionLabel: "Choose platform" })}><Plus size={14} /> Add connection</button>} />
            <div className="connection-list">
              {[
                { name: "MetaTrader 5", account: "NX-204981 · NOVA-Live 02", sync: "8 seconds ago", tone: "green" },
                { name: "cTrader", account: "NX-184023 · NOVA-cT Live", sync: "42 seconds ago", tone: "blue" },
                { name: "DXtrade", account: "NX-095426 · NOVA-Demo", sync: "2 minutes ago", tone: "violet" },
              ].map((connection) => (
                <div key={connection.account}>
                  <span className={`connection-logo connection-logo--${connection.tone}`}>{connection.name.slice(0, 2)}</span>
                  <div><strong>{connection.name}</strong><small>{connection.account}</small></div>
                  <span className="connection-sync"><i />Synced {connection.sync}</span>
                  <button className="button button--secondary" onClick={() => onToast(`${connection.name} synchronized`)}><RefreshCw size={14} /> Sync now</button>
                  <button className="icon-btn" onClick={() => onDialog({ title: `Disconnect ${connection.name}?`, description: "Historical analytics will remain available, but live equity, rules and new trades will stop updating.", actionLabel: "Disconnect" })} aria-label={`Disconnect ${connection.name}`}><X size={15} /></button>
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
                { title: "Email alerts", detail: "Payouts, verification and account status", value: emailAlerts, set: setEmailAlerts },
                { title: "Push notifications", detail: "Live risk and economic-event warnings", value: pushAlerts, set: setPushAlerts },
                { title: "Risk threshold alerts", detail: "Warn at 50%, 75% and 90% rule utilization", value: riskAlerts, set: setRiskAlerts },
                { title: "Weekly performance report", detail: "Analytics summary every Sunday", value: weeklyReport, set: setWeeklyReport },
              ].map((preference) => (
                <div key={preference.title}><div><strong>{preference.title}</strong><small>{preference.detail}</small></div><button className={clsx("toggle", preference.value && "active")} onClick={() => preference.set(!preference.value)} aria-pressed={preference.value}><span /></button></div>
              ))}
            </div>
            <div className="settings-actions"><button className="button button--primary" onClick={() => onToast("Notification preferences saved")}>Save preferences</button></div>
          </>
        )}

        {tab === "security" && (
          <>
            <PanelHeading title="Security & sessions" subtitle="Protect access to accounts and payout details" />
            <div className="security-cards">
              <div><span><KeyRound size={19} /></span><div><strong>Two-factor authentication</strong><small>Authenticator app enabled · recovery codes saved</small></div><button className="button button--secondary" onClick={() => onDialog({ title: "Manage two-factor authentication", description: "Generate new recovery codes or move your authenticator to another device.", actionLabel: "Continue securely" })}>Manage</button></div>
              <div><span><ShieldCheck size={19} /></span><div><strong>Identity verification</strong><small>Verified on June 04, 2026</small></div><Pill tone="green"><Check size={11} /> Complete</Pill></div>
              <div><span><RefreshCw size={19} /></span><div><strong>Active sessions</strong><small>2 devices · last active just now</small></div><button className="button button--secondary" onClick={() => onDialog({ title: "Sign out other sessions?", description: "This browser will remain signed in. Every other device will need to authenticate again.", actionLabel: "Sign out others" })}>Review</button></div>
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}

function ActionDialog({
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
      <div className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="action-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="action-dialog-icon"><Sparkles size={22} /></div>
        <button className="icon-btn action-dialog-close" onClick={onClose} aria-label="Close dialog"><X size={17} /></button>
        <h2 id="action-dialog-title">{dialog.title}</h2>
        <p>{dialog.description}</p>
        {dialog.detail && <div className="action-dialog-detail"><Info size={15} />{dialog.detail}</div>}
        <div className="action-dialog-actions"><button className="button button--secondary" onClick={onClose}>Cancel</button><button className="button button--primary" onClick={onConfirm}>{dialog.actionLabel ?? "Done"}<ArrowRight size={14} /></button></div>
      </div>
    </div>
  );
}

function NotificationsPanel({
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
        <div className="notifications-head"><div><h2>Notifications</h2><p>3 new updates</p></div><button className="icon-btn" onClick={onClose}><X size={18} /></button></div>
        <div className="notification-group">
          <p>Today</p>
          <button onClick={() => onNavigate("/dashboard/calendar")}><span className="notification-icon notification-icon--red"><AlertTriangle size={17} /></span><div><strong>High-impact USD event</strong><p>Your restricted trading window begins in 27 minutes.</p><small>15 min ago</small></div><i /></button>
          <button onClick={() => onNavigate("/dashboard/risk")}><span className="notification-icon notification-icon--green"><ShieldCheck size={17} /></span><div><strong>Risk level back to safe</strong><p>Open exposure dropped below your personal 1% threshold.</p><small>1 hour ago</small></div><i /></button>
          <button onClick={() => onNavigate("/dashboard/payouts")}><span className="notification-icon notification-icon--blue"><WalletCards size={17} /></span><div><strong>Payout window approaching</strong><p>Your $100K funded account becomes eligible in 2 days.</p><small>3 hours ago</small></div><i /></button>
        </div>
        <div className="notification-group">
          <p>Yesterday</p>
          <button onClick={() => onNavigate("/dashboard/journal")}><span className="notification-icon notification-icon--violet"><Sparkles size={17} /></span><div><strong>New behavior insight</strong><p>We found a pattern in your post-loss trading.</p><small>Yesterday · 18:42</small></div></button>
          <button onClick={() => onNavigate("/dashboard/accounts")}><span className="notification-icon"><RefreshCw size={17} /></span><div><strong>Account synchronized</strong><p>61 trades imported successfully from MT5.</p><small>Yesterday · 17:05</small></div></button>
        </div>
        <div className="notifications-footer"><button onClick={onMarkRead}>Mark all as read</button><button onClick={onSettings}>Notification settings</button></div>
      </aside>
    </>
  );
}

function CommandPalette({ onClose, onNavigate }: { onClose: () => void; onNavigate: (href: string) => void }) {
  const [query, setQuery] = useState("");
  const actions = useMemo(() => [
    ...navGroups.flatMap((group) => group.items.map((item) => ({ label: item.label, sub: group.label, icon: item.icon, href: item.href }))),
    { label: "Open trade reports", sub: "Action", icon: Download, href: "/dashboard/journal" },
    { label: "Open position size calculator", sub: "Action", icon: Target, href: "/dashboard/risk" },
    { label: "Open payout center", sub: "Action", icon: WalletCards, href: "/dashboard/payouts" },
  ].filter((action) => `${action.label} ${action.sub}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <div className="command-overlay" onMouseDown={onClose}>
      <div className="command-palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="command-input"><Search size={19} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages, accounts, trades, or actions…" /><kbd>ESC</kbd></div>
        <div className="command-results">
          <p>{query ? "Results" : "Quick access"}</p>
          {actions.map((action) => { const Icon = action.icon; return <button onClick={() => onNavigate(action.href)} key={`${action.label}-${action.sub}`}><span><Icon size={17} /></span><div><strong>{action.label}</strong><small>{action.sub}</small></div><kbd>↵</kbd></button>; })}
          {actions.length === 0 && <div className="command-empty"><Search size={25} /><strong>No matching result</strong><span>Try a page name, account, or action.</span></div>}
        </div>
        <div className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>esc</kbd> Close</span></div>
      </div>
    </div>
  );
}

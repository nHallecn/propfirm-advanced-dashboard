"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { accounts } from "@/data/dashboard";
import { titleMap } from "./dashboard/config";
import type { AppDialog, Range } from "./dashboard/types";
import {
  ActionDialog,
  CommandPalette,
  NotificationsPanel,
  PageHeader,
  Sidebar,
  Topbar,
} from "./dashboard/shell";
import OverviewPage from "./dashboard/pages/overview-page";
import AccountsPage from "./dashboard/pages/accounts-page";
import AnalyticsPage from "./dashboard/pages/analytics-page";
import RiskPage from "./dashboard/pages/risk-page";
import JournalPage from "./dashboard/pages/journal-page";
import PayoutsPage from "./dashboard/pages/payouts-page";
import CalendarPage from "./dashboard/pages/calendar-page";
import AchievementsPage from "./dashboard/pages/achievements-page";
import AcademyPage from "./dashboard/pages/academy-page";
import SupportPage from "./dashboard/pages/support-page";
import SettingsPage from "./dashboard/pages/settings-page";

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
  const meta = titleMap[section];

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

  const exportTrades = async () => {
    const { trades } = await import("@/data/dashboard");
    const headers = ["id", "symbol", "side", "opened", "setup", "lots", "pnl", "resultR"];
    const rows = trades.map((trade) =>
      [trade.id, trade.symbol, trade.side, trade.opened, trade.setup, trade.lots, trade.pnl, trade.resultR]
        .map((value) => `"${value}"`)
        .join(","),
    );
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nova-trade-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Trade report exported");
  };

  const handleHeaderAction = () => {
    if (section === "risk") {
      showToast("Risk settings locked until the next session");
      return;
    }
    if (section === "journal") {
      openDialog({
        title: "Create a journal entry",
        description: "Start a manual review for an unimported trade or a session-level note.",
        detail: "The entry will be attached to Primary $25K and today’s session.",
        actionLabel: "Create entry",
      });
      return;
    }
    if (section === "accounts") {
      openDialog({
        title: "Connect a trading account",
        description:
          "Choose MT4, MT5, cTrader or DXtrade, then authenticate with read-only investor credentials.",
        detail: "Credentials are encrypted and can never place or modify trades.",
        actionLabel: "Connect account",
      });
      return;
    }
    router.push("/dashboard/accounts");
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
            description:
              "Choose an account size and evaluation model. Your current risk preferences will be carried into the new account.",
            detail: "$25K Two-Step Pro · $89 · 90% reward split",
            actionLabel: "Continue to checkout",
          })
        }
      />
      {sidebarOpen && (
        <button className="mobile-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />
      )}

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
              description:
                "Your synchronized account data is safe. You will need to verify your identity again to access payout settings.",
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
            onAction={handleHeaderAction}
          />
          {section === "overview" && (
            <OverviewPage
              account={account}
              range={range}
              onNavigate={(href) => router.push(href)}
              onToast={showToast}
            />
          )}
          {section === "accounts" && (
            <AccountsPage
              accountId={accountId}
              onSelect={setAccountId}
              onToast={showToast}
              onDialog={openDialog}
            />
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

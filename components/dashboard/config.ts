import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  Shield,
  Trophy,
  WalletCards,
} from "lucide-react";
import type { PageMeta } from "./types";

export const navGroups = [
  {
    label: "Workspace",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
      {
        id: "accounts",
        label: "My accounts",
        icon: BriefcaseBusiness,
        href: "/dashboard/accounts",
        count: "4",
      },
      { id: "analytics", label: "Performance", icon: BarChart3, href: "/dashboard/analytics" },
      { id: "risk", label: "Risk center", icon: Shield, href: "/dashboard/risk", badge: "Live" },
      { id: "journal", label: "Trade journal", icon: BookOpen, href: "/dashboard/journal" },
    ],
  },
  {
    label: "Funding",
    items: [
      { id: "payouts", label: "Payouts", icon: WalletCards, href: "/dashboard/payouts" },
      {
        id: "calendar",
        label: "Market calendar",
        icon: CalendarDays,
        href: "/dashboard/calendar",
        count: "2",
      },
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
] as const;

export const titleMap: Record<string, PageMeta> = {
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

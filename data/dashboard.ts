export type AccountStatus = "Funded" | "Evaluation" | "Passed";

export type TradingAccount = {
  id: string;
  label: string;
  firm: string;
  program: string;
  phase: string;
  platform: string;
  status: AccountStatus;
  startingBalance: number;
  balance: number;
  equity: number;
  dailyPnL: number;
  profitTarget: number;
  dailyLossLimit: number;
  maxLossLimit: number;
  startDate: string;
  payoutDate: string;
  server: string;
  login: string;
};

export const accounts: TradingAccount[] = [
  {
    id: "NX-204981",
    label: "Primary $25K",
    firm: "NOVA Funding",
    program: "Two-Step Pro",
    phase: "Phase 2",
    platform: "MetaTrader 5",
    status: "Evaluation",
    startingBalance: 25_000,
    balance: 26_842.6,
    equity: 26_817.2,
    dailyPnL: 386.4,
    profitTarget: 2_500,
    dailyLossLimit: 1_250,
    maxLossLimit: 2_500,
    startDate: "Jun 03, 2026",
    payoutDate: "Jul 08, 2026",
    server: "NOVA-Live 02",
    login: "204981",
  },
  {
    id: "NX-184023",
    label: "Funded $100K",
    firm: "NOVA Funding",
    program: "Scale",
    phase: "Funded",
    platform: "cTrader",
    status: "Funded",
    startingBalance: 100_000,
    balance: 104_285.8,
    equity: 104_285.8,
    dailyPnL: -214.2,
    profitTarget: 8_000,
    dailyLossLimit: 5_000,
    maxLossLimit: 10_000,
    startDate: "Apr 18, 2026",
    payoutDate: "Jun 30, 2026",
    server: "NOVA-cT Live",
    login: "184023",
  },
  {
    id: "NX-119832",
    label: "Swing $50K",
    firm: "NOVA Funding",
    program: "One-Step Swing",
    phase: "Funded",
    platform: "MetaTrader 5",
    status: "Funded",
    startingBalance: 50_000,
    balance: 53_186.25,
    equity: 53_342.1,
    dailyPnL: 512.8,
    profitTarget: 5_000,
    dailyLossLimit: 2_500,
    maxLossLimit: 5_000,
    startDate: "Mar 09, 2026",
    payoutDate: "Jul 03, 2026",
    server: "NOVA-Swing 01",
    login: "119832",
  },
  {
    id: "NX-095426",
    label: "Practice $10K",
    firm: "NOVA Funding",
    program: "Free Trial",
    phase: "Completed",
    platform: "DXtrade",
    status: "Passed",
    startingBalance: 10_000,
    balance: 11_104.5,
    equity: 11_104.5,
    dailyPnL: 0,
    profitTarget: 1_000,
    dailyLossLimit: 500,
    maxLossLimit: 1_000,
    startDate: "Feb 02, 2026",
    payoutDate: "—",
    server: "NOVA-Demo",
    login: "095426",
  },
];

export const equityData = [
  { date: "May 30", balance: 25000, equity: 25000, floor: 22500 },
  { date: "Jun 01", balance: 25082, equity: 25054, floor: 22500 },
  { date: "Jun 03", balance: 24935, equity: 24912, floor: 22500 },
  { date: "Jun 05", balance: 25218, equity: 25188, floor: 22500 },
  { date: "Jun 07", balance: 25362, equity: 25362, floor: 22500 },
  { date: "Jun 09", balance: 25274, equity: 25245, floor: 22500 },
  { date: "Jun 11", balance: 25564, equity: 25496, floor: 22500 },
  { date: "Jun 13", balance: 25780, equity: 25780, floor: 22500 },
  { date: "Jun 15", balance: 25642, equity: 25610, floor: 22500 },
  { date: "Jun 17", balance: 26036, equity: 26008, floor: 22500 },
  { date: "Jun 19", balance: 26284, equity: 26310, floor: 22500 },
  { date: "Jun 21", balance: 26188, equity: 26160, floor: 22500 },
  { date: "Jun 23", balance: 26456, equity: 26456, floor: 22500 },
  { date: "Jun 25", balance: 26602, equity: 26572, floor: 22500 },
  { date: "Jun 27", balance: 26842.6, equity: 26817.2, floor: 22500 },
];

export const dailyPerformance = [
  { day: "Mon", pnl: 418, trades: 7, winRate: 71 },
  { day: "Tue", pnl: -126, trades: 5, winRate: 40 },
  { day: "Wed", pnl: 582, trades: 9, winRate: 67 },
  { day: "Thu", pnl: 244, trades: 6, winRate: 50 },
  { day: "Fri", pnl: 721, trades: 8, winRate: 75 },
];

export const sessionPerformance = [
  { session: "London", pnl: 864, winRate: 68, trades: 22, avgR: 1.42 },
  { session: "New York", pnl: 1198, winRate: 61, trades: 31, avgR: 1.18 },
  { session: "Overlap", pnl: 522, winRate: 72, trades: 14, avgR: 1.71 },
  { session: "Asia", pnl: -184, winRate: 38, trades: 8, avgR: -0.32 },
];

export type Trade = {
  id: string;
  symbol: string;
  side: "Long" | "Short";
  opened: string;
  closed: string;
  session: string;
  setup: string;
  lots: number;
  entry: number;
  exit: number;
  stop: number;
  pnl: number;
  resultR: number;
  mfe: number;
  mae: number;
  plan: string;
  note: string;
  emotion: "Focused" | "Patient" | "Rushed" | "Confident";
  followedPlan: boolean;
};

export const trades: Trade[] = [
  {
    id: "TR-4912",
    symbol: "XAUUSD",
    side: "Long",
    opened: "Jun 27 · 09:42",
    closed: "Jun 27 · 11:18",
    session: "London / NY",
    setup: "Liquidity sweep",
    lots: 0.8,
    entry: 2326.4,
    exit: 2334.8,
    stop: 2322.1,
    pnl: 386.4,
    resultR: 1.95,
    mfe: 2.31,
    mae: -0.28,
    plan: "Sweep of the London low, reclaim, then enter on the first 5m imbalance.",
    note: "Good patience through the retest. Scaled 40% at 1R and let the runner reach target.",
    emotion: "Focused",
    followedPlan: true,
  },
  {
    id: "TR-4908",
    symbol: "NAS100",
    side: "Short",
    opened: "Jun 26 · 15:05",
    closed: "Jun 26 · 15:38",
    session: "New York",
    setup: "Opening range fade",
    lots: 1.2,
    entry: 19_884.2,
    exit: 19_917.6,
    stop: 19_912,
    pnl: -214.2,
    resultR: -1,
    mfe: 0.42,
    mae: -1,
    plan: "Fade a failed breakout only after a close back inside the opening range.",
    note: "Entered before the candle closed. The thesis was valid, execution was rushed.",
    emotion: "Rushed",
    followedPlan: false,
  },
  {
    id: "TR-4901",
    symbol: "EURUSD",
    side: "Long",
    opened: "Jun 25 · 08:14",
    closed: "Jun 25 · 10:02",
    session: "London",
    setup: "Trend pullback",
    lots: 1.5,
    entry: 1.1672,
    exit: 1.1698,
    stop: 1.1659,
    pnl: 292.5,
    resultR: 2,
    mfe: 2.22,
    mae: -0.16,
    plan: "Buy the first higher-low after the H1 structure break.",
    note: "Clean execution. News filter kept the entry away from the 08:00 release.",
    emotion: "Patient",
    followedPlan: true,
  },
  {
    id: "TR-4894",
    symbol: "GBPJPY",
    side: "Short",
    opened: "Jun 24 · 10:36",
    closed: "Jun 24 · 12:04",
    session: "London",
    setup: "Break & retest",
    lots: 0.6,
    entry: 202.18,
    exit: 201.72,
    stop: 202.4,
    pnl: 184.8,
    resultR: 2.09,
    mfe: 2.4,
    mae: -0.21,
    plan: "Short the underside retest after the 15m support break.",
    note: "Moved stop only after structure confirmed. No interference.",
    emotion: "Confident",
    followedPlan: true,
  },
  {
    id: "TR-4889",
    symbol: "USDJPY",
    side: "Long",
    opened: "Jun 23 · 03:18",
    closed: "Jun 23 · 04:06",
    session: "Asia",
    setup: "Range breakout",
    lots: 1.0,
    entry: 158.14,
    exit: 158.03,
    stop: 158.03,
    pnl: -74.5,
    resultR: -1,
    mfe: 0.18,
    mae: -1,
    plan: "Take only if volume expands through the range high.",
    note: "Volume confirmation was weak. Avoid forcing Asia-session breakouts.",
    emotion: "Rushed",
    followedPlan: false,
  },
  {
    id: "TR-4878",
    symbol: "XAUUSD",
    side: "Short",
    opened: "Jun 21 · 14:31",
    closed: "Jun 21 · 16:22",
    session: "New York",
    setup: "Liquidity sweep",
    lots: 0.7,
    entry: 2342.2,
    exit: 2335.1,
    stop: 2346.1,
    pnl: 355.2,
    resultR: 1.82,
    mfe: 2.04,
    mae: -0.35,
    plan: "NY high sweep into H4 supply.",
    note: "Entry and management aligned with plan.",
    emotion: "Focused",
    followedPlan: true,
  },
];

export const strategyPerformance = [
  { name: "Liquidity sweep", trades: 18, winRate: 72, pnl: 984, avgR: 1.64 },
  { name: "Trend pullback", trades: 14, winRate: 64, pnl: 682, avgR: 1.21 },
  { name: "Break & retest", trades: 12, winRate: 58, pnl: 418, avgR: 0.94 },
  { name: "Opening range fade", trades: 10, winRate: 40, pnl: -126, avgR: -0.18 },
  { name: "Range breakout", trades: 7, winRate: 29, pnl: -242, avgR: -0.51 },
];

export const calendarEvents = [
  {
    time: "08:30",
    currency: "USD",
    impact: "High",
    event: "Core PCE Price Index m/m",
    forecast: "0.2%",
    previous: "0.2%",
    status: "In 42 min",
  },
  {
    time: "10:00",
    currency: "USD",
    impact: "High",
    event: "University of Michigan Sentiment",
    forecast: "61.2",
    previous: "60.5",
    status: "Upcoming",
  },
  {
    time: "14:30",
    currency: "CAD",
    impact: "Medium",
    event: "GDP m/m",
    forecast: "0.1%",
    previous: "-0.1%",
    status: "Upcoming",
  },
  {
    time: "19:00",
    currency: "USD",
    impact: "Low",
    event: "Baker Hughes Rig Count",
    forecast: "—",
    previous: "554",
    status: "Upcoming",
  },
];

export const payoutHistory = [
  {
    id: "PO-2044",
    requested: "May 30, 2026",
    account: "Funded $100K",
    amount: 2840,
    split: "90 / 10",
    method: "Rise",
    status: "Paid",
    completed: "May 31, 2026",
  },
  {
    id: "PO-1918",
    requested: "Apr 29, 2026",
    account: "Funded $100K",
    amount: 1965,
    split: "90 / 10",
    method: "Bank transfer",
    status: "Paid",
    completed: "May 01, 2026",
  },
  {
    id: "PO-1752",
    requested: "Mar 31, 2026",
    account: "Swing $50K",
    amount: 1224,
    split: "80 / 20",
    method: "Rise",
    status: "Paid",
    completed: "Apr 01, 2026",
  },
];

export const monthlyPnL = [
  { month: "Jan", pnl: 840 },
  { month: "Feb", pnl: 1260 },
  { month: "Mar", pnl: 2210 },
  { month: "Apr", pnl: 1880 },
  { month: "May", pnl: 3120 },
  { month: "Jun", pnl: 4286 },
];

export const achievements = [
  {
    title: "Phase One",
    subtitle: "Completed with 8.4% return",
    date: "May 22, 2026",
    tone: "teal",
  },
  {
    title: "Risk Keeper",
    subtitle: "30 days within personal risk plan",
    date: "Jun 16, 2026",
    tone: "blue",
  },
  {
    title: "First Payout",
    subtitle: "$1,224 reward processed",
    date: "Apr 01, 2026",
    tone: "amber",
  },
];

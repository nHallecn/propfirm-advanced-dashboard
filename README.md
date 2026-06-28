# NOVA Trader OS

A production-oriented Next.js dashboard for prop traders. The experience is built around one principle: a useful prop dashboard should help prevent the next breach, not merely explain the last one.

## Product research

The information architecture is based on recurring feedback from prop traders and the strongest patterns in current firm tooling:

- Traders repeatedly ask for immediate dashboard updates, clear status changes, and instant progression after passing. This drove the persistent live-data state, visible refresh age, and consolidated account status.
- Rule ambiguity is a trust problem. Traders report breaches caused by rules they did not understand or could not see at decision time. The Risk Center therefore exposes every threshold, calculation method, reset time, and projected post-trade runway.
- The meaningful account size is the remaining loss room, not the headline buying power. The UI elevates drawdown runway and estimated full-risk attempts above vanity metrics.
- Traders managing multiple accounts struggle to track profitable days, consistency, payout eligibility, and account-specific rule models. NOVA consolidates these in the account portfolio and payout center.
- Strong analytics products go beyond P&L into MFE/MAE, execution timing, setup expectancy, discipline, and journaling. These are included throughout Performance and Trade Journal.
- Payout trust matters as much as charting. Eligibility requirements, split calculations, request status, and settlement history are explicit and auditable.

Representative sources:

- [FTMO Account MetriX overview](https://ftmo.com/en/blog/account-metrix-a-tool-for-analysing-and-improving-your-trading/)
- [FTMO Discipline Score](https://ftmo.com/en/faq/what-is-the-discipline-score/)
- [Topstep dashboard guide](https://help.topstep.com/en/articles/10513413-getting-started-with-the-topstep-dashboard)
- [Topstep Daily Risk Lock](https://help.topstep.com/en/articles/10400735-topstepx-daily-risk-lock-settings)
- [Topstep consistency rules](https://help.topstep.com/en/articles/8284208-what-is-the-consistency-target)
- [Trader discussion: real-time updates and instant progression](https://www.reddit.com/r/PropFirmTester/comments/1oeu0bz/)
- [Trader discussion: multi-account rules and payout tracking](https://www.reddit.com/r/PropFirmTester/comments/1tn7e24/built_a_prop_firm_journal_with_all_the_account/)
- [Trader review: dashboard filtering and progress visibility](https://www.reddit.com/r/Forex/comments/126pdz1)

## Included product areas

- Portfolio overview and live account switching
- Multi-account management across phases and platforms
- Equity, drawdown, expectancy, setup, session, and execution analytics
- Pre-trade position sizing and projected rule impact
- Personal circuit breakers and transparent firm-rule calculations
- Searchable trade journal with MFE/MAE and behavioral review
- Payout readiness, scaling path, and settlement history
- Economic calendar with account-specific restricted windows
- Certificates, progression, trader profile, academy, and support
- Responsive navigation, command palette, notifications, CSV export, and interactive controls

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

For a production check:

```bash
npm run lint
npm run build
npm start
```

## Integration boundary

The current repository is the complete sellable front-end product layer with realistic domain data. A deployment for a specific prop firm should connect the typed models in `data/dashboard.ts` to that firm's account, execution, KYC, billing, notification, and payout APIs. The risk calculations shown in the interface should be repeated and enforced server-side; client-side checks are decision support, not a security boundary.

## Front-end architecture

The dashboard uses feature-oriented modules rather than a monolithic component:

```text
components/
├── dashboard-app.tsx          # routing and shared application state only
└── dashboard/
    ├── config.ts              # navigation and page metadata
    ├── formatters.ts          # display formatting
    ├── shell.tsx              # sidebar, topbar, command palette and dialogs
    ├── trade-table.tsx        # shared trade presentation
    ├── types.ts               # cross-feature UI contracts
    ├── ui.tsx                 # small reusable visual primitives
    └── pages/                 # one module per dashboard product area
```

Domain pages own their local interaction state. Shared account selection, overlays, routing and global feedback remain in the dashboard orchestrator.

"use client";

import { useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  FileText,
  Headphones,
  HelpCircle,
  Search,
  Shield,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Panel, PanelHeading } from "../ui";

export default function SupportPage({ onToast }: { onToast: (message: string) => void }) {
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
  const questions = [
    "How is the daily loss limit calculated?",
    "When does my dashboard update?",
    "What makes an account payout eligible?",
    "How do restricted news windows work?",
    "Can I hold trades overnight and on weekends?",
  ];
  const answers = [
    "The limit includes realized P&L, floating P&L, commissions and swaps. Its reference equity resets at the firm’s stated trading-day boundary.",
    "Live equity updates continuously. Settled objectives and consistency metrics finalize after the trading day closes.",
    "Eligibility combines minimum profitable days, consistency, available profit and the account’s payout-cycle date.",
    "NOVA marks the exact restricted window around each high-impact release and alerts you before it begins.",
    "Overnight and weekend holding depends on the program. Your account card and rule engine show the policy that applies to the selected account.",
  ];

  return (
    <div className="page-stack">
      <Panel className="support-search-panel">
        <div>
          <span>
            <HelpCircle size={28} />
          </span>
          <h2>What can we help you with?</h2>
          <p>Clear answers about your account, rules, payouts, and platform.</p>
          <label className="support-search">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for an answer…"
            />
            <kbd>Enter</kbd>
          </label>
        </div>
      </Panel>
      <div className="support-topics">
        {topics
          .filter((topic) => topic.title.toLowerCase().includes(query.toLowerCase()))
          .map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                className={selectedTopic === topic.title ? "active" : ""}
                onClick={() => {
                  setSelectedTopic(topic.title);
                  onToast(`${topic.title} articles loaded`);
                }}
                key={topic.title}
              >
                <span>
                  <Icon size={20} />
                </span>
                <div>
                  <strong>{topic.title}</strong>
                  <small>{topic.count}</small>
                </div>
                <ChevronRight size={16} />
              </button>
            );
          })}
      </div>
      <div className="support-lower">
        <Panel>
          <PanelHeading title="Popular answers" subtitle="Most useful this week" />
          <div className="faq-list">
            {questions.map((item, index) => (
              <div className="faq-item" key={item}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === item ? null : item)}
                  aria-expanded={expandedFaq === item}
                >
                  <span>{index + 1}</span>
                  {item}
                  <ChevronRight className={expandedFaq === item ? "rotate-90" : ""} size={15} />
                </button>
                {expandedFaq === item && <p>{answers[index]}</p>}
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="contact-panel">
          <PanelHeading title="Still need help?" subtitle="Our trader success team is online" />
          <div className="agent-stack">
            <span>AM</span>
            <span>JK</span>
            <span>RS</span>
            <i />
          </div>
          <h3>Talk to a real person</h3>
          <p>Average first reply is under 3 minutes. Include your account ID so we can help faster.</p>
          <button
            className="button button--primary button--full"
            onClick={() => onToast("Live support conversation started")}
          >
            <Headphones size={16} /> Start live chat
          </button>
          <button
            className="button button--secondary button--full"
            onClick={() => onToast("Support ticket draft created")}
          >
            <FileText size={16} /> Submit a ticket
          </button>
          <small>Support available 24/5 · English, French + 8 more</small>
        </Panel>
      </div>
    </div>
  );
}

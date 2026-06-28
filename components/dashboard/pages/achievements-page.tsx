"use client";

import { Award, Check, CircleDollarSign, Copy, Download, Shield, ShieldCheck, Trophy } from "lucide-react";
import { achievements } from "@/data/dashboard";
import { Panel, PanelHeading, Pill } from "../ui";

export default function AchievementsPage({ onToast }: { onToast: (message: string) => void }) {
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
          <Pill tone="violet">
            <Trophy size={12} /> Level 4 trader
          </Pill>
          <h2>Consistent Operator</h2>
          <p>
            You are building the habits prop firms want to scale: controlled losses, repeatable execution, and
            clean reviews.
          </p>
          <div className="level-progress">
            <div>
              <span>2,840 XP</span>
              <span>3,500 XP to Level 5</span>
            </div>
            <div className="progress-track">
              <span className="progress-fill progress-fill--violet" style={{ width: "81%" }} />
            </div>
          </div>
        </div>
        <div className="level-medal">
          <Trophy size={52} />
          <span>04</span>
        </div>
      </Panel>
      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <article
            className={`achievement-card achievement-card--${achievement.tone}`}
            key={achievement.title}
          >
            <div className="certificate-pattern" />
            <span className="achievement-seal">
              {achievement.tone === "amber" ? (
                <CircleDollarSign size={24} />
              ) : achievement.tone === "blue" ? (
                <ShieldCheck size={24} />
              ) : (
                <Award size={24} />
              )}
            </span>
            <p>NOVA FUNDING CERTIFICATE</p>
            <h3>{achievement.title}</h3>
            <span>{achievement.subtitle}</span>
            <small>Awarded to Nji Halle · {achievement.date}</small>
            <button
              onClick={() => downloadCertificate(achievement.title, achievement.subtitle, achievement.date)}
            >
              <Download size={14} /> Download
            </button>
          </article>
        ))}
      </div>
      <div className="achievement-lower-grid">
        <Panel>
          <PanelHeading title="Milestone path" subtitle="Next achievements within reach" />
          <div className="milestone-list">
            <div>
              <span className="milestone-icon complete">
                <Check size={16} />
              </span>
              <div>
                <strong>First payout</strong>
                <small>Completed Apr 01, 2026</small>
              </div>
              <strong>+500 XP</strong>
            </div>
            <div>
              <span className="milestone-icon active">
                <Trophy size={16} />
              </span>
              <div>
                <strong>$10K lifetime rewards</strong>
                <small>$6,029 of $10,000 · 60% complete</small>
                <div className="progress-track">
                  <span className="progress-fill progress-fill--amber" style={{ width: "60%" }} />
                </div>
              </div>
              <strong>+1,000 XP</strong>
            </div>
            <div>
              <span className="milestone-icon">
                <Shield size={16} />
              </span>
              <div>
                <strong>60-day discipline streak</strong>
                <small>30 of 60 days completed</small>
              </div>
              <strong>+750 XP</strong>
            </div>
          </div>
        </Panel>
        <Panel>
          <PanelHeading
            title="Public trader profile"
            subtitle="A verified record you control"
            action={
              <Pill tone="green">
                <Check size={11} /> Verified
              </Pill>
            }
          />
          <div className="public-profile">
            <div className="public-profile-head">
              <span>NH</span>
              <div>
                <strong>Nji Halle</strong>
                <small>@njihalle · Cameroon</small>
              </div>
              <ShieldCheck size={18} />
            </div>
            <div className="public-stats">
              <div>
                <strong>$150K</strong>
                <span>Funded</span>
              </div>
              <div>
                <strong>3</strong>
                <span>Payouts</span>
              </div>
              <div>
                <strong>86</strong>
                <span>Discipline</span>
              </div>
            </div>
            <div className="profile-url">
              <span>nova.fund/trader/njihalle</span>
              <button
                onClick={() => {
                  void navigator.clipboard?.writeText("https://nova.fund/trader/njihalle");
                  onToast("Public profile link copied");
                }}
              >
                <Copy size={14} /> Copy
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  CircleDollarSign,
  Newspaper,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Panel, PanelHeading, Pill } from "../ui";

export default function AcademyPage({ onToast }: { onToast: (message: string) => void }) {
  const [activeLesson, setActiveLesson] = useState("Stop giving back green days");
  const lessons = [
    { icon: Shield, title: "Mastering drawdown math", detail: "8 min · Risk management", progress: 100 },
    {
      icon: Target,
      title: "Build a repeatable pre-trade routine",
      detail: "12 min · Psychology",
      progress: 62,
    },
    { icon: BarChart3, title: "Use MFE and MAE to refine exits", detail: "10 min · Analytics", progress: 0 },
    { icon: Newspaper, title: "Trading around high-impact news", detail: "6 min · Firm rules", progress: 0 },
  ];
  return (
    <div className="page-stack">
      <Panel className="academy-hero">
        <div>
          <Pill tone="violet">
            <Sparkles size={12} /> Recommended for you
          </Pill>
          <h2>Stop giving back green days</h2>
          <p>
            Your journal shows that 68% of avoidable loss happens after you reach +1.5R on the day. This
            8-minute lesson builds a practical stop-for-the-day rule.
          </p>
          <button
            className="button button--primary"
            onClick={() => {
              setActiveLesson("Stop giving back green days");
              onToast("Lesson resumed at 04:18");
            }}
          >
            Continue lesson <ArrowRight size={15} />
          </button>
        </div>
        <div className="lesson-visual">
          <div>
            <span>
              <BookOpen size={26} />
            </span>
            <strong>68%</strong>
            <small>of avoidable loss</small>
          </div>
        </div>
      </Panel>
      <div className="academy-grid">
        {lessons.map((lesson) => {
          const Icon = lesson.icon;
          return (
            <article
              className={clsx("lesson-card", activeLesson === lesson.title && "lesson-card--active")}
              key={lesson.title}
            >
              <span>
                <Icon size={20} />
              </span>
              <Pill tone={lesson.progress === 100 ? "green" : lesson.progress > 0 ? "blue" : "neutral"}>
                {lesson.progress === 100 ? "Completed" : lesson.progress > 0 ? "In progress" : "New"}
              </Pill>
              <h3>{lesson.title}</h3>
              <p>{lesson.detail}</p>
              <div className="progress-track">
                <span
                  className="progress-fill progress-fill--blue"
                  style={{ width: `${lesson.progress}%` }}
                />
              </div>
              <button
                onClick={() => {
                  setActiveLesson(lesson.title);
                  onToast(`${lesson.title} opened`);
                }}
              >
                {lesson.progress > 0 ? "Continue" : "Start lesson"} <ArrowRight size={14} />
              </button>
            </article>
          );
        })}
      </div>
      <Panel>
        <PanelHeading title="Learning paths" subtitle="Structured skills for each funding stage" />
        <div className="learning-paths">
          <div>
            <span>
              <ShieldCheck size={22} />
            </span>
            <div>
              <Pill tone="green">6 of 8 complete</Pill>
              <h3>Evaluation survival</h3>
              <p>Rule mastery, sizing, drawdown and consistency.</p>
            </div>
            <button
              className="icon-btn"
              onClick={() => onToast("Evaluation survival path opened")}
              aria-label="Open evaluation survival path"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <div>
            <span>
              <CircleDollarSign size={22} />
            </span>
            <div>
              <Pill tone="blue">2 of 7 complete</Pill>
              <h3>Funded longevity</h3>
              <p>Payout planning, scaling, and capital preservation.</p>
            </div>
            <button
              className="icon-btn"
              onClick={() => onToast("Funded longevity path opened")}
              aria-label="Open funded longevity path"
            >
              <ArrowRight size={16} />
            </button>
          </div>
          <div>
            <span>
              <Activity size={22} />
            </span>
            <div>
              <Pill tone="neutral">0 of 6 complete</Pill>
              <h3>Professional analytics</h3>
              <p>Expectancy, excursions, regimes, and robust review.</p>
            </div>
            <button
              className="icon-btn"
              onClick={() => onToast("Professional analytics path opened")}
              aria-label="Open professional analytics path"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}

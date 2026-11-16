"use client";

import type { MediaKind } from "@/lib/types";

export type AppTab = MediaKind | "stats";

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: "films", label: "Films", icon: "▣" },
  { id: "series", label: "Séries", icon: "▤" },
  { id: "books", label: "Livres", icon: "▥" },
  { id: "stats", label: "Stats", icon: "◔" },
];

export function BottomNav({
  activeTab,
  onChange,
}: {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
}) {
  return (
    <nav aria-label="Navigation principale" className="bottom-nav">
      {tabs.map((tab) => (
        <button
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={`nav-item ${activeTab === tab.id ? "nav-item-active" : ""}`}
          key={tab.id}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          <span aria-hidden="true" className="nav-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

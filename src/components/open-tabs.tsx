import React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  lastAccessed?: number;
}

// Mock data - in real extension this would come from chrome.tabs API
const mockTabs: Tab[] = [
  {
    id: "1",
    title: "GitHub - Your Repositories",
    url: "https://github.com",
    favicon: "https://github.com/favicon.ico",
    lastAccessed: Date.now() - 1000000,
  },
  {
    id: "2",
    title: "Vercel Dashboard",
    url: "https://vercel.com",
    favicon: "https://vercel.com/favicon.ico",
    lastAccessed: Date.now() - 500000,
  },
  {
    id: "3",
    title: "Stack Overflow - React hooks",
    url: "https://stackoverflow.com",
    favicon: "https://stackoverflow.com/favicon.ico",
    lastAccessed: Date.now() - 200000,
  },
  {
    id: "4",
    title: "Figma - Project Design",
    url: "https://figma.com",
    favicon: "https://figma.com/favicon.ico",
    lastAccessed: Date.now(),
  },
];

export function OpenTabs() {
  const [tabs, setTabs] = useState<Tab[]>(
    [...mockTabs].sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0)),
  );
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTabs(tabs.filter((t) => t.id !== id));
  };

  const switchToTab = (tab: Tab) => {
    // Update lastAccessed time and move to top
    const updatedTabs = tabs.map((t) =>
      t.id === tab.id ? { ...t, lastAccessed: Date.now() } : t,
    );
    const sortedTabs = updatedTabs.sort(
      (a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0),
    );
    setTabs(sortedTabs);

    // In real extension: chrome.tabs.update(tabId, { active: true })
    window.open(tab.url, "_blank");
  };

  const truncateTitle = (title: string, maxLength = 20) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  const normalize = (value: string) => value.toLowerCase();

  const fuzzyScore = (text: string, input: string) => {
    const t = normalize(text);
    const q = normalize(input);
    if (!q) return 0;
    if (t.includes(q)) return 50 + (q.length * 2);

    let tIndex = 0;
    let qIndex = 0;
    let score = 0;
    let consecutive = 0;
    let lastMatch = -2;

    while (tIndex < t.length && qIndex < q.length) {
      if (t[tIndex] === q[qIndex]) {
        score += 2 + consecutive * 3;
        if (tIndex === 0) score += 3;
        if (tIndex === lastMatch + 1) {
          consecutive += 1;
        } else {
          consecutive = 1;
        }
        lastMatch = tIndex;
        qIndex += 1;
      }
      tIndex += 1;
    }

    if (qIndex !== q.length) return 0;
    return score;
  };

  const trimmedQuery = query.trim();
  const filteredTabs = trimmedQuery
    ? tabs
        .map((tab) => {
          const titleScore = fuzzyScore(tab.title, trimmedQuery);
          const urlScore = fuzzyScore(tab.url, trimmedQuery);
          return {
            tab,
            score: Math.max(titleScore * 2, urlScore),
          };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return (b.tab.lastAccessed || 0) - (a.tab.lastAccessed || 0);
        })
        .map((entry) => entry.tab)
    : tabs;

  if (tabs.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-foreground/30 uppercase tracking-wider">
          Tabs
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search open tabs..."
          className="flex-1 bg-transparent text-xs text-foreground/70 placeholder:text-foreground/30 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {filteredTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => switchToTab(tab)}
            onMouseEnter={() => setIsHovered(tab.id)}
            onMouseLeave={() => setIsHovered(null)}
            className={cn(
              "group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
              "bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground/80",
              trimmedQuery &&
                index === 0 &&
                "bg-foreground/12 text-foreground/85 ring-1 ring-foreground/20",
            )}
          >
            {tab.favicon ? (
              <img
                src={tab.favicon || "/placeholder.svg"}
                alt=""
                className="w-3 h-3 rounded-sm block shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-3 h-3 rounded-sm bg-foreground/20 block shrink-0" />
            )}
            <span>{truncateTitle(tab.title)}</span>
            <X
              className={cn(
                "w-3 h-3 -mr-0.5 transition-opacity",
                isHovered === tab.id
                  ? "text-foreground/40 hover:text-foreground/70 opacity-100"
                  : "opacity-0 pointer-events-none",
              )}
              onClick={(e) => closeTab(e, tab.id)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

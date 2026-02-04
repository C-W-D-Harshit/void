import React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

// Mock data - in real extension this would come from chrome.tabs API
const mockTabs: Tab[] = [
  {
    id: "1",
    title: "GitHub - Your Repositories",
    url: "https://github.com",
    favicon: "https://github.com/favicon.ico",
  },
  {
    id: "2",
    title: "Vercel Dashboard",
    url: "https://vercel.com",
    favicon: "https://vercel.com/favicon.ico",
  },
  {
    id: "3",
    title: "Stack Overflow - React hooks",
    url: "https://stackoverflow.com",
    favicon: "https://stackoverflow.com/favicon.ico",
  },
  {
    id: "4",
    title: "Figma - Project Design",
    url: "https://figma.com",
    favicon: "https://figma.com/favicon.ico",
  },
];

export function OpenTabs() {
  const [tabs, setTabs] = useState<Tab[]>(mockTabs);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTabs(tabs.filter((t) => t.id !== id));
  };

  const switchToTab = (url: string) => {
    // In real extension: chrome.tabs.update(tabId, { active: true })
    window.open(url, "_blank");
  };

  const truncateTitle = (title: string, maxLength = 20) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
  };

  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="text-[11px] text-foreground/30 uppercase tracking-wider mr-1">
        Tabs
      </span>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => switchToTab(tab.url)}
          onMouseEnter={() => setIsHovered(tab.id)}
          onMouseLeave={() => setIsHovered(null)}
          className={cn(
            "group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-all",
            "bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground/80",
          )}
        >
          {tab.favicon ? (
            <img
              src={tab.favicon || "/placeholder.svg"}
              alt=""
              className="w-3 h-3 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-3 h-3 rounded-sm bg-foreground/20" />
          )}
          <span>{truncateTitle(tab.title)}</span>
          {isHovered === tab.id && (
            <X
              className="w-3 h-3 text-foreground/40 hover:text-foreground/70 -mr-0.5"
              onClick={(e) => closeTab(e, tab.id)}
            />
          )}
        </button>
      ))}
    </div>
  );
}

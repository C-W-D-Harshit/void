import React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function UrlBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: press "/" to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !isFocused &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const isUrl = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
      return true;
    if (trimmed.startsWith("localhost")) return true;
    const domainPattern = /^[\w-]+(\.[\w-]+)+/;
    if (domainPattern.test(trimmed)) return true;
    return false;
  };

  const navigate = () => {
    if (!query.trim()) return;

    let url: string;
    if (isUrl(query)) {
      url = query.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
    } else {
      url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
    }

    window.location.href = url;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate();
      return;
    }
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  };

  const queryType = query.trim() ? (isUrl(query) ? "url" : "search") : null;

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150",
          "bg-foreground/[0.03]",
          isFocused && "bg-foreground/[0.05]",
        )}
      >
        <div className="flex-shrink-0">
          {queryType === "url" ? (
            <Globe className="w-4 h-4 text-foreground/25" strokeWidth={1.5} />
          ) : (
            <Search className="w-4 h-4 text-foreground/25" strokeWidth={1.5} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter URL"
          className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-foreground/25 focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />

        {query.trim() ? (
          <button
            type="button"
            onClick={navigate}
            className="flex-shrink-0 text-foreground/30 hover:text-foreground/45 transition-colors"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex h-5 items-center justify-center rounded bg-foreground/[0.03] px-1.5 text-[10px] font-mono text-foreground/20">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}

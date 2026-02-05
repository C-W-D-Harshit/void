import React from "react";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export type AppSettings = {
  showTasks: boolean;
  showTabs: boolean;
  showUrlBar: boolean;
  showQuickLinks: boolean;
  showGridDot: boolean;
};

type Props = {
  value: AppSettings;
  onChange: (next: AppSettings) => void;
};

export function SettingsPanel({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!panelRef.current) return;
      if (panelRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (key: keyof AppSettings) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-6 right-6 z-20 flex flex-col items-end"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center justify-center h-8 w-8 rounded-full border border-foreground/10",
          "bg-foreground/[0.03] hover:bg-foreground/[0.06] transition-colors",
        )}
        aria-label="Settings"
        aria-expanded={open}
      >
        <Settings className="h-4 w-4 text-foreground/45" strokeWidth={1.5} />
      </button>

      {open ? (
        <div className="mt-3 w-56 rounded-xl border border-foreground/10 bg-background/80 backdrop-blur p-3 shadow-sm">
          <div className="mb-2">
            <span className="text-[11px] uppercase tracking-widest text-foreground/50">
              Theme
            </span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(
                [
                  { label: "Dark", value: "dark" },
                  { label: "Light", value: "light" },
                  { label: "Notion Dark", value: "notion-dark" },
                  { label: "Notion Light", value: "notion-light" },
                ] as const
              ).map((option) => {
                const active = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-[11px] uppercase tracking-widest transition",
                      active
                        ? "border-foreground/35 bg-foreground/15 text-foreground"
                        : "border-foreground/15 bg-foreground/[0.03] text-foreground/60 hover:text-foreground",
                    )}
                    aria-pressed={active}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <ToggleRow
            label="Tasks"
            checked={value.showTasks}
            onToggle={() => toggle("showTasks")}
          />
          <ToggleRow
            label="Tabs"
            checked={value.showTabs}
            onToggle={() => toggle("showTabs")}
          />
          <ToggleRow
            label="URL Bar"
            checked={value.showUrlBar}
            onToggle={() => toggle("showUrlBar")}
          />
          <ToggleRow
            label="Quick Links"
            checked={value.showQuickLinks}
            onToggle={() => toggle("showQuickLinks")}
          />
          <ToggleRow
            label="Grid + Dots"
            checked={value.showGridDot}
            onToggle={() => toggle("showGridDot")}
          />
        </div>
      ) : null}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] uppercase tracking-widest text-foreground/50">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full border transition-colors",
          checked
            ? "bg-foreground/25 border-foreground/30"
            : "bg-foreground/[0.06] border-foreground/15",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 h-4 w-4 rounded-full bg-foreground/70 transition-transform",
            checked ? "translate-x-4" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "notion-dark" | "notion-light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const THEME_CLASSES = ["dark", "light", "notion-dark", "notion-light"] as const;

type ResolvedTheme = Exclude<Theme, "system">;

const resolveSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "notion-dark"
    : "notion-light";

const resolveTheme = (theme: Theme): ResolvedTheme =>
  theme === "system" ? resolveSystemTheme() : theme;

const getDarkClass = (theme: ResolvedTheme) =>
  theme === "dark" || theme === "notion-dark" ? "dark" : null;

export function ThemeProvider({
  children,
  defaultTheme = "notion-dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    return stored || defaultTheme;
  });

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(...THEME_CLASSES);

    const darkClass = getDarkClass(resolvedTheme);
    if (darkClass) root.classList.add(darkClass);
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const root = window.document.documentElement;
      const systemTheme = resolveSystemTheme();
      root.classList.remove(...THEME_CLASSES);
      const darkClass = getDarkClass(systemTheme);
      if (darkClass) root.classList.add(darkClass);
      root.classList.add(systemTheme);
    };

    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        localStorage.setItem(storageKey, nextTheme);
        setTheme(nextTheme);
      },
    }),
    [storageKey, theme],
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

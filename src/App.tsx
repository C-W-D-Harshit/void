import { useEffect, useState } from "react";
import { Clock } from "./components/clock";
import { UrlBar } from "./components/url-bar";
import { ContentTabs } from "./components/content-tabs";
import { QuickLinks } from "./components/quick-links";
import { SettingsPanel, type AppSettings } from "./components/settings-panel";

function App() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    showTasks: true,
    showTabs: true,
    showUrlBar: true,
    showQuickLinks: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("melka-settings");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Ignore invalid storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("melka-settings", JSON.stringify(settings));
  }, [settings]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans antialiased">
      <SettingsPanel value={settings} onChange={setSettings} />
      <div
        className={`relative z-10 w-full max-w-md flex flex-col items-center transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <Clock />

        {settings.showUrlBar ? (
          <div className="w-full mt-8">
            <UrlBar />
          </div>
        ) : null}

        {settings.showTasks || settings.showTabs ? (
          <div className="w-full mt-8">
            <ContentTabs
              showTasks={settings.showTasks}
              showTabs={settings.showTabs}
            />
          </div>
        ) : null}
      </div>

      {settings.showQuickLinks ? (
        <div
          className={`fixed bottom-8 inset-x-0 z-40 flex justify-center transition-opacity duration-700 delay-200 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <QuickLinks />
        </div>
      ) : null}
    </main>
  );
}

export default App;

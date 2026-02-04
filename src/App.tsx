import { useEffect, useState } from "react";
import { Clock } from "./components/clock";
import { UrlBar } from "./components/url-bar";
import { ContentTabs } from "./components/content-tabs";
import { QuickLinks } from "./components/quick-links";

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12 font-sans antialiased">
      <div
        className={`relative z-10 w-full max-w-md flex flex-col items-center transition-all duration-700 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <Clock />

        <div className="w-full mt-8">
          <UrlBar />
        </div>

        <div className="w-full mt-8">
          <ContentTabs />
        </div>
      </div>

      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <QuickLinks />
      </div>
    </main>
  );
}

export default App;

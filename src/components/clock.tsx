import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="text-center">
        <div className="h-24" />
      </div>
    );
  }

  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const greeting =
    time.getHours() < 12
      ? "Good morning"
      : time.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  const formatDate = () => {
    return time.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="text-center select-none">
      <p className="text-foreground/50 text-sm mb-4">{greeting}</p>

      <h1
        className="text-7xl md:text-8xl font-light leading-none tracking-tight text-transparent bg-clip-text tabular-nums"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)",
          textShadow:
            "0 2px 4px rgba(0,0,0,0.3), 0 -1px 0 rgba(255,255,255,0.1), inset 0 0 0 rgba(0,0,0,0.1)",
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
        }}
      >
        {hours}:{minutes}
      </h1>

      <p className="text-foreground/40 mt-4 text-sm">{formatDate()}</p>
    </div>
  );
}

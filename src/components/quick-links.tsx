import React from "react";
import { useState, useEffect } from "react";
import { Github, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
}

const defaultLinks: Link[] = [
  { id: "1", title: "GitHub", url: "https://github.com", icon: "github" },
  { id: "2", title: "Vercel", url: "https://vercel.com", icon: "vercel" },
  { id: "3", title: "Linear", url: "https://linear.app", icon: "linear" },
];

function getIconComponent(iconName: string | undefined) {
  const iconClass = "w-4 h-4";
  if (!iconName) {
    return <span className="w-4 h-4 rounded bg-foreground/20" />;
  }
  switch (iconName) {
    case "github":
      return <Github className={iconClass} strokeWidth={1.5} />;
    case "vercel":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      );
    case "linear":
      return (
        <svg className={iconClass} viewBox="0 0 100 100" fill="currentColor">
          <path d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5765C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957765.7606L52.3503 99.7085c.2007.2007.4773.3072.7606.2896 4.7122-.2921 9.2401-1.187 13.5093-2.6025.7451-.2474 1.0289-1.1622.5364-1.7543L6.67802 35.1633c-.59218-.592-1.50691-.2087-1.75428.5365-1.41527 4.2692-2.31035 8.7971-2.60235 13.5094ZM15.6367 22.7006c-.58521-.5852-.40941-1.5624.32122-1.8457 4.47619-1.7376 9.25437-2.9238 14.2358-3.4599.7268-.0782 1.3572.4894 1.3572 1.22v24.695c0 .5765-.4884.9928-1.0448.9227L15.6367 22.7006ZM37.0653 13.6257c-.5765 0-.9928-.4884-.9227-1.0448.6475-5.4685 2.2875-10.6479 4.744-15.3596.2573-.4936.9019-.5979 1.2826-.2172l18.6933 18.6934c.4367.4367.232 1.1689-.362 1.3234-3.7784.9825-7.9214 1.1922-11.8713.6285ZM48.8252 6.3995c.0702-.7067.6996-1.2241 1.4018-1.1528 5.7188.5804 11.1333 2.2426 15.9864 4.7831.4926.258.5968.9022.2161 1.2829L48.7361 28.9997c-.4368.4367-1.1689.232-1.3234-.362-.9825-3.7784-1.1922-7.9214-.6285-11.8713l.0414-.3665ZM58.0503 35.2567c.1303.594.8197.8791 1.3234.362l18.3933-18.3933c.4367-.4367.3805-1.1609-.1109-1.4245C72.7481 12.77 67.3764 10.9 61.6456 10.2274c-.7014-.0824-1.3299.4436-1.4015 1.1499-.3403 3.3536-.7472 8.5107-.594 12.1146.1017 2.3917.4461 5.7867.6568 7.8176l.0003.0011ZM66.9134 45.01c-.5765 0-.9928.4884-.9227 1.0448.6475 5.4685 2.2875 10.6479 4.744 15.3596.2573.4937.9019.5979 1.2826.2172l18.6933-18.6933c.4367-.4368.232-1.169-.362-1.3234-3.7784-.9825-7.9214-1.1922-11.8713-.6285-.0665.0095-.1329.0192-.1993.0291-4.0987.6116-7.8817 1.2552-11.3646 3.9945Z" />
        </svg>
      );
    default:
      return (
        <span className="w-4 h-4 rounded bg-foreground/20 text-[10px] flex items-center justify-center font-medium">
          {iconName.charAt(0).toUpperCase()}
        </span>
      );
  }
}

export function QuickLinks() {
  const [links, setLinks] = useState<Link[]>(defaultLinks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("focus-links");
    if (stored) {
      setLinks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus-links", JSON.stringify(links));
  }, [links]);

  const addLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }
    const link: Link = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      url,
      icon: newTitle.trim().toLowerCase(),
    };
    setLinks((prev) => [...prev, link]);
    setNewTitle("");
    setNewUrl("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addLink();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewTitle("");
      setNewUrl("");
    }
  };

  return (
    <>
      <div className="flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground/40 hover:text-foreground/70 transition-colors text-sm"
          >
            {getIconComponent(link.icon)}
            <span>{link.title}</span>
          </a>
        ))}

        <button
          onClick={() => setIsAdding(true)}
          className="text-foreground/25 hover:text-foreground/50 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setIsAdding(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative bg-card border border-border rounded-xl p-6 w-full max-w-xs shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-foreground/80">
                  Add Link
                </h3>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Name"
                  autoFocus
                  className="w-full bg-foreground/5 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
                />
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://..."
                  className="w-full bg-foreground/5 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
                />
                <button
                  onClick={addLink}
                  className="w-full bg-foreground/10 hover:bg-foreground/15 text-foreground/80 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                >
                  Add Link
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

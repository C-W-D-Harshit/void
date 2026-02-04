import React from "react";
import { useState, useEffect, useRef } from "react";
import { Plus, Check, X, Video, Globe, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Task types and logic
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Meeting types
interface Meeting {
  id: string;
  title: string;
  time: string;
  meetLink: string;
}

// Tab types
interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

// Mock data
const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Sprint Planning",
    time: "10:00 AM",
    meetLink: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    title: "1:1 with Sarah",
    time: "2:30 PM",
    meetLink: "https://meet.google.com/xyz-uvwx-rst",
  },
];

const mockBrowserTabs: BrowserTab[] = [
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

export function ContentTabs() {
  const [activeTab, setActiveTab] = React.useState("tasks");
  const [previousTab, setPreviousTab] = React.useState("tasks");
  const [isInitialMount, setIsInitialMount] = React.useState(true);
  const tabsListRef = React.useRef<HTMLDivElement>(null);
  const taskInputRef = React.useRef<{ focus: () => void }>(null);
  const searchInputRef = React.useRef<{ focus: () => void }>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({
    left: 0,
    width: 0,
  });

  const tabs = [
    { value: "tasks", label: "Tasks" },
    { value: "tabs", label: "Tabs" },
    { value: "meetings", label: "Meetings" },
  ];

  const tabIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const prevTabIndex = tabs.findIndex((tab) => tab.value === previousTab);
  const direction = tabIndex > prevTabIndex ? "right" : "left";

  React.useEffect(() => {
    if (tabsListRef.current) {
      const activeTrigger = tabsListRef.current.querySelector(
        `[data-state="active"]`,
      ) as HTMLElement;
      if (activeTrigger) {
        setIndicatorStyle({
          left: activeTrigger.offsetLeft,
          width: activeTrigger.offsetWidth,
        });
      }
    }
  }, [activeTab]);

  React.useEffect(() => {
    // Focus the appropriate input based on active tab, but not on initial mount
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    setTimeout(() => {
      if (activeTab === "tasks") {
        taskInputRef.current?.focus();
      } else if (activeTab === "tabs") {
        searchInputRef.current?.focus();
      }
    }, 100);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setPreviousTab(activeTab);
    setActiveTab(value);
  };

  // Touch/trackpad swipe handling
  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setTouchEnd(0);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const onTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left -> go to next tab
      const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
      if (currentIndex < tabs.length - 1) {
        handleTabChange(tabs[currentIndex + 1].value);
      }
    }

    if (isRightSwipe) {
      // Swipe right -> go to previous tab
      const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
      if (currentIndex > 0) {
        handleTabChange(tabs[currentIndex - 1].value);
      }
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList
        ref={tabsListRef}
        className="w-full bg-transparent border-0 p-0 h-auto gap-6 justify-start relative"
      >
        <div
          className="absolute bottom-0 h-[2px] bg-foreground/50 transition-all duration-300 ease-out"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="relative !bg-transparent !shadow-none !border-0 px-0 pb-2 text-xs uppercase tracking-widest text-foreground/40 data-[state=active]:text-foreground/80 rounded-none transition-colors duration-300 hover:text-foreground/60"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent
        value="tasks"
        className={cn(
          "mt-4 animate-in fade-in-0 duration-300 ease-out",
          activeTab === "tasks" &&
            direction === "right" &&
            "slide-in-from-right-4",
          activeTab === "tasks" &&
            direction === "left" &&
            "slide-in-from-left-4",
        )}
      >
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
        >
          <TasksPanel ref={taskInputRef} />
        </div>
      </TabsContent>

      <TabsContent
        value="tabs"
        className={cn(
          "mt-4 animate-in fade-in-0 duration-300 ease-out",
          activeTab === "tabs" &&
            direction === "right" &&
            "slide-in-from-right-4",
          activeTab === "tabs" &&
            direction === "left" &&
            "slide-in-from-left-4",
        )}
      >
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
        >
          <BrowserTabsPanel ref={searchInputRef} />
        </div>
      </TabsContent>

      <TabsContent
        value="meetings"
        className={cn(
          "mt-4 animate-in fade-in-0 duration-300 ease-out",
          activeTab === "meetings" &&
            direction === "right" &&
            "slide-in-from-right-4",
          activeTab === "meetings" &&
            direction === "left" &&
            "slide-in-from-left-4",
        )}
      >
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
        >
          <MeetingsPanel />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TasksPanel({ ref }: { ref?: React.Ref<{ focus: () => void }> }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    const stored = localStorage.getItem("focus-tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTask.trim()) {
      addTask();
    }
    if (e.key === "Escape") {
      setNewTask("");
      inputRef.current?.blur();
    }
  };

  return (
    <ScrollArea className="h-[280px]">
      <div className="pr-4">
        {/* Notion-style inline input - always visible */}
        <div
          className={cn(
            "group flex items-center gap-3 py-2 rounded cursor-text transition-colors",
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <span
            className={cn(
              "flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors",
              isFocused
                ? "border-foreground/30"
                : "border-foreground/15 group-hover:border-foreground/25",
            )}
          >
            <Plus
              className={cn(
                "w-2.5 h-2.5 transition-colors",
                isFocused
                  ? "text-foreground/50"
                  : "text-foreground/25 group-hover:text-foreground/35",
              )}
              strokeWidth={2}
            />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type to add a task..."
            className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-foreground/25 focus:outline-none"
          />
        </div>

        {/* All tasks */}
        <div className="space-y-0.5 mt-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 py-2 rounded cursor-pointer",
        task.completed && "opacity-50",
      )}
      onClick={() => onToggle(task.id)}
    >
      <span
        className={cn(
          "flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all",
          task.completed
            ? "border-foreground/30 bg-foreground/10"
            : "border-foreground/25",
        )}
      >
        {task.completed && (
          <Check className="w-2.5 h-2.5 text-foreground/60" strokeWidth={3} />
        )}
      </span>
      <span
        className={cn(
          "flex-1 text-sm transition-colors",
          task.completed
            ? "line-through text-foreground/40"
            : "text-foreground/80",
        )}
      >
        {task.text}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-foreground/25 hover:text-foreground/50 transition-all"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

function BrowserTabsPanel({ ref }: { ref?: React.Ref<{ focus: () => void }> }) {
  const [tabs, setTabs] = useState<BrowserTab[]>(mockBrowserTabs);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      searchRef.current?.focus();
    },
  }));

  const closeTab = (id: string) => {
    setTabs(tabs.filter((t) => t.id !== id));
  };

  const switchToTab = (url: string) => {
    window.open(url, "_blank");
  };

  const filteredTabs = tabs.filter(
    (tab) =>
      tab.title.toLowerCase().includes(search.toLowerCase()) ||
      tab.url.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-[280px] flex flex-col">
      {/* Search input */}
      <div className="flex items-center gap-2 px-1 -mx-1 mb-3">
        <Search className="w-3.5 h-3.5 text-foreground/30" strokeWidth={2} />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tabs..."
          className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-foreground/25 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-foreground/30 hover:text-foreground/50 transition-colors"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      {filteredTabs.length === 0 ? (
        <p className="text-foreground/25 text-sm text-center py-8">
          {tabs.length === 0 ? "No open tabs" : "No matching tabs"}
        </p>
      ) : (
        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-4">
            {filteredTabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => switchToTab(tab.url)}
                className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded cursor-pointer hover:bg-foreground/5 transition-colors"
              >
                {tab.favicon ? (
                  <img
                    src={tab.favicon || "/placeholder.svg"}
                    alt=""
                    className="w-4 h-4 rounded-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-foreground/40" />
                )}
                <span className="flex-1 text-sm text-foreground/70 group-hover:text-foreground/90 truncate">
                  {tab.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-foreground/25 hover:text-foreground/50 transition-all"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function MeetingsPanel() {
  const meetings = mockMeetings;

  if (meetings.length === 0) {
    return (
      <p className="text-foreground/25 text-sm text-center py-8">
        No meetings today
      </p>
    );
  }

  return (
    <ScrollArea className="h-[280px]">
      <div className="space-y-2 pr-4">
        {meetings.map((meeting) => (
          <a
            key={meeting.id}
            href={meeting.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg hover:bg-foreground/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
              <Video className="w-4 h-4 text-foreground/50" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground/80 group-hover:text-foreground/95 transition-colors">
                {meeting.title}
              </p>
              <p className="text-xs text-foreground/40">{meeting.time}</p>
            </div>
            <span className="text-xs text-foreground/30 group-hover:text-foreground/50 transition-colors">
              Join
            </span>
          </a>
        ))}
      </div>
    </ScrollArea>
  );
}

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Plus, Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("focus-tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("focus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

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
    setIsAdding(false);
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
    if (e.key === "Enter") {
      addTask();
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setNewTask("");
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium text-foreground/50 uppercase tracking-widest">
          Tasks
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
          aria-label="Add task"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-4">
          <div className="flex items-center gap-3 bg-foreground/5 rounded-lg px-3 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="New task..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
            <button
              onClick={() => {
                setIsAdding(false);
                setNewTask("");
              }}
              className="text-foreground/30 hover:text-foreground/60 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-0.5">
        {activeTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-foreground/10">
          <p className="text-[11px] text-foreground/30 mb-2 uppercase tracking-widest">
            Completed
          </p>
          <div className="space-y-0.5">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && !isAdding && (
        <p className="text-foreground/25 text-sm text-center py-8">
          No tasks yet
        </p>
      )}
    </div>
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
        "group flex items-center gap-3 py-2 px-1 -mx-1 rounded cursor-pointer hover:bg-foreground/5 transition-colors",
        task.completed && "opacity-50",
      )}
      onClick={() => onToggle(task.id)}
    >
      <span
        className={cn(
          "flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-all",
          task.completed
            ? "border-foreground/30 bg-foreground/10"
            : "border-foreground/25 group-hover:border-foreground/40",
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
        aria-label="Delete task"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

# Void — New Tab

A minimal Chrome extension that replaces your new tab page with a clean, distraction-free dashboard.

![Void New Tab](https://img.shields.io/badge/Chrome_Extension-Manifest_v3-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.0.1-lightgrey)

## Features

- **Live Clock** — Large digital clock with time-aware greeting and date
- **URL Bar** — Search the web or navigate directly to URLs (`/` to focus)
- **Task Manager** — Add, complete, and delete tasks; persisted to localStorage
- **Browser Tabs** — View and switch between open tabs with fuzzy search
- **Quick Links** — Customizable shortcut links with automatic favicon loading
- **Themes** — Dark, Light, and Notion-inspired variants
- **Settings** — Toggle each feature on/off from the settings panel

## Preview

A minimal new tab that stays out of your way — just a clock, a search bar, and the tools you actually use.

## Installation

### From Source

1. Clone the repo
   ```bash
   git clone https://github.com/c-w-d-harshit/void.git
   cd void
   ```

2. Install dependencies
   ```bash
   bun install
   ```

3. Build the extension
   ```bash
   bun run build
   ```

4. Load in Chrome
   - Go to `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `dist` folder

### Development

```bash
bun run dev
```

Then load the `dist` folder as an unpacked extension. Changes will hot-reload.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** + **@crxjs/vite-plugin** (Chrome extension bundling)
- **Tailwind CSS v4**
- **Radix UI** (accessible headless components)
- **Motion** (animations)
- **shadcn/ui** (component primitives)

## Project Structure

```
src/
├── components/
│   ├── clock.tsx          # Clock, greeting, date
│   ├── url-bar.tsx        # Search / URL navigation
│   ├── content-tabs.tsx   # Tasks, tabs, meetings panels
│   ├── quick-links.tsx    # Customizable link shortcuts
│   ├── settings-panel.tsx # Settings UI
│   └── theme-provider.tsx # Theme context
├── App.tsx                # Root component + settings state
└── main.tsx               # Entry point
```

## License

MIT — see [LICENSE](./LICENSE) for details.

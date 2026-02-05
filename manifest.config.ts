import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Void - New Tab",
  version: "0.0.1",
  description: "Minimal new tab replacement.",
  chrome_url_overrides: {
    newtab: "index.html",
  },
  permissions: ["tabs"],
});

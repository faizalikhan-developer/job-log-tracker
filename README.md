# JOB LOG TRACKER



Project Strucuture:

```
├── babel.config.js
├── eslint.config.js
├── index.html
├── jest.config.js
├── jest.setup.js
├── package.json
├── pnpm-lock.yaml
├── public
│   ├── about.txt
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── manifest.json
│   ├── site.webmanifest
│   └── vite.svg
├── README.md
├── src
│   ├── __tests__
│   │   ├── db.test.js
│   │   └── JobForm.test.js
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── Dashboard.jsx
│   │   ├── JobForm.jsx
│   │   ├── JobList.jsx
│   │   └── SearchFilter.jsx
│   ├── index.css
│   ├── main.jsx
│   └── services
│       ├── db.js
│       └── firebase.js
└── vite.config.js
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1e40af" />

    <!-- PWA manifest -->
    <link rel="manifest" href="/manifest.json" />
    <link
      rel="manifest"
      href="/site.webmanifest"
      type="application/manifest+json"
    />

    <!-- Favicons -->
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link
      rel="icon"
      type="image/png"
      sizes="192x192"
      href="/android-chrome-192x192.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="512x512"
      href="/android-chrome-512x512.png"
    />
    <link rel="icon" href="/favicon.ico" />

    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

```main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) =>
        console.log("Service Worker registered:", registration)
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error)
      );
  });
}
```

```manifest.json
{
  "name": "Job Application Log Tracker",
  "short_name": "JobLogTracker",
  "description": "Track job applications with offline support",
  "theme_color": "#1e40af",
  "background_color": "#f3f4f6",
  "display": "standalone",
  "start_url": "/",
  "scope": "/",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "/maskable-icon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

```site.webmanifest
{
  "name": "",
  "short_name": "",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

```vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "*.png",
        "manifest.json",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,ico,json}"], // Include json for manifest
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: { cacheName: "html-cache" },
          },
          {
            urlPattern: ({ request }) =>
              ["script", "style", "image", "manifest"].includes(
                request.destination
              ),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "asset-cache" },
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable service worker in dev mode for testing
      },
    }),
  ],
});
```
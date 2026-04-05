# SocialAutoPilot

Desktop app for automated browser interaction with portfolio platforms. Built with Electron + Puppeteer + Chromium with ad-blocker extension injection.

## How it works

1. Launches a real Chromium browser instance with uBlock Origin pre-loaded
2. Opens a target platform and handles authentication (including 2FA/SMS)
3. Navigates through content and performs automated interactions
4. Spoofs browser fingerprint (navigator.languages, plugins) to avoid detection

## Tech Stack

- **Electron** - desktop application shell with IPC communication
- **Puppeteer** - headless/headed Chromium automation
- **Chromium** - standalone browser (downloaded via init script, no system Chrome needed)
- **uBlock Origin** - injected as Chromium extension at launch to block tracking/ads
- **Bootstrap 5** - UI
- **dotenv** - credential management via .env

## Architecture

```
main.js          → Electron main process, Puppeteer launch, IPC handlers
renderer/
  index.html     → Login form UI
  renderer.js    → Renderer process, IPC to main
  preload.js     → Preload script
ptr.js           → Core automation logic (browser launch, login flow, interaction loop)
ptr-preload.js   → Browser fingerprint spoofing (navigator overrides)
```

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Download Chromium + uBlock Origin
npm run init

# 3. Configure credentials
cp .env.example .env
# Edit .env with your platform credentials

# 4. Run
npm run start
```

## Key Features

- **Extension injection** - loads uBlock as unpacked Chromium extension via `--disable-extensions-except` and `--load-extension` flags
- **Fingerprint spoofing** - overrides `navigator.languages` and `navigator.plugins` via page preload script
- **2FA support** - pauses for manual SMS code entry during login
- **Rate limiting awareness** - configurable delays between actions
- **Cross-platform packaging** - electron-packager scripts for Win/Mac/Linux

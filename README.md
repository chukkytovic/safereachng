# SafeReach NG

Direct emergency contacts for Nigerian security forces across all 36 states and FCT. One tap to call, SMS, or WhatsApp. No account. No server.

**Live:** [safereachng.vercel.app](https://safereachng.vercel.app)

## What it does

- Browse verified Police, Army, and NSCDC contacts by state
- Auto-detects your state from GPS on page load
- One-tap call, SMS, or WhatsApp to any contact
- Report incidents — messages go directly from your device via SMS and WhatsApp, nothing stored on a server
- Save personal contacts (a specific officer or unit you know) stored on your device only
- Free emergency lines work without airtime: 112 (all networks), 193 (Army), 09029164164 (NSCDC)
- Installable as a mobile app (PWA) — works offline

## Pages

| Route | Description |
|---|---|
| `/` | State selector with GPS auto-detect |
| `/[state]` | Emergency contacts for that state |
| `/report` | Report an incident via SMS or WhatsApp |
| `/my-contacts` | Save and reach personal contacts |
| `/feed` | Community alerts (coming soon) |

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · IBM Plex Sans/Mono · Static JSON contacts · No database · No auth

## Run locally

```bash
npm install
npm run dev
```

No environment variables needed.

## Contributing

The most useful contribution is verifying or adding phone numbers for your state. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — open source, free to use.
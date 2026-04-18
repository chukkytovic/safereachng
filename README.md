# SafeReach NG

In Nigeria, citizens are almost always the first to witness an attack. Bandit raids, kidnappings on highways, communal violence — ordinary Nigerians are there before any security force. Yet most people do not have a direct line to their state police command, army division, or NSCDC. By the time help is reached, it is often too late.

SafeReach NG closes that gap. Verified emergency contacts for Police, Army, and NSCDC across all 36 states and FCT — one tap to call, SMS, or WhatsApp. No account. No server. No airtime needed.

**Live:** [safereachng.vercel.app](https://safereachng.vercel.app)

## What it does

- Auto-detects your state from GPS on first open
- One-tap call, SMS, or WhatsApp to the right command for your state
- Report incidents with GPS coordinates sent directly from your phone
- Save personal contacts for officers or units you know directly, stored on your device only
- Free emergency lines work without airtime: 112 (all networks), 193 (Army), 09029164164 (NSCDC)
- Installable as a mobile app on Android and iPhone (PWA)

## Pages

| Route | Description |
|---|---|
| `/` | State selector with GPS auto-detect |
| `/[state]` | Emergency contacts for that state |
| `/report` | Report an incident via SMS or WhatsApp |
| `/my-contacts` | Save and reach personal contacts |

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · IBM Plex Sans/Mono · Static JSON contacts · No database · No auth · No ads

## Run locally

```bash
npm install
npm run dev
```

No environment variables needed.

## Contributing

The contacts database is where the real work is. If you know a verified direct line for your state's security command, your contribution could make a meaningful difference. See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — open source, free to use.
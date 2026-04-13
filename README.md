# SafeReach NG 🇳🇬

> Instantly reach security forces in any Nigerian state. One tap. No airtime needed.

SafeReach NG is an open-source civic safety web app (PWA) that gives Nigerians verified, state-specific emergency contacts for police, army, NSCDC, and other security forces — with one-tap calling, incident reporting, and a real-time community alert feed.

## Important Disclaimer

Numbers are community-maintained. Always cross-verify with official sources.
**In life-threatening emergencies, dial 112** — works without airtime on ALL Nigerian networks (MTN, Airtel, Glo, 9mobile).

## Features

- **One-tap calling** — direct lines for all 36 states + FCT
- **Free lines highlighted** — 112, 199, and other airtime-free numbers clearly marked
- **Auto-detect state** — GPS-based state detection
- **Incident reporting** — anonymous GPS-tagged community reports
- **Live alert feed** — real-time community incident updates
- **PWA** — installable on Android and iOS, works like a native app
- **Open source** — anyone can contribute contact data via GitHub PR

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Supabase (real-time + PostGIS)
- **Contact data**: Static JSON files in `/data/contacts/`
- **Deployment**: Vercel

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/safereachng.git
cd safereachng

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 4. Set up Supabase
# Run the SQL in lib/supabase.ts to create the incidents table

# 5. Run the dev server
npm run dev
```

## Setting Up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run:

```sql
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  state TEXT NOT NULL,
  lga TEXT NOT NULL,
  description TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  status TEXT DEFAULT 'unverified' CHECK (status IN ('active', 'resolved', 'unverified'))
);

ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read" ON incidents FOR SELECT USING (true);
```

3. Copy your project URL and anon key into `.env.local`

## Contributing Contact Data

The most impactful way to contribute is adding or verifying phone numbers for your state. See [CONTRIBUTING.md](./CONTRIBUTING.md).

**To add contacts for a state:**
1. Open `data/contacts/[state-slug].json`
2. Add your force entry following the schema in `data/contacts/_schema.json`
3. **Call the number first** to verify it's active and answers as the correct agency
4. Submit a PR with evidence of verification

## Project Structure

```
safereachng/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage (state selector)
│   ├── [state]/page.tsx    # State contact directory
│   ├── feed/page.tsx       # Community alert feed
│   ├── report/page.tsx     # Incident report form
│   └── api/report/         # Report submission API
├── components/             # React components
│   ├── contacts/           # Contact card components
│   ├── feed/               # Alert feed components
│   └── Navbar.tsx
├── data/contacts/          # JSON contact files (one per state)
├── lib/                    # Utilities
│   ├── contacts.ts         # Load/query contact JSON
│   ├── supabase.ts         # Supabase client
│   ├── geo.ts              # Geolocation utilities
│   └── utils.ts            # Shared helpers
└── public/                 # Static assets + PWA manifest
```

## Deployment

```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## License

MIT — free for anyone to use, fork, and build on.

Built with 🇳🇬 for Nigeria. Lives depend on this information being accurate.

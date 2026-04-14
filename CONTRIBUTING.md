# Contributing to SafeReach NG

Thank you for helping make this app more useful and potentially saving lives. The most impactful contribution is **adding or verifying phone numbers for your state**.

## How to Contribute Contact Data

### Step 1: Find your state file
Open `data/contacts/[your-state-slug].json`. The slug is the lowercase, hyphenated state name (e.g. `benue.json`, `cross-river.json`, `akwa-ibom.json`).

### Step 2: Add a force entry
Follow this format exactly:

```json
{
  "name": "Nigeria Police Force — [State] State Command",
  "type": "police",
  "division": "Control Room / State HQ, [Address]",
  "numbers": ["08XXXXXXXXX", "07XXXXXXXXX"],
  "is_free": false,
  "is_national": false,
  "source": "Where you found this number (URL, official social media, press release)",
  "verified": true,
  "last_updated": "2025-MM-DD",
  "notes": "Any important context about this number"
}
```

**Force types**: `police` | `army` | `nscdc` | `airforce` | `navy` | `dss` | `amotekun` | `vigilante` | `other`

### Step 3: VERIFY before submitting
This is non-negotiable. A wrong number in a safety app is dangerous.

**Verification checklist:**
- [ ] Called the number from a Nigerian line
- [ ] It answered (or rang — note if unanswered)
- [ ] Confirmed it answers as the correct agency (e.g. "Benue State Police Command")
- [ ] Note the date you called
- [ ] Note your name/handle (for accountability, not displayed publicly)

Set `"verified": true` only after calling. If you can't call it, set `"verified": false`.

### Step 4: Submit a Pull Request
In your PR description, include:
- Which state(s) you updated
- Source of the number(s)
- Date you verified (called) each number
- Your name or handle (optional but appreciated)

**PR title format**: `contacts: add/update [State] Police/Army/NSCDC numbers`

## State Slugs Reference

| State | Slug |
|---|---|
| Abia | `abia` |
| Adamawa | `adamawa` |
| Akwa Ibom | `akwa-ibom` |
| Anambra | `anambra` |
| Bauchi | `bauchi` |
| Bayelsa | `bayelsa` |
| Benue | `benue` |
| Borno | `borno` |
| Cross River | `cross-river` |
| Delta | `delta` |
| Ebonyi | `ebonyi` |
| Edo | `edo` |
| Ekiti | `ekiti` |
| Enugu | `enugu` |
| FCT (Abuja) | `fct` |
| Gombe | `gombe` |
| Imo | `imo` |
| Jigawa | `jigawa` |
| Kaduna | `kaduna` |
| Kano | `kano` |
| Katsina | `katsina` |
| Kebbi | `kebbi` |
| Kogi | `kogi` |
| Kwara | `kwara` |
| Lagos | `lagos` |
| Nasarawa | `nasarawa` |
| Niger | `niger` |
| Ogun | `ogun` |
| Ondo | `ondo` |
| Osun | `osun` |
| Oyo | `oyo` |
| Plateau | `plateau` |
| Rivers | `rivers` |
| Sokoto | `sokoto` |
| Taraba | `taraba` |
| Yobe | `yobe` |
| Zamfara | `zamfara` |

## States Most Needing Contributions

These states are currently stub-only (only 112/199):
- Bauchi, Delta, Ebonyi, Gombe, Katsina, Kebbi, Kogi, Kwara
- Nasarawa, Ogun, Ondo, Osun, Sokoto, Taraba

## Other Ways to Contribute

- **Report stale numbers** — open an issue if a number is no longer active
- **Code contributions** — see open issues for bugs and features
- **Testing** — test the app on different devices and report issues

## Code of Conduct

This app exists to protect lives. Contributions must be made in good faith. Deliberately submitting false numbers is harmful and will result in being permanently blocked from contributing.

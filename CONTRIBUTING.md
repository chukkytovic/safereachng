# Contributing to SafeReach NG

SafeReach NG exists because citizens in Nigeria often witness security incidents before any response force does — and many do not have a direct line to call. Every verified contact number added to this project makes the app more useful for someone in a genuine emergency.

There are two ways to contribute: contact data and code.

## Contributing Contact Data

This is the most impactful contribution. Each state has a JSON file in `data/contacts/`. If you know a direct, verified number for your state's police command, army division, NSCDC, or any other security force, open a Pull Request.

Before submitting a number:
- Call it yourself to confirm it is active and reaches the right unit
- Include the source — official website URL, verified government social account, or direct confirmation from a serving officer
- Set `"verified": true` only if you have personally confirmed the number works
- Update `"last_updated"` to today's date

To report a number that is wrong or no longer working, open an Issue with the state name, the incorrect number, and the correct one if you know it.

## Contact Data Format

Each state file in `data/contacts/` follows this structure:

```json
{
  "state": "Lagos",
  "slug": "lagos",
  "last_reviewed": "2026-04-18",
  "forces": [
    {
      "name": "Lagos State Police Command",
      "type": "police",
      "numbers": ["08039483516"],
      "is_free": false,
      "is_national": false,
      "source": "police.gov.ng",
      "verified": true,
      "last_updated": "2026-04-18"
    }
  ]
}
```

Valid force types: `police`, `army`, `nscdc`, `airforce`, `navy`, `dss`, `amotekun`, `vigilante`, `other`

## Contributing Code

### Setup

```bash
git clone https://github.com/chukkytovic/safereachng.git
cd safereachng
npm install
npm run dev
```

### Submitting a Pull Request

1. Fork the repository
2. Create a branch: `git checkout -b fix/lagos-police-number`
3. Make your changes
4. Run `npm run lint` and confirm no errors
5. Commit with a clear message: `git commit -m "fix: update Lagos police direct line"`
6. Push and open a Pull Request against `main`

### Reporting bugs

Open an Issue describing what happened, what you expected, and what device and browser you were using.

### Suggesting features

Open an Issue with a clear description of the feature and the problem it solves for Nigerian users.

## Ground Rules

- Only submit numbers you have personally verified are active
- Do not submit numbers from unverified social media posts or forwarded WhatsApp messages
- Do not submit personal phone numbers without explicit permission from the owner
- Keep Pull Requests focused — one state or one fix per PR
- This is a civic safety tool — accuracy matters more than volume

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
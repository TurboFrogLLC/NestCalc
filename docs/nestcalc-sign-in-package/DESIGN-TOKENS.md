# Design Tokens — NestCalc Sign-in

**Visual authority:** `REFERENCE-PROTOTYPE.html`  
**Status:** Locked exploratory design · not a product GOAL

## Hard rules (fail closed)

1. **Page background is light grey** `#E8E8EC`. A full dark page shell for sign-in is a failure for this package.
2. **Login card is dark** using NestCalc panel family (`#0E0C14` / `#16121F` / `#1E1A2A`). A white/light Clerk card is a failure.
3. **Primary CTA and focus = Calculator blue** `#538BEC` only. Amber `#fbbf24` (current product) is a failure.
4. **Wordmark:** `Nest` dark slate on light page + italic `Calc` in `#538BEC`. Amber Calc is a failure.
5. **No request-access block** in this visual authority. Product currently ships `RequestAccessForm` under the card — removing it is a **policy decision** that requires an explicit future GOAL (Clerk request-access is a protected surface). This package does not authorize silent removal without that GOAL.
6. **No orange glow / bloom** behind the card. Orange may appear only as subtle social-button hover border tint and optional secondary accent text if a future GOAL reintroduces approval copy.
7. **No footer “no public sign-up / access by approval” line** in this visual authority.

## Palette

| Token | Hex | Role |
|-------|-----|------|
| `--page` | `#E8E8EC` | Full-page sign-in background |
| `--panel` | `#0E0C14` | Clerk card surface |
| `--surface` | `#16121F` | Inputs, social button base |
| `--raised` | `#1E1A2A` | Social button hover |
| `--border` | `#2A2438` | Card border, divider |
| `--border-soft` | `#3A3250` | Input / social borders |
| `--text` | `#F4F2F8` | Card primary text |
| `--muted` | `#9B94A8` | Card secondary text |
| `--label` | `#C4BDD0` | Field labels |
| `--nest` | `#1A1724` | Wordmark “Nest” on light page |
| `--tagline` | `#5C5668` | Tagline on light page |
| `--blue` | `#538BEC` | Primary button, focus ring, italic Calc |
| `--blue-hover` | `#3F78E0` | Primary button hover |
| `--orange` | `#EE8C3C` | Social hover border tint only (subtle) |

## Geometry

| Token | Value |
|-------|--------|
| Card max width | `28rem` (`max-w-md`) |
| Card radius | `0.75rem` |
| Control radius | `0.5rem` |
| Input / primary / social height | `2.5rem` (40px) |
| Card padding | `1.5rem 1.25rem 1.35rem` |
| Page padding | `2rem 1rem` (mobile); `2.5rem 1.5rem` (sm+) |

## Clerk appearance mapping (product wire — future GOAL only)

When a future Path B freeze authorizes auth chrome:

| Clerk slot | Package treatment |
|------------|-------------------|
| Page shell | Light grey `#E8E8EC` (not dark app `--background`) |
| `card` / `cardBox` | Dark panel `#0E0C14`, border `#2A2438`, soft black shadow |
| `formFieldInput` | Surface `#16121F`, border `#3A3250`, text light; focus `#538BEC` |
| `formButtonPrimary` | Fill `#538BEC`, text white; hover `#3F78E0` |
| `socialButtonsBlockButton` | Surface base; hover raised + optional orange border tint |
| `headerTitle` / `headerSubtitle` | Light text / muted |
| Footer public sign-up links | Remain hidden (`nestcalcSignInAppearance` already hides footer) |
| `colorPrimary` variable | `#538BEC` (replace current `#fbbf24`) |

## Rejected alternatives (do not revive without new design pass)

- NanoTate-style full white page + white card + `#1d6ff2`
- Amber primary (`#fbbf24`) on white card (current NestCalc product)
- Orange glow / drop-shadow bloom behind card
- Request-access section under the card (visual removal only if policy GOAL allows)
- “No public sign-up · access by approval” footer line

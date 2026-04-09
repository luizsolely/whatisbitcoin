# ₿ whatisbitcoin.com — Angular Landing Page

A dark, editorial-style landing page telling the complete story of Bitcoin.

## Design System

| Token | Value |
|---|---|
| Primary Color | `#F7931A` (Bitcoin Orange) |
| Background | `#080808` (Void Black) |
| Surface | `#141414` |
| Display Font | Playfair Display (Google Fonts) |
| Mono Font | Space Mono (Google Fonts) |
| Body Font | Outfit (Google Fonts) |

## Features

- **Canvas particle system** — 120 particles orbit the Bitcoin ₿ logo in an elliptical path, simulating a cosmic ring system
- **Pulsing glow** — the ₿ symbol has a live, breathing glow animation
- **Smooth scroll navigation** — sticky navbar with active section detection
- **Full Bitcoin history timeline** — 2008 → 2024 with highlight events
- **Responsive** — fully adapts from mobile to widescreen
- **Standalone Angular 17** — uses modern standalone components, no NgModules

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Open browser
# http://localhost:4200
```

## Project Structure

```
src/
├── index.html                  # App shell with Google Fonts
├── main.ts                     # Bootstrap standalone app
└── app/
    ├── app.component.ts        # Logic: particles, timeline data, scroll
    ├── app.component.html      # Template: hero, stats, origin, timeline...
    └── app.component.scss      # All styles with CSS variables
```

## Sections

1. **Hero** — Full-viewport with canvas particle effect around ₿ logo
2. **Stats Bar** — 4 key Bitcoin metrics
3. **Origin** — Why Bitcoin was created (2008 crisis context)
4. **Timeline** — 8 key events from 2008–2024
5. **Technology** — 4 pillars (decentralization, blockchain, PoW, halving)
6. **Impact** — Global financial, social and technological legacy
7. **CTA Band** — Call to action
8. **Footer** — Brand + disclaimer

## Next Steps (Full-Stack)

- [ ] Add Angular Router with individual section pages
- [ ] Create `/block/:height` route for live block explorer
- [ ] Add Node.js/Express backend for Bitcoin price API
- [ ] Integrate CoinGecko or Blockchain.info APIs
- [ ] Add interactive price chart (Chart.js or D3)
- [ ] Add animated halving countdown
- [ ] Implement i18n for Portuguese/Spanish audiences
- [ ] Add blog/article system for deep-dive content

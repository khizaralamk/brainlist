# brainlist

Landing page for [Brainlist Calendar](https://apps.apple.com/ca/app/brainlist-calendar/id6795180261), the notes app where every entry shows up in your list and your calendar.

Built with Vite, React, TypeScript, GSAP (ScrollTrigger, Draggable) and Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Needs Node 20.18+.

## Structure

- `src/sections/` — page sections (Hero, Marquee, Demo, Features, Wheel, Story, Pro, Cta/Footer)
- `src/components/` — cursor, nav, masked headings, App Store button
- `src/lib/motion.ts` — GSAP plugin registration and Lenis smooth scroll
- `src/lib/links.ts` — App Store, Product Hunt and founder links
- `src/index.css` — all styles (flat colours, no gradients)

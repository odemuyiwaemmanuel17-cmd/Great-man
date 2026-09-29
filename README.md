# HandyTrust — Fix it now. Pay when it's done.

The escrow-backed home maintenance platform, presented as a cinematic scroll
experience. Dark navy interface, photorealistic Nigerian scenes, restrained
amber accents.

## Stack

- React 19 + TypeScript
- Vite 5
- Tailwind CSS 3 (design tokens exposed as raw `oklch()` channel triplets so
  alpha modifiers compose correctly)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the built bundle
```

## Structure

```
src/
  data/content.ts          all copy, beat timing, services, footer — no presentation
  lib/timeline.ts          shared handle so nav/rail can drive the pinned timeline
  context/BookingContext   opens the booking modal with a preselected service
  components/
    ScrollyExperience.tsx  the 8-beat pinned timeline + spring scroll engine
    CinematicImage.tsx     responsive plate, grade overlay, scene decor
    SectionTransition.tsx  one-shot entrance for informational sections
    Cards.tsx              ServiceCard / TrustCard
    Navbar.tsx  Footer.tsx  Sections.tsx  BookingModal.tsx  icons.tsx
    ui/Buttons.tsx         GoldButton / DarkButton
```

## The scroll engine

The timeline track is `900vh` tall with a `100vh` sticky stage inside it. Scroll
position is normalised to `0..1`, then run through a critically-damped spring
(`stiffness 55`, `damping 2·√55`) so motion reads as expensive rather than
mechanical. Each beat derives a signed distance `h` from its own centre, which
drives:

- **opacity** — a cross-dissolve through dark between beats
- **scale** — pushes in from `1.18×` and settles to `0.86×` as it passes
- **perspective** — subtle `rotateY` / `rotateX` and vertical drift
- **parallax** — the image plate moves against its scene
- **card + hotspot reveal** — gated on distance, with a horizontal slide from
  the card's anchor side

Transforms are written directly to inline styles inside a single
`requestAnimationFrame` loop, so React never re-renders during scroll.

## Scenes

Eight beats: aerial entry, plumbing, AC, electrical, solar, artisan, escrow,
neighbourhood reveal. Each is a full-bleed photograph with a diegetic motion
accent (dripping trap, airflow lines, blinking board LEDs, solar glow, floating
naira, twinkling street lights).

Images live in `public/scenes/` at two widths (1376 / 768) as WebP. Only the
hero is preloaded; everything else is lazy.

## Accessibility & performance

- `prefers-reduced-motion` disables the spring, the 3D perspective, the parallax
  and the scene animations, while keeping the cross-dissolves (not a vestibular
  trigger).
- Booking modal is a native `<dialog>`: focus trapping and Escape come from the
  platform. Backdrop dismissal checks both the event target and pointer
  coordinates, so keyboard-activated controls (which report `0,0`) can never
  close it by accident.
- Skip link, `aria-current` on the timeline rail, labelled icon buttons.
- Production bundle: ~80 kB JS gzipped, ~5 kB CSS gzipped, ~676 kB of imagery.

import type { Beat } from '../data/content';

/**
 * Responsive cinematic plate. Every scene is a full-bleed photographic frame,
 * so we serve a half-width variant to small screens and preload only the hero.
 */
export function CinematicImage({
  beat,
  eager = false,
}: {
  beat: Beat;
  eager?: boolean;
}) {
  const base = beat.image.replace(/-\d+\.webp$/, '');
  return (
    <img
      src={beat.image}
      srcSet={`${base}-768.webp 768w, ${base}-1376.webp 1376w`}
      sizes="100vw"
      alt={`${beat.title} — ${beat.kicker}`}
      className="h-full w-full object-cover"
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      fetchPriority={eager ? 'high' : 'auto'}
      draggable={false}
    />
  );
}

/**
 * Vignette + bottom lift. Keeps type legible over bright sky without
 * crushing the photograph.
 */
export function SceneGrade() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 40%, oklch(0.13 0.025 262 / 72%) 100%), linear-gradient(to top, oklch(0.13 0.025 262 / 85%) 0%, transparent 45%)',
      }}
    />
  );
}

/**
 * Restrained, scene-specific motion. Each effect is diegetic — drips on the
 * leaking trap, airflow off the AC, LEDs on the board — never decorative.
 */
export function SceneDecor({ decor }: { decor: Beat['decor'] }) {
  if (decor === 'drips') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute h-3 w-1.5 rounded-full bg-sky-300/80"
            style={{
              left: `${46 + i * 1.6}%`,
              top: '50%',
              animation: `ht-drip 1.6s ${i * 0.55}s cubic-bezier(0.5,0,0.9,0.6) infinite`,
            }}
          />
        ))}
        <span
          className="absolute h-6 w-14 rounded-[50%] border border-sky-300/50"
          style={{ left: '43.5%', top: '74%', animation: 'ht-ripple 1.6s ease-out infinite' }}
        />
      </div>
    );
  }

  if (decor === 'airflow') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            viewBox="0 0 90 12"
            className="absolute w-24 text-sky-200/50"
            style={{
              left: '46%',
              top: `${42 + i * 5}%`,
              animation: `ht-airflow 2.4s ${i * 0.7}s ease-in-out infinite`,
            }}
          >
            <path
              d="M2 6 Q 14 1, 26 6 T 50 6 T 74 6 T 88 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>
    );
  }

  if (decor === 'leds') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { x: 39, y: 38, c: '#f87171', d: 0 },
          { x: 42.5, y: 38, c: '#4ade80', d: 0.4 },
          { x: 39, y: 52, c: '#4ade80', d: 0.9 },
          { x: 42.5, y: 52, c: '#f87171', d: 1.3 },
        ].map((l, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              backgroundColor: l.c,
              color: l.c,
              animation: `ht-blink 1.4s ${l.d}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  if (decor === 'sun') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span
          className="absolute h-72 w-72 rounded-full"
          style={{
            left: '28%',
            top: '18%',
            background:
              'radial-gradient(circle, oklch(0.85 0.14 85 / 55%) 0%, transparent 70%)',
            animation: 'ht-glow 4s ease-in-out infinite',
          }}
        />
      </div>
    );
  }

  if (decor === 'verified') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute flex items-center gap-2 rounded-xl border border-border bg-card/85 px-3 py-2 shadow-lg backdrop-blur"
          style={{ left: '56%', top: '26%', animation: 'ht-float-up 5s ease-in-out infinite alternate' }}
        >
          <span className="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </span>
          <div className="text-xs leading-tight">
            <p className="font-semibold text-card-foreground">Identity verified</p>
            <p className="text-muted-foreground">42 jobs · 4.9 rating</p>
          </div>
        </div>
      </div>
    );
  }

  if (decor === 'coins') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-primary/60 bg-primary/20 font-bold text-primary backdrop-blur-sm"
            style={{
              left: `${38 + i * 6}%`,
              top: '58%',
              animation: `ht-float-up ${4 + i * 0.7}s ${i * 0.9}s ease-in-out infinite`,
            }}
          >
            ₦
          </span>
        ))}
      </div>
    );
  }

  if (decor === 'lights') {
    return (
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[
          { x: 18, y: 30, d: 0 },
          { x: 62, y: 22, d: 1.1 },
          { x: 80, y: 40, d: 2.2 },
          { x: 34, y: 18, d: 3 },
          { x: 52, y: 34, d: 1.7 },
        ].map((l, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              animation: `ht-twinkle 3.4s ${l.d}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}

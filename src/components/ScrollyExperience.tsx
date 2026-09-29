import { useEffect, useRef } from 'react';
import type { Ref } from 'react';
import { beats, railIcons, TIMELINE_VH } from '../data/content';
import type { Beat } from '../data/content';
import { CinematicImage, SceneDecor, SceneGrade } from './CinematicImage';
import { Icon } from './icons';
import { GoldButton, DarkButton } from './ui/Buttons';
import { useBooking } from '../context/BookingContext';
import { timeline } from '../lib/timeline';

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** Hermite smoothstep between two edges, evaluated on `x`. */
function smooth(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Critically-damped spring constants — matches the reference pacing. */
const STIFFNESS = 55;
const DAMPING = 2 * Math.sqrt(STIFFNESS);

const TOTAL = beats.length;

function Hotspot({ hotspot }: { hotspot: Beat['hotspots'][number] }) {
  return (
    <div className="relative -translate-x-1/2 -translate-y-1/2">
      <span
        className="absolute inset-0 rounded-full border-2 border-primary"
        style={{ animation: 'ht-pulse-ring 1.8s ease-out infinite' }}
      />
      <span className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-background/70 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="absolute left-6 top-1/2 w-max -translate-y-1/2 rounded-md border border-border bg-card/85 px-2 py-1 text-[11px] font-medium text-card-foreground backdrop-blur">
        {hotspot.label}
      </span>
    </div>
  );
}

function SceneCard({
  beat,
  ref,
}: {
  beat: Beat;
  ref: Ref<HTMLDivElement>;
}) {
  const { openBooking } = useBooking();
  const side =
    beat.cardSide === 'left' ? 'md:left-12 md:right-auto' : 'md:left-auto md:right-16';

  return (
    <div
      ref={ref}
      className={`absolute bottom-24 left-4 right-4 sm:bottom-28 md:bottom-32 md:max-w-md ${side}`}
      style={{ opacity: 0 }}
    >
      <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-2xl backdrop-blur-md md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {beat.kicker}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight text-card-foreground md:text-3xl">
          {beat.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          {beat.copy}
        </p>
        {(beat.cta || beat.secondaryCta) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {beat.cta && (
              <GoldButton onClick={() => openBooking(beat.cta!.service)}>
                {beat.cta.label}
              </GoldButton>
            )}
            {beat.secondaryCta && (
              <DarkButton onClick={() => openBooking(beat.secondaryCta!.service)}>
                {beat.secondaryCta.label}
              </DarkButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScrollyExperience() {
  const { openBooking } = useBooking();
  const trackRef = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const state = { progress: 0, velocity: 0 };
    let last = performance.now();
    let raf = 0;

    const centres = beats.map((b) => (b.start + b.end) / 2);
    const halves = beats.map((b) => (b.end - b.start) / 2 || 1e-6);

    const jumpTo = (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const span = track.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: centres[i] * span,
        behavior: reduced ? 'auto' : 'smooth',
      });
    };
    timeline.jumpTo = jumpTo;

    const render = (p: number) => {
      let active = 0;
      let best = Infinity;

      beats.forEach((beat, i) => {
        const scene = sceneRefs.current[i];
        if (!scene) return;
        const img = imgRefs.current[i];
        const spot = spotRefs.current[i];
        const card = cardRefs.current[i];

        const h = (p - centres[i]) / halves[i];
        const dist = Math.abs(h);
        if (dist < best) {
          best = dist;
          active = i;
        }

        const enter = smooth(-1, 0, h);
        const exit = smooth(0, 1, h);
        const scale = reduced
          ? 1
          : beat.fov * (h < 0 ? lerp(1.18, 1, enter) : lerp(1, 0.86, exit));
        // Cross-dissolves are kept even under reduced-motion: only the 3D
        // perspective, rotation and parallax are vestibular triggers.
        const opacity = smooth(-1, -0.35, h) * (1 - smooth(0.45, 1, h));

        scene.style.opacity = opacity.toFixed(3);
        scene.style.transform = reduced
          ? 'none'
          : `perspective(1400px) translate3d(0, ${(h * -2).toFixed(2)}%, 0) rotateY(${(h * -3).toFixed(2)}deg) rotateX(${(h * 1.4).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        scene.style.zIndex = String(10 - Math.round(dist * 10));
        scene.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';

        if (img && !reduced) {
          img.style.transform = `translate3d(${(h * -2.4).toFixed(2)}%, ${(h * 0.8).toFixed(2)}%, 0) scale(1.14)`;
        }

        const reveal = 1 - smooth(0.35, 0.75, dist);

        if (spot) {
          spot.style.opacity = reveal.toFixed(3);
          spot.style.transform = `scale(${(0.7 + reveal * 0.3).toFixed(3)})`;
          spot.style.visibility = reveal < 0.05 ? 'hidden' : 'visible';
        }

        if (card) {
          const dir = beat.cardSide === 'left' ? -1 : 1;
          card.style.opacity = reveal.toFixed(3);
          card.style.transform = `translate3d(${(dir * (1 - reveal) * 48).toFixed(1)}px, 0, 0)`;
          card.style.visibility = reveal < 0.05 ? 'hidden' : 'visible';
          card.style.pointerEvents = reveal > 0.6 ? 'auto' : 'none';
        }
      });

      railRefs.current.forEach((el, i) => {
        if (!el) return;
        const on = i === active;
        el.setAttribute('aria-current', on ? 'true' : 'false');
        el.classList.toggle('ht-rail-active', on);
      });

      if (counterRef.current) {
        counterRef.current.textContent = `${String(beats[active].index).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`;
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - smooth(0.01, 0.06, p));
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const track = trackRef.current;
      const span = track ? track.offsetHeight - window.innerHeight : 0;
      const rect = track?.getBoundingClientRect();
      const target = span > 0 && rect ? clamp(-rect.top / span) : 0;

      if (reduced) {
        state.progress = target;
        state.velocity = 0;
      } else {
        const accel = (target - state.progress) * STIFFNESS - state.velocity * DAMPING;
        state.velocity += accel * dt;
        state.progress += state.velocity * dt;
      }

      render(clamp(state.progress));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      timeline.jumpTo = undefined;
    };
  }, []);

  return (
    <section id="experience" className="relative">
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${TIMELINE_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {beats.map((beat, i) => (
            <div
              key={beat.id}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="ht-scene absolute inset-0"
              style={{ opacity: 0 }}
              aria-hidden={i === 0 ? undefined : 'true'}
            >
              <div
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-transform"
              >
                <CinematicImage beat={beat} eager={i === 0} />
              </div>

              <SceneGrade />
              <SceneDecor decor={beat.decor} />

              {beat.hotspots[0] && (
                <div
                  ref={(el) => {
                    spotRefs.current[i] = el;
                  }}
                  className="absolute"
                  style={{
                    left: `${beat.hotspots[0].x}%`,
                    top: `${beat.hotspots[0].y}%`,
                    opacity: 0,
                  }}
                >
                  <Hotspot hotspot={beat.hotspots[0]} />
                </div>
              )}

              <SceneCard
                beat={beat}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            </div>
          ))}

          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
            style={{ animation: 'ht-scroll-hint 1.8s ease-in-out infinite' }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-foreground/80">
              Scroll to travel the timeline
            </p>
            <Icon name="chevron-down" className="mx-auto mt-1 h-5 w-5 text-primary" />
          </div>

          <nav
            aria-label="Timeline beats"
            className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
          >
            {beats.map((beat, i) => (
              <button
                key={beat.id}
                type="button"
                ref={(el) => {
                  railRefs.current[i] = el;
                }}
                onClick={() => timeline.jumpTo?.(i)}
                aria-current="false"
                aria-label={`Jump to beat ${beat.index}: ${beat.label}`}
                className="ht-rail-btn group flex items-center gap-2"
              >
                <span className="ht-rail-label rounded-md border border-border bg-card/85 px-2 py-1 text-[11px] font-medium text-card-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                  {beat.label}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur transition group-hover:text-primary">
                  <Icon name={railIcons[i]} className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 pb-3">
              <span
                ref={counterRef}
                className="font-mono text-[11px] font-semibold tracking-widest text-primary"
              >
                01 / 08
              </span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  ref={barRef}
                  className="h-full w-full origin-left rounded-full bg-primary"
                  style={{ transform: 'scaleX(0)' }}
                />
              </div>
              <span className="hidden text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:block">
                Escrow timeline
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

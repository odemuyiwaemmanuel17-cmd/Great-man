import { navLinks } from '../data/content';
import { Icon } from './icons';
import { GoldButton } from './ui/Buttons';
import { useBooking } from '../context/BookingContext';
import { timeline } from '../lib/timeline';

export default function Navbar() {
  const { openBooking } = useBooking();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#experience" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Icon name="wrench" className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight text-foreground">
              HandyTrust
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Fix it now. Pay when it&rsquo;s done.
            </span>
          </span>
        </a>

        <nav aria-label="Timeline" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => timeline.jumpTo?.(link.beat)}
              className="ht-nav-btn"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <GoldButton variant="default" onClick={() => openBooking('General maintenance')}>
            Book a fix
          </GoldButton>
        </div>
      </div>
    </header>
  );
}

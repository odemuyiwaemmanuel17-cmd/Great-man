import { footer } from '../data/content';
import { Icon } from './icons';

const socials = [
  { name: 'facebook' as const, href: 'https://facebook.com', label: 'Facebook' },
  { name: 'twitter' as const, href: 'https://x.com', label: 'X' },
  { name: 'instagram' as const, href: 'https://instagram.com', label: 'Instagram' },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <a href="#experience" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Icon name="wrench" className="h-5 w-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-foreground">
              HandyTrust
            </span>
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {footer.blurb}
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Icon name={s.name} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Explore" className="text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            {footer.explore.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">
            Contact
          </h2>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Icon name="phone" className="h-4 w-4 shrink-0 text-primary" />
              <a href="tel:+2347004263987" className="transition hover:text-primary">
                {footer.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" className="h-4 w-4 shrink-0 text-primary" />
              <a
                href={`mailto:${footer.contact.email}`}
                className="transition hover:text-primary"
              >
                {footer.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{footer.contact.address.join(' ')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
          <p>{footer.copyright}</p>
          <p className="flex items-center gap-1.5">
            Made in Lagos
            <span aria-hidden="true" className="text-primary">
              ·
            </span>
            Escrow-protected
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Icon } from './icons';
import type { IconName } from './icons';

/** Gold-tinted icon chip used by both step and service cards. */
function IconChip({ name }: { name: IconName }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
      <Icon name={name} className="h-5 w-5" />
    </span>
  );
}

export function TrustCard({
  icon,
  title,
  copy,
}: {
  icon: IconName;
  title: string;
  copy: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-7 shadow-lg">
      <IconChip name={icon} />
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
    </article>
  );
}

export function ServiceCard({
  icon,
  title,
  copy,
  cta,
  onBook,
}: {
  icon: IconName;
  title: string;
  copy: string;
  cta: string;
  onBook: () => void;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-lg transition hover:border-primary/40">
      <IconChip name={icon} />
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{copy}</p>
      <button
        type="button"
        onClick={onBook}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:brightness-110"
      >
        {cta}
        <Icon name="arrow-right" className="h-4 w-4" />
      </button>
    </article>
  );
}

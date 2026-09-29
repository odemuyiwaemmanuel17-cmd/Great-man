import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'cta' | 'hero';

const sizes: Record<Variant, string> = {
  /** Nav-sized gold action. */
  default: 'px-4 py-2 text-sm',
  /** Scene card CTA. */
  cta: 'px-5 py-2.5 text-sm',
  /** Final call-to-action. */
  hero: 'px-6 py-3 text-sm',
};

type GoldProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function GoldButton({
  variant = 'cta',
  className = '',
  children,
  ...rest
}: GoldProps) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-primary font-semibold text-primary-foreground shadow-lg transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${sizes[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function DarkButton({
  variant = 'cta',
  className = '',
  children,
  ...rest
}: GoldProps) {
  return (
    <button
      type="button"
      className={`rounded-lg border border-border bg-secondary/60 font-semibold text-secondary-foreground backdrop-blur transition hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${sizes[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

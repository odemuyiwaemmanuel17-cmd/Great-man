import { services, steps } from '../data/content';
import { ServiceCard, TrustCard } from './Cards';
import SectionTransition from './SectionTransition';
import { GoldButton, DarkButton } from './ui/Buttons';
import { useBooking } from '../context/BookingContext';

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative z-10 border-t border-border bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTransition>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
            Three steps between a broken home and a fixed one
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            No advance-payment stories. No &ldquo;I&rsquo;ll come back tomorrow&rdquo;.
            Escrow keeps both sides honest &mdash; you get the repair, the artisan gets
            paid, and the money only moves when the job is right.
          </p>
        </SectionTransition>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <SectionTransition key={step.title} delay={i * 90}>
              <TrustCard icon={step.icon} title={step.title} copy={step.copy} />
            </SectionTransition>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid() {
  const { openBooking } = useBooking();

  return (
    <section
      id="services"
      className="relative z-10 border-t border-border bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionTransition>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Services
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl">
            Every corner of the house, covered
          </h2>
        </SectionTransition>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => (
            <SectionTransition key={svc.title} delay={i * 80}>
              <ServiceCard
                icon={svc.icon}
                title={svc.title}
                copy={svc.copy}
                cta={svc.cta}
                onBook={() => openBooking(svc.service)}
              />
            </SectionTransition>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { openBooking } = useBooking();

  return (
    <section
      id="contact-us"
      className="relative z-10 border-t border-border bg-background py-20 md:py-28"
    >
      <SectionTransition className="mx-auto max-w-4xl px-4 text-center md:px-8">
        <h2 className="text-3xl font-bold leading-tight md:text-4xl">
          Ready to fix it &mdash; and only pay when it&rsquo;s done?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Book your first escrow-protected repair in under two minutes, or join the
          network as a verified artisan and get paid the moment a job is approved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GoldButton variant="hero" onClick={() => openBooking('General maintenance')}>
            Book a fix
          </GoldButton>
          <DarkButton variant="hero" onClick={() => openBooking('Join as an artisan')}>
            Join as an artisan
          </DarkButton>
        </div>
      </SectionTransition>
    </section>
  );
}

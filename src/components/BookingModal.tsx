import { useEffect, useRef, useState } from 'react';
import {
  bookingSteps,
  budgetOptions,
  escrowPromises,
  serviceOptions,
} from '../data/content';
import { Icon } from './icons';
import { useBooking } from '../context/BookingContext';

type Fields = {
  service_needed: string;
  issue_description: string;
  preferred_date: string;
  full_name: string;
  phone_number: string;
  property_address: string;
  estimated_budget: string;
};

const empty: Fields = {
  service_needed: '',
  issue_description: '',
  preferred_date: '',
  full_name: '',
  phone_number: '',
  property_address: '',
  estimated_budget: '',
};

/** Required fields checked before each step may advance. */
const stepRequired: (keyof Fields)[][] = [
  ['service_needed'],
  ['full_name', 'phone_number', 'property_address'],
  [],
];

export default function BookingModal() {
  const { open, service, closeBooking } = useBooking();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Open / close the native dialog so we inherit focus trapping and Esc.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open) {
      setStep(0);
      setErrors({});
      setSubmitted(false);
      setValues((v) => ({
        ...v,
        service_needed: service && serviceOptions.includes(service) ? service : v.service_needed,
      }));
      if (el.open === false) el.showModal();
      document.body.style.overflow = 'hidden';
    } else if (el.open) {
      el.close();
      document.body.style.overflow = '';
    }
  }, [open, service]);

  useEffect(() => () => {
    document.body.style.overflow = '';
  }, []);

  const set = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const advance = () => {
    const missing: Partial<Record<keyof Fields, boolean>> = {};
    stepRequired[step].forEach((key) => {
      if (!values[key].trim()) missing[key] = true;
    });

    if (Object.keys(missing).length) {
      setErrors(missing);
      return;
    }

    setErrors({});
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setSubmitted(true);
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const invalid = (key: keyof Fields) =>
    `ht-input${errors[key] ? ' ring-2 ring-destructive/60' : ''}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="ht-booking-title"
      onClose={() => {
        document.body.style.overflow = '';
        closeBooking();
      }}
      onClick={(e) => {
        // Close on a genuine backdrop click only. Two guards matter here:
        // the target must be the dialog box itself (not a nested control), and
        // keyboard activation reports 0,0, which must never read as a click
        // outside the panel.
        const el = dialogRef.current;
        if (!el || e.target !== el) return;
        const { clientX, clientY } = e.nativeEvent as MouseEvent;
        if (clientX === 0 && clientY === 0) return;
        const r = el.getBoundingClientRect();
        const inside =
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom;
        if (!inside) closeBooking();
      }}
      className="ht-dialog fixed inset-0 z-[100] m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-background/80"
    >
      <div className="max-h-[85vh] overflow-y-auto p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Icon name="lock" className="h-4 w-4" />
              Escrow booking
            </p>
            <h2 id="ht-booking-title" className="mt-1 text-xl font-bold md:text-2xl">
              Book a verified artisan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You pay into escrow &mdash; the artisan is paid only when you approve the work.
            </p>
          </div>
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Close booking dialog"
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>

        <ol className="mt-5 flex items-center gap-2" aria-label="Booking progress">
          {bookingSteps.map((label, i) => (
            <li
              key={label}
              className={`ht-dot flex-1${i === step ? ' ht-dot-active' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            >
              <span>{label}</span>
            </li>
          ))}
        </ol>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm text-foreground">
            <p className="font-semibold">Request received! 🎉</p>
            <p className="mt-1 text-muted-foreground">
              We&rsquo;re matching you with a verified artisan. You&rsquo;ll get escrow
              funding details by SMS shortly.
            </p>
            <button
              type="button"
              onClick={closeBooking}
              className="ht-btn-primary mt-4"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              advance();
            }}
          >
            {step === 0 && (
              <fieldset className="space-y-4 border-0 p-0">
                <legend className="sr-only">The job</legend>
                <div>
                  <label htmlFor="service_needed" className="ht-label">
                    Service needed{' '}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </label>
                  <select
                    id="service_needed"
                    required
                    value={values.service_needed}
                    onChange={(e) => set('service_needed', e.target.value)}
                    className={invalid('service_needed')}
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {serviceOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="issue_description" className="ht-label">
                    Describe the issue
                  </label>
                  <textarea
                    id="issue_description"
                    rows={3}
                    placeholder="e.g. The P-trap under the kitchen sink has been dripping for two weeks…"
                    value={values.issue_description}
                    onChange={(e) => set('issue_description', e.target.value)}
                    className="ht-input resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="preferred_date" className="ht-label">
                    Preferred date
                  </label>
                  <input
                    id="preferred_date"
                    type="text"
                    placeholder="e.g. Saturday morning, 20 Sep"
                    value={values.preferred_date}
                    onChange={(e) => set('preferred_date', e.target.value)}
                    className="ht-input"
                  />
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="space-y-4 border-0 p-0">
                <legend className="sr-only">Your details</legend>
                <div>
                  <label htmlFor="full_name" className="ht-label">
                    Full name{' '}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    autoComplete="name"
                    value={values.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                    className={invalid('full_name')}
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="ht-label">
                    Phone number{' '}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </label>
                  <input
                    id="phone_number"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="e.g. 0803 000 0000"
                    value={values.phone_number}
                    onChange={(e) => set('phone_number', e.target.value)}
                    className={invalid('phone_number')}
                  />
                </div>
                <div>
                  <label htmlFor="property_address" className="ht-label">
                    Property address{' '}
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  </label>
                  <input
                    id="property_address"
                    type="text"
                    required
                    autoComplete="street-address"
                    placeholder="Street, area, city"
                    value={values.property_address}
                    onChange={(e) => set('property_address', e.target.value)}
                    className={invalid('property_address')}
                  />
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-4 border-0 p-0">
                <legend className="sr-only">Escrow</legend>
                <div>
                  <label htmlFor="estimated_budget" className="ht-label">
                    Estimated budget
                  </label>
                  <select
                    id="estimated_budget"
                    value={values.estimated_budget}
                    onChange={(e) => set('estimated_budget', e.target.value)}
                    className="ht-input"
                  >
                    <option value="" disabled>
                      Select a range
                    </option>
                    {budgetOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon name="shield-check" className="h-4 w-4 text-primary" />
                    How escrow protects you
                  </p>
                  <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {escrowPromises.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ol>
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={back} className="ht-btn-secondary">
                  Back
                </button>
              ) : (
                <span />
              )}
              <span className="flex-1" />
              {step < 2 ? (
                <button type="submit" className="ht-btn-primary">
                  Next
                </button>
              ) : (
                <button type="submit" className="ht-btn-primary">
                  Confirm booking request
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

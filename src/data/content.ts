import type { IconName } from '../components/icons';

export type Hotspot = { x: number; y: number; label: string };

export type Decor =
  | 'none'
  | 'drips'
  | 'airflow'
  | 'leds'
  | 'sun'
  | 'verified'
  | 'coins'
  | 'lights';

export type Beat = {
  id: string;
  index: number;
  label: string;
  kicker: string;
  title: string;
  copy: string;
  image: string;
  /** Scroll window occupied by this beat, as a fraction of the timeline. */
  start: number;
  end: number;
  /** Scale applied when the beat is perfectly centred. */
  fov: number;
  cardSide: 'left' | 'right';
  decor: Decor;
  hotspots: Hotspot[];
  cta?: { label: string; service: string };
  secondaryCta?: { label: string; service: string };
};

const scene = (name: string) => `/scenes/${name}`;

export const beats: Beat[] = [
  {
    id: 'entry',
    index: 1,
    label: 'Entry',
    kicker: 'Welcome to HandyTrust',
    title: 'Fix it now. Pay when it’s done.',
    copy: 'Scroll to travel through a real Nigerian residence — from the leak under the sink to the solar on the roof — and watch every repair get protected by escrow.',
    image: scene('hero-1376.webp'),
    start: 0,
    end: 0.12,
    fov: 1.02,
    cardSide: 'left',
    decor: 'none',
    hotspots: [],
  },
  {
    id: 'plumbing',
    index: 2,
    label: 'Plumbing',
    kicker: 'Beat 02 · Plumbing',
    title: 'The leak under the sink',
    copy: 'That drip has been “manageable” for months. Book a verified plumber, fund escrow, and release payment only when the trap joint is fixed, tested and dry.',
    image: scene('plumbing-1376.webp'),
    start: 0.13,
    end: 0.25,
    fov: 1.05,
    cardSide: 'right',
    decor: 'drips',
    hotspots: [{ x: 47, y: 48, label: 'Leaking trap joint' }],
    cta: { label: 'Book a plumber', service: 'Plumbing repair' },
  },
  {
    id: 'ac-repair',
    index: 3,
    label: 'AC Repair',
    kicker: 'Beat 03 · Cooling',
    title: 'The AC that barely blows',
    copy: 'Weak airflow, warm nights, endless “come back tomorrow”. A verified technician services your split unit — gas, filters, and all — held to standard by escrow.',
    image: scene('ac-1376.webp'),
    start: 0.26,
    end: 0.38,
    fov: 1,
    cardSide: 'left',
    decor: 'airflow',
    hotspots: [{ x: 50, y: 34, label: 'Weak airflow · dusty filters' }],
    cta: { label: 'Book AC service', service: 'AC repair & servicing' },
  },
  {
    id: 'electrical',
    index: 4,
    label: 'Electrical',
    kicker: 'Beat 04 · Electrical',
    title: 'The board nobody trusts',
    copy: 'Live wires, tripping breakers, guesswork. A certified electrician makes your distribution board safe — and the job is verified before a single naira leaves escrow.',
    image: scene('electrical-1376.webp'),
    start: 0.39,
    end: 0.5,
    fov: 1.06,
    cardSide: 'right',
    decor: 'leds',
    hotspots: [{ x: 44, y: 44, label: 'Open board · live circuits' }],
    cta: { label: 'Book an electrician', service: 'Electrical repair' },
  },
  {
    id: 'solar',
    index: 5,
    label: 'Solar',
    kicker: 'Beat 05 · Energy',
    title: 'Power that pays for itself',
    copy: 'Rooftop solar, inverter and battery — designed, installed and commissioned by vetted energy pros, with each milestone released from escrow as you approve it.',
    image: scene('solar-1376.webp'),
    start: 0.51,
    end: 0.63,
    fov: 1,
    cardSide: 'left',
    decor: 'sun',
    hotspots: [{ x: 70, y: 62, label: 'Inverter & battery stack' }],
    cta: { label: 'Get a solar quote', service: 'Solar & inverter installation' },
  },
  {
    id: 'artisans',
    index: 6,
    label: 'Artisans',
    kicker: 'Beat 06 · The people',
    title: 'Verified artisans. Real accountability.',
    copy: 'Every HandyTrust artisan is identity-checked, skill-tested and rated by neighbours like you. Their payment is protected too — released the moment you approve the job.',
    image: scene('artisan-1376.webp'),
    start: 0.64,
    end: 0.75,
    fov: 1.03,
    cardSide: 'right',
    decor: 'verified',
    hotspots: [{ x: 42, y: 30, label: 'ID-verified · skill-tested pro' }],
    cta: { label: 'Join as an artisan', service: 'Join as an artisan' },
  },
  {
    id: 'escrow',
    index: 7,
    label: 'Escrow',
    kicker: 'Beat 07 · Escrow',
    title: 'Your money, held in a glass vault',
    copy: 'Funds sit in escrow — visible to you and the artisan — until the work passes inspection. No advance-payment stories. No disputes left to chance.',
    image: scene('escrow-1376.webp'),
    start: 0.76,
    end: 0.88,
    fov: 1.04,
    cardSide: 'left',
    decor: 'coins',
    hotspots: [{ x: 50, y: 60, label: 'Escrow padlock · funds locked' }],
  },
  {
    id: 'neighbourhood',
    index: 8,
    label: 'Neighbourhood',
    kicker: 'Beat 08 · The reveal',
    title: 'A neighbourhood that just works',
    copy: 'One street. Every home maintained. Every artisan paid fairly, on time. Book your first escrow-protected repair — or join the network as a verified pro.',
    image: scene('neighbourhood-1376.webp'),
    start: 0.89,
    end: 1,
    fov: 0.96,
    cardSide: 'right',
    decor: 'lights',
    hotspots: [],
    cta: { label: 'Book a fix', service: 'General maintenance' },
    secondaryCta: { label: 'Join as an artisan', service: 'Join as an artisan' },
  },
];

/** Height of the pinned timeline, in viewport heights. */
export const TIMELINE_VH = 900;

export const railIcons: IconName[] = [
  'map-pin',
  'wrench',
  'wind',
  'zap',
  'sun-medium',
  'badge-check',
  'lock',
  'shield-check',
];

export const navLinks: { label: string; beat: number }[] = [
  { label: 'Plumbing', beat: 1 },
  { label: 'AC Repair', beat: 2 },
  { label: 'Electrical', beat: 3 },
  { label: 'Solar', beat: 4 },
  { label: 'Artisans', beat: 5 },
  { label: 'Escrow', beat: 6 },
];

export type Step = {
  icon: IconName;
  title: string;
  copy: string;
};

export const steps: Step[] = [
  {
    icon: 'message-square',
    title: '1. Describe the fault',
    copy: 'A dripping trap, a weak AC, a sparking board. Tell us what’s wrong and pick a time that suits you.',
  },
  {
    icon: 'badge-check',
    title: '2. Meet your verified artisan',
    copy: 'We match you with an identity-checked, skill-tested pro rated by neighbours on your street.',
  },
  {
    icon: 'lock',
    title: '3. Pay into escrow — not upfront',
    copy: 'Your money waits in the glass vault. It releases only when you inspect and approve the finished work.',
  },
];

export type Service = {
  icon: IconName;
  title: string;
  copy: string;
  cta: string;
  service: string;
};

export const services: Service[] = [
  {
    icon: 'wrench',
    title: 'Plumbing',
    copy: 'Leaks, blockages, pump and tank repairs — fixed and pressure-tested before escrow releases.',
    cta: 'Book a plumber',
    service: 'Plumbing repair',
  },
  {
    icon: 'wind',
    title: 'AC repair & servicing',
    copy: 'Gas top-ups, deep cleaning and full split-unit servicing for cooling that actually cools.',
    cta: 'Book AC service',
    service: 'AC repair & servicing',
  },
  {
    icon: 'zap',
    title: 'Electrical',
    copy: 'Distribution boards, wiring faults and breaker upgrades handled by certified electricians.',
    cta: 'Book an electrician',
    service: 'Electrical repair',
  },
  {
    icon: 'sun-medium',
    title: 'Solar & inverter',
    copy: 'Design, install and commission rooftop solar, inverters and batteries with milestone-based escrow.',
    cta: 'Get a solar quote',
    service: 'Solar & inverter installation',
  },
];

export const bookingSteps = ['1 · The job', '2 · Your details', '3 · Escrow'] as const;

export const serviceOptions = [
  'Plumbing repair',
  'AC repair & servicing',
  'Electrical repair',
  'Solar & inverter installation',
  'General maintenance',
  'Join as an artisan',
];

export const budgetOptions = [
  'Under ₦20,000',
  '₦20,000 – ₦50,000',
  '₦50,000 – ₦150,000',
  '₦150,000+',
  'Not sure yet',
];

export const escrowPromises = [
  '1. Your payment is held in a secure escrow vault.',
  '2. The artisan sees the funds are locked and starts work.',
  '3. You inspect the job — funds release only on your approval.',
];

export const footer = {
  blurb:
    'The escrow-backed home maintenance platform. Verified artisans, protected payments, and repairs that actually get finished — across Lagos, Abuja and beyond.',
  explore: [
    { label: 'The escrow timeline', href: '#experience' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
    { label: 'Book a fix', href: '#contact-us' },
  ],
  contact: {
    phone: '0700 HANDYTRUST',
    email: 'hello@handytrust.ng',
    address: ['14 Adeola Odeku Street,', 'Victoria Island,', 'Lagos'],
  },
  copyright: '© 2026 HandyTrust Technologies Ltd. All rights reserved.',
};

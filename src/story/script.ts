export interface CameraKey {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}

/**
 * One continuous film. The camera travels through the compound, into the
 * house, to the burst pipe, back out for the arrival, inside for the repair,
 * to the escrow safe, then out and up over the neighborhood.
 */
export const CAM_KEYS: CameraKey[] = [
  { t: 0.0, pos: [3.2, 3.4, 30], look: [0, 2.2, 8], fov: 40 },
  { t: 0.06, pos: [0.9, 2.3, 19], look: [0, 1.9, 6], fov: 40 },
  { t: 0.12, pos: [0, 1.75, 11.5], look: [0, 1.6, 2], fov: 42 },
  { t: 0.165, pos: [0, 1.6, 4.6], look: [0, 1.45, -1], fov: 46 },
  { t: 0.21, pos: [-0.5, 1.55, 0.6], look: [-2, 1.3, -4], fov: 48 },
  { t: 0.265, pos: [-1.15, 1.4, -2.4], look: [-2, 1.1, -5.6], fov: 46 },
  { t: 0.32, pos: [-1.62, 1.12, -4.15], look: [-2, 0.92, -5.78], fov: 44 },
  { t: 0.375, pos: [-1.45, 0.85, -3.5], look: [-1.85, 0.45, -5.2], fov: 50 },
  { t: 0.43, pos: [0.3, 1.5, -1.1], look: [-1.6, 0.95, -4.8], fov: 46 },
  { t: 0.485, pos: [1.05, 1.42, 0.15], look: [1.72, 1.32, 1.15], fov: 38 },
  { t: 0.53, pos: [0.45, 1.6, 7.6], look: [0, 1.5, 13], fov: 42 },
  { t: 0.595, pos: [0.95, 0.36, 8.4], look: [-0.6, 0.32, 3.5], fov: 50 },
  { t: 0.665, pos: [-1.5, 1.02, -3.95], look: [-2, 0.95, -5.78], fov: 42 },
  { t: 0.75, pos: [-2.55, 1.28, -2.9], look: [-1.85, 0.55, -5.3], fov: 46 },
  { t: 0.815, pos: [2.35, 1.5, -1.35], look: [3.72, 1.42, -2.15], fov: 40 },
  { t: 0.885, pos: [2.9, 1.42, -0.55], look: [3.6, 1.3, -1.85], fov: 40 },
  { t: 0.935, pos: [0, 3.6, 7.5], look: [0, 2.4, -2], fov: 45 },
  { t: 1.0, pos: [0, 27, 48], look: [0, 0.5, 7], fov: 52 },
];

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const smooth = (v: number) => {
  const x = clamp01(v);
  return x * x * (3 - 2 * x);
};

/** 0→1 ramp across [a,b] of story time, eased. */
export const ramp = (t: number, a: number, b: number) => smooth((t - a) / (b - a));

/** 1→0 fall-off ramp. */
export const fall = (t: number, a: number, b: number) => 1 - ramp(t, a, b);

/** 1 inside [a,b] (with eased edges), 0 outside. */
export const window01 = (t: number, a: number, b: number, edge = 0.012) =>
  ramp(t, a, a + edge) * fall(t, b - edge, b);

/** A value that holds after reaching 1. */
export const holds = (t: number, a: number, b: number) => ramp(t, a, b);

// ---------------------------------------------------------------------------
// Event timeline — every visual event reads these windows from story.t.
// ---------------------------------------------------------------------------
export const EVENTS = {
  /** first drips appear once the camera is inside */
  dripStart: 0.2,
  /** leak visibly worsens */
  leakGrows: [0.24, 0.32] as const,
  /** the burst */
  burst: [0.325, 0.34] as const,
  burstHold: [0.34, 0.39] as const,
  shake: [0.325, 0.385] as const,
  /** water spreads across the floor */
  puddle: [0.33, 0.5] as const,
  /** homeowner discovers it; phone lights the room */
  discovery: [0.4, 0.52] as const,
  captionClock: [0.415, 0.5] as const,
  captionBurst: [0.365, 0.43] as const,
  /** report → match on the phone screen */
  phoneReport: [0.44, 0.475] as const,
  phoneMatch: [0.475, 0.53] as const,
  captionMatch: [0.5, 0.56] as const,
  /** van arrives at the gate */
  vanArrival: [0.525, 0.585] as const,
  /** boots walk past the low camera into the house */
  bootsWalk: [0.585, 0.66] as const,
  /** the repair: wrench works, fitting replaced, water stops */
  wrenchWork: [0.66, 0.74] as const,
  waterStops: 0.742,
  /** result: quiet room, wet floor remains, warm light returns */
  result: [0.745, 0.8] as const,
  /** escrow sequence */
  escrowPay: [0.8, 0.835] as const,
  escrowLock: [0.835, 0.855] as const,
  escrowEvidence: [0.855, 0.875] as const,
  escrowApprove: [0.875, 0.89] as const,
  escrowRelease: [0.89, 0.925] as const,
  /** pull back over the neighborhood */
  reveal: [0.925, 1.0] as const,
} as const;

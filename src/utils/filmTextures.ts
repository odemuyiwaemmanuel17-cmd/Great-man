import * as THREE from 'three';

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function finish(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 4;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Worn bathroom tiles — believable grout lines and subtle variation. */
export function tileTexture() {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#8d938e';
  ctx.fillRect(0, 0, 512, 512);
  const size = 64;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const v = 208 + Math.floor(Math.random() * 22);
      ctx.fillStyle = `rgb(${v - 14},${v - 4},${v - 10})`;
      ctx.fillRect(x * size + 3, y * size + 3, size - 6, size - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(x * size + 3, y * size + 3, size - 6, 8);
    }
  }
  return finish(c, 3, 2);
}

/** Cement screed with aggregate speckle. */
export function concreteTexture() {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#9a948a';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++) {
    const v = 120 + Math.floor(Math.random() * 90);
    ctx.fillStyle = `rgba(${v},${v - 6},${v - 14},0.35)`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.6, 1.6);
  }
  return finish(c, 2, 2);
}

/** Painted plaster with faint trowel streaks. */
export function plasterTexture(tint = '#c8b79a') {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 260; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
    ctx.lineWidth = 2 + Math.random() * 9;
    ctx.beginPath();
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.moveTo(x, y);
    ctx.lineTo(x + 40 + Math.random() * 130, y + (Math.random() - 0.5) * 30);
    ctx.stroke();
  }
  return finish(c, 2, 1);
}

export interface PhoneScreenSpec {
  kind: 'lock' | 'report' | 'match';
}

/** HandyTrust phone screens drawn as believable UI, not decoration. */
export function phoneScreenTexture({ kind }: PhoneScreenSpec) {
  const c = makeCanvas(360, 720);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0b0d12';
  ctx.fillRect(0, 0, 360, 720);
  ctx.fillStyle = '#e8e6e0';
  ctx.textAlign = 'center';

  if (kind === 'lock') {
    ctx.font = '300 92px Georgia';
    ctx.fillText('9:47', 180, 240);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#8b93a5';
    ctx.fillText('Wednesday 14', 180, 285);
    ctx.fillStyle = '#ffb04d';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('⚠ 2 missed calls', 180, 420);
  }

  if (kind === 'report') {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1d2129';
    ctx.fillRect(20, 40, 320, 88);
    ctx.fillStyle = '#e8e6e0';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('HandyTrust', 40, 96);
    ctx.fillStyle = '#ff5b4a';
    ctx.beginPath();
    ctx.arc(312, 84, 9, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#e8e6e0';
    ctx.font = '700 30px sans-serif';
    ctx.fillText('Report a problem', 40, 190);
    ctx.fillStyle = '#232834';
    ctx.fillRect(20, 225, 320, 120);
    ctx.fillStyle = '#ffb04d';
    ctx.font = '700 26px sans-serif';
    ctx.fillText('PLUMBING EMERGENCY', 40, 272);
    ctx.fillStyle = '#aab2c2';
    ctx.font = '20px sans-serif';
    ctx.fillText('Burst pipe — water spreading', 40, 306);
    ctx.fillText('across bathroom floor', 40, 332);
    ctx.fillStyle = '#232834';
    ctx.fillRect(20, 370, 320, 64);
    ctx.fillStyle = '#aab2c2';
    ctx.fillText('📍 14 Awolowo Ave, Ibadan', 40, 410);
    ctx.fillStyle = '#00c878';
    ctx.fillRect(20, 470, 320, 66);
    ctx.fillStyle = '#04150c';
    ctx.font = '700 26px sans-serif';
    ctx.fillText('Send request', 118, 512);
  }

  if (kind === 'match') {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e8e6e0';
    ctx.font = '700 30px sans-serif';
    ctx.fillText('Matched', 40, 120);
    ctx.fillStyle = '#232834';
    ctx.fillRect(20, 160, 320, 150);
    ctx.fillStyle = '#00c878';
    ctx.beginPath();
    ctx.arc(70, 235, 34, 0, 7);
    ctx.fill();
    ctx.fillStyle = '#0b0d12';
    ctx.font = '700 34px sans-serif';
    ctx.fillText('T', 60, 248);
    ctx.fillStyle = '#e8e6e0';
    ctx.font = '700 28px sans-serif';
    ctx.fillText('Tunde A.', 124, 218);
    ctx.fillStyle = '#aab2c2';
    ctx.font = '20px sans-serif';
    ctx.fillText('Verified plumber · ★ 4.9', 124, 250);
    ctx.fillText('212 jobs · escrow protected', 124, 280);
    ctx.fillStyle = '#ffb04d';
    ctx.font = '700 30px sans-serif';
    ctx.fillText('Arriving in 12 min', 40, 400);
    ctx.fillStyle = '#aab2c2';
    ctx.font = '20px sans-serif';
    ctx.fillText('Payment held safely until you approve', 40, 445);
  }

  return finish(c);
}

/** Crisp spatial typography rendered inside the world. */
export function textPlaneTexture(text: string, options?: { weight?: string; size?: number; color?: string }) {
  const c = makeCanvas(1024, 256);
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 1024, 256);
  ctx.font = `${options?.weight ?? '300'} ${options?.size ?? 96}px Georgia, serif`;
  ctx.fillStyle = options?.color ?? '#f2ead9';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 18;
  ctx.fillText(text, 512, 128);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

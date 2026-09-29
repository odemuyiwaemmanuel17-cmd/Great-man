import { story } from './store';
import { EVENTS, ramp, window01 } from './script';

/**
 * A small procedural sound bed — no audio files, no autoplay.
 * City hum, dripping that accelerates into the burst, water spread,
 * the vault bolt and a coin chime, all mixed from story.t.
 */
export class FilmAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private humGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private dripTimer = 0;
  private raf = 0;
  private last = 0;
  private started = false;

  start() {
    if (this.started) {
      this.ctx?.resume();
      return;
    }
    this.started = true;
    const Ctx = window.AudioContext;
    const ctx = new Ctx();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
    this.master = master;

    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastValue = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      lastValue = (lastValue + 0.02 * white) / 1.02;
      data[i] = lastValue * 3.2;
    }
    noise.buffer = buffer;
    noise.loop = true;

    const humFilter = ctx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 130;
    this.humGain = ctx.createGain();
    this.humGain.gain.value = 0.24;
    noise.connect(humFilter).connect(this.humGain).connect(master);

    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.value = 1400;
    waterFilter.Q.value = 0.8;
    this.waterGain = ctx.createGain();
    this.waterGain.gain.value = 0;
    const waterSource = ctx.createBufferSource();
    waterSource.buffer = buffer;
    waterSource.loop = true;
    waterSource.connect(waterFilter).connect(this.waterGain).connect(master);

    noise.start();
    waterSource.start();

    this.last = ctx.currentTime;
    const tick = () => {
      const t = story.t;
      const now = ctx.currentTime;
      const dt = now - this.last;
      this.last = now;
      if (this.waterGain) {
        const bursting = window01(t, EVENTS.burst[0], EVENTS.waterStops);
        const trickling = window01(t, EVENTS.dripStart, EVENTS.burst[0]) * 0.18;
        this.waterGain.gain.value = bursting * 0.3 + trickling;
      }
      const leak = ramp(t, EVENTS.dripStart, EVENTS.burst[0]);
      const rate = 0.9 - leak * 0.55;
      this.dripTimer += dt;
      if (t > EVENTS.dripStart && t < EVENTS.burst[0] && this.dripTimer > rate) {
        this.dripTimer = 0;
        this.blip(1650 + Math.random() * 500, 0.05, 0.12);
      }
      if (window01(t, EVENTS.burst[0], EVENTS.burst[0] + 0.02) > 0.5) {
        this.blip(220, 0.5, 0.5);
      }
      if (window01(t, EVENTS.escrowLock[0], EVENTS.escrowLock[0] + 0.015) > 0.5) {
        this.blip(140, 0.5, 0.22);
      }
      if (window01(t, EVENTS.escrowRelease[0], EVENTS.escrowRelease[0] + 0.015) > 0.5) {
        this.blip(2300, 0.25, 0.4);
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private blip(freq: number, gain: number, dur: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur);
    osc.connect(g).connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + dur + 0.05);
  }

  stop() {
    if (this.ctx) this.ctx.suspend();
    cancelAnimationFrame(this.raf);
  }
}

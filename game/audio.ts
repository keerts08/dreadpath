"use client";

const MASTER_HEADROOM = 0.55;

class HouseAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private heartGain: GainNode | null = null;
  private lowpass: BiquadFilterNode | null = null;
  private heartTimer: ReturnType<typeof setTimeout> | null = null;
  private volume = 0.75;
  private tension = 0;
  private lowSanity = false;
  private hidden = false;
  private running = false;

  ensureStarted() {
    if (this.running) {
      this.ctx?.resume().catch(() => {});
      return;
    }
    if (typeof window === "undefined") return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    this.ctx = ctx;
    this.running = true;

    const master = ctx.createGain();
    master.gain.value = this.volume * MASTER_HEADROOM;
    master.connect(ctx.destination);
    this.master = master;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 300;
    lowpass.connect(master);
    this.lowpass = lowpass;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.35;
    droneGain.connect(lowpass);
    this.droneGain = droneGain;

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 58.3;
    osc1.connect(droneGain);
    osc2.connect(droneGain);
    osc1.start();
    osc2.start();

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();
    this.noiseGain = noiseGain;

    const heartGain = ctx.createGain();
    heartGain.gain.value = 0.0;
    heartGain.connect(master);
    this.heartGain = heartGain;

    this.scheduleHeartbeat();
    this.applyTension();
  }

  private thump(when: number, volume: number) {
    const ctx = this.ctx;
    const heartGain = this.heartGain;
    if (!ctx || !heartGain) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(70, when);
    osc.frequency.exponentialRampToValueAtTime(38, when + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(volume, when + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.25);
    osc.connect(g);
    g.connect(heartGain);
    osc.start(when);
    osc.stop(when + 0.3);
  }

  private scheduleHeartbeat = () => {
    if (!this.running || !this.ctx) return;
    const t = this.tension;
    if (t > 0.15) {
      const now = this.ctx.currentTime;
      const volume = 0.18 + t * 0.5;
      this.thump(now, volume);
      this.thump(now + 0.16, volume * 0.7);
    }
    const interval = 1400 - t * 950;
    this.heartTimer = setTimeout(
      this.scheduleHeartbeat,
      Math.max(350, interval),
    );
  };

  private applyTension() {
    const ctx = this.ctx;
    if (!ctx || !this.lowpass || !this.droneGain || !this.noiseGain) return;
    const now = ctx.currentTime;
    const t = this.tension;
    const sanityBoost = this.lowSanity ? 0.15 : 0;
    const eff = Math.min(1, t + sanityBoost);

    this.lowpass.frequency.linearRampToValueAtTime(260 + eff * 1400, now + 1.2);
    this.droneGain.gain.linearRampToValueAtTime(0.25 + eff * 0.5, now + 1.2);
    this.noiseGain.gain.linearRampToValueAtTime(
      (this.hidden ? 0.04 : 0.07) + eff * 0.22,
      now + 1.2,
    );
  }

  update(opts: { tension: number; lowSanity: boolean; hidden: boolean }) {
    this.tension = Math.max(0, Math.min(1, opts.tension));
    this.lowSanity = opts.lowSanity;
    this.hidden = opts.hidden;
    if (this.running) this.applyTension();
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.master && this.ctx) {
      this.master.gain.linearRampToValueAtTime(
        volume * MASTER_HEADROOM,
        this.ctx.currentTime + 0.4,
      );
    }
  }

  /**
   * A single short, filtered noise burst - a footstep. Silently does
   * nothing if the audio graph hasn't started yet, so RoomCanvas can call
   * this freely during movement without worrying about start-up order.
   */
  footstep() {
    if (!this.running || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.06 + Math.random() * 0.03;

    const buffer = ctx.createBuffer(
      1,
      Math.ceil(ctx.sampleRate * duration),
      ctx.sampleRate,
    );
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = last * (1 - i / data.length);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320 + Math.random() * 120;

    const volume = 0.12 + Math.random() * 0.05;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(now);
    source.stop(now + duration);
  }

  jumpscare() {
    const ctx = this.ctx;
    if (!ctx) return;
    this.ensureStarted();
    const now = ctx.currentTime;

    const shriek = ctx.createOscillator();
    shriek.type = "sawtooth";
    shriek.frequency.setValueAtTime(1400, now);
    shriek.frequency.exponentialRampToValueAtTime(90, now + 0.6);

    const shriekGain = ctx.createGain();
    shriekGain.gain.setValueAtTime(0.0001, now);
    shriekGain.gain.exponentialRampToValueAtTime(0.9, now + 0.03);
    shriekGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(44100);
    for (let i = 0; i < curve.length; i++) {
      const x = (i / curve.length) * 2 - 1;
      curve[i] = Math.tanh(x * 6);
    }
    distortion.curve = curve;

    shriek.connect(distortion);
    distortion.connect(shriekGain);
    shriekGain.connect(this.master ?? ctx.destination);
    shriek.start(now);
    shriek.stop(now + 0.75);

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const burstGain = ctx.createGain();
    burstGain.gain.setValueAtTime(0.7, now);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    src.connect(burstGain);
    burstGain.connect(this.master ?? ctx.destination);
    src.start(now);
  }

  stopAll() {
    if (this.heartTimer) clearTimeout(this.heartTimer);
    this.heartTimer = null;
    this.ctx?.close().catch(() => {});
    this.ctx = null;
    this.running = false;
  }
}

export const houseAudio = new HouseAudio();

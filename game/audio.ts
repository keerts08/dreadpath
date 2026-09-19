"use client";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientSource: AudioBufferSourceNode | null = null;
let started = false;

function getContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function buildAmbientBuffer(context: AudioContext): AudioBuffer {
  const duration = 4;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, duration * sampleRate, sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

export const houseAudio = {
  ensureStarted() {
    if (started) return;
    started = true;
    const context = getContext();
    if (context.state === "suspended") context.resume();

    const buffer = buildAmbientBuffer(context);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(masterGain!);
    source.start();
    ambientSource = source;
  },

  applySettings(enabled: boolean, volume: number) {
    if (!masterGain) return;
    masterGain.gain.value = enabled ? volume : 0;
  },

  stop() {
    ambientSource?.stop();
    ambientSource = null;
    started = false;
  },
};

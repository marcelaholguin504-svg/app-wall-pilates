// Motor de sonido 100% generado en el navegador con Web Audio API — sin
// archivos de audio externos ni licencias de terceros (ver sección 14).

import type { SoundType } from "@/types";

function makeNoiseBuffer(ctx: AudioContext, kind: "white" | "pink" | "brown", seconds = 3): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (kind === "white") {
    for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1;
  } else if (kind === "brown") {
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  } else {
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;
    for (let i = 0; i < bufferSize; i += 1) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
      data[i] = pink * 0.11;
    }
  }
  return buffer;
}

const LULLABY_NOTES = [523.25, 587.33, 659.25, 587.33, 523.25, 440, 493.88, 523.25];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private nodes: (AudioNode | AudioScheduledSourceNode)[] = [];
  private sleepTimer: ReturnType<typeof setTimeout> | null = null;
  private intervalTimer: ReturnType<typeof setInterval> | null = null;
  playing: SoundType | null = null;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  stop(): void {
    this.nodes.forEach((n) => {
      try {
        (n as AudioScheduledSourceNode).stop?.();
        n.disconnect();
      } catch {
        // nodo ya detenido
      }
    });
    this.nodes = [];
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }
    if (this.sleepTimer) {
      clearTimeout(this.sleepTimer);
      this.sleepTimer = null;
    }
    this.playing = null;
  }

  setSleepTimer(minutes: number): void {
    if (this.sleepTimer) clearTimeout(this.sleepTimer);
    if (minutes > 0) {
      this.sleepTimer = setTimeout(() => this.stop(), minutes * 60000);
    }
  }

  play(type: SoundType): void {
    this.stop();
    const ctx = this.ensureContext();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    this.nodes.push(master);

    const loopedNoise = (kind: "white" | "pink" | "brown") => {
      const source = ctx.createBufferSource();
      source.buffer = makeNoiseBuffer(ctx, kind);
      source.loop = true;
      return source;
    };

    if (type === "white" || type === "pink" || type === "brown") {
      const source = loopedNoise(type);
      source.connect(master);
      source.start();
      this.nodes.push(source);
    } else if (type === "rain") {
      const source = loopedNoise("white");
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 1200;
      const flutter = ctx.createOscillator();
      flutter.frequency.value = 5.5;
      const flutterGain = ctx.createGain();
      flutterGain.gain.value = 0.08;
      flutter.connect(flutterGain);
      flutterGain.connect(master.gain);
      source.connect(highpass);
      highpass.connect(master);
      source.start();
      flutter.start();
      this.nodes.push(source, highpass, flutter, flutterGain);
    } else if (type === "waves") {
      const source = loopedNoise("brown");
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 700;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      source.connect(lowpass);
      lowpass.connect(master);
      source.start();
      lfo.start();
      this.nodes.push(source, lowpass, lfo, lfoGain);
    } else if (type === "fan") {
      const source = loopedNoise("pink");
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 900;
      const hum = ctx.createOscillator();
      hum.type = "sine";
      hum.frequency.value = 100;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.04;
      hum.connect(humGain);
      humGain.connect(master);
      source.connect(lowpass);
      lowpass.connect(master);
      source.start();
      hum.start();
      this.nodes.push(source, lowpass, hum, humGain);
    } else if (type === "rain_journey") {
      const rainSource = loopedNoise("white");
      const highpass = ctx.createBiquadFilter();
      highpass.type = "highpass";
      highpass.frequency.value = 1400;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.5;
      rainSource.connect(highpass);
      highpass.connect(rainGain);
      rainGain.connect(master);

      const rumbleSource = loopedNoise("brown");
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 220;
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.6;
      rumbleSource.connect(lowpass);
      lowpass.connect(rumbleGain);
      rumbleGain.connect(master);

      rainSource.start();
      rumbleSource.start();
      this.nodes.push(rainSource, highpass, rainGain, rumbleSource, lowpass, rumbleGain);
    } else if (type === "lullaby") {
      let step = 0;
      const playNote = () => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = LULLABY_NOTES[step % LULLABY_NOTES.length];
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.08);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
        step += 1;
      };
      playNote();
      this.intervalTimer = setInterval(playNote, 700);
    } else if (type === "heartbeat") {
      const beat = (delay: number, freq: number, level: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = ctx.currentTime + delay;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(level, t + 0.04);
        gain.gain.linearRampToValueAtTime(0, t + 0.22);
        osc.connect(gain);
        gain.connect(master);
        osc.start(t);
        osc.stop(t + 0.25);
      };
      const playBeatPair = () => {
        beat(0, 68, 0.5);
        beat(0.28, 55, 0.35);
      };
      playBeatPair();
      this.intervalTimer = setInterval(playBeatPair, 900);
    }

    this.playing = type;
  }
}

export const soundEngine = new SoundEngine();

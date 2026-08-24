// Motor de sonido 100% generado en el navegador con Web Audio API.
// No depende de archivos de audio externos.

function makeNoiseBuffer(ctx, kind, seconds = 3) {
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
  } else if (kind === "pink") {
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
  ctx = null;
  nodes = [];
  timerId = null;
  lullabyTimer = null;
  playing = null;

  ensureContext() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new Ctx();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  stop() {
    this.nodes.forEach((n) => {
      try {
        n.stop?.();
        n.disconnect?.();
      } catch {
        // nodo ya detenido
      }
    });
    this.nodes = [];
    if (this.lullabyTimer) {
      clearInterval(this.lullabyTimer);
      this.lullabyTimer = null;
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.playing = null;
  }

  setSleepTimer(minutes) {
    if (this.timerId) clearTimeout(this.timerId);
    if (minutes && minutes > 0) {
      this.timerId = setTimeout(() => this.stop(), minutes * 60000);
    }
  }

  play(type) {
    this.stop();
    const ctx = this.ensureContext();
    const master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    this.nodes.push(master);

    if (type === "white" || type === "brown" || type === "pink") {
      const kind = type === "white" ? "white" : type === "brown" ? "brown" : "pink";
      const buffer = makeNoiseBuffer(ctx, kind);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(master);
      source.start();
      this.nodes.push(source);
    } else if (type === "ocean") {
      const buffer = makeNoiseBuffer(ctx, "brown");
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 700;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(master.gain);
      source.connect(filter);
      filter.connect(master);
      source.start();
      lfo.start();
      this.nodes.push(source, filter, lfo, lfoGain);
    } else if (type === "shhh") {
      const buffer = makeNoiseBuffer(ctx, "white");
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 3500;
      filter.Q.value = 0.6;
      source.connect(filter);
      filter.connect(master);
      source.start();
      this.nodes.push(source, filter);
    } else if (type === "lullaby") {
      let step = 0;
      const playNote = () => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = LULLABY_NOTES[step % LULLABY_NOTES.length];
        noteGain.gain.setValueAtTime(0, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.08);
        noteGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.55);
        osc.connect(noteGain);
        noteGain.connect(master);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
        step += 1;
      };
      playNote();
      this.lullabyTimer = setInterval(playNote, 650);
    }

    this.playing = type;
  }
}

export const soundEngine = new SoundEngine();

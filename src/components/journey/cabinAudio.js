const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

const CHORD_SECONDS = 4;
const VOLUME = 0.22;

// Small generative ambient engine: a soft pad per chord plus a sparse arpeggio.
class CabinAudio {
  ctx = null;
  master = null;
  timer = null;
  track = null;
  step = 0;
  muted = false;
  startedAt = 0;

  ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1600;
    filter.Q.value = 0.4;
    this.master.connect(filter).connect(this.ctx.destination);
  }

  get playing() {
    return this.timer !== null;
  }

  get elapsed() {
    return this.playing ? this.ctx.currentTime - this.startedAt : 0;
  }

  play(track) {
    this.ensure();
    this.ctx.resume();
    this.stopLoop();
    this.track = track;
    this.step = 0;
    this.startedAt = this.ctx.currentTime;
    this.fadeTo(this.muted ? 0 : VOLUME, 0.6);
    this.scheduleChord(this.ctx.currentTime + 0.05);
    this.timer = setInterval(
      () => this.scheduleChord(this.ctx.currentTime + 0.05),
      CHORD_SECONDS * 1000
    );
  }

  pause() {
    if (!this.ctx) return;
    this.fadeTo(0, 0.4);
    this.stopLoop();
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.ctx && this.playing) this.fadeTo(muted ? 0 : VOLUME, 0.25);
  }

  // Low thump for the passport stamps; silent unless music is audible.
  thunk() {
    if (!this.ctx || !this.playing || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.9, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  fadeTo(value, seconds) {
    const g = this.master.gain;
    const t = this.ctx.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(value, t + seconds);
  }

  stopLoop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  scheduleChord(t) {
    const chord = this.track.chords[this.step % this.track.chords.length];
    this.step += 1;

    chord.forEach((note, i) => {
      [-4, 4].forEach((detune) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = midiToHz(note);
        osc.detune.value = detune;
        const peak = (i === 0 ? 0.16 : 0.07) / 2;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(peak, t + 1.4);
        gain.gain.setValueAtTime(peak, t + CHORD_SECONDS - 0.6);
        gain.gain.linearRampToValueAtTime(0.0001, t + CHORD_SECONDS + 1.2);
        osc.connect(gain).connect(this.master);
        osc.start(t);
        osc.stop(t + CHORD_SECONDS + 1.3);
      });
    });

    const pattern = [1, 2, 3, 2, 3, 1, 2, 3];
    pattern.forEach((idx, k) => {
      if (k % 2 === 1 && Math.random() < 0.35) return;
      const start = t + k * (CHORD_SECONDS / pattern.length);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = midiToHz(chord[idx] + 12);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.05, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(gain).connect(this.master);
      osc.start(start);
      osc.stop(start + 1);
    });
  }
}

export const cabinAudio = new CabinAudio();

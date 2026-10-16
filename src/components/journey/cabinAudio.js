// Quiet stamp sound for the passport. Only plays while the cabin playlist is on.
class CabinAudio {
  ctx = null;
  muted = false;
  live = false;

  ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
  }

  setPlaying(live) {
    this.live = live;
  }

  setMuted(muted) {
    this.muted = muted;
  }

  thunk() {
    if (!this.live || this.muted) return;
    this.ensure();
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
}

export const cabinAudio = new CabinAudio();

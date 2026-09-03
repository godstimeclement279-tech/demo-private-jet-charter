// Subtle luxury sound effects synthesized via Web Audio API

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      this.playVIPChime();
      this.startAmbientCabinHum();
    } else {
      this.stopAmbientCabinHum();
    }
    return !this.isMuted;
  }

  public getMutedStatus(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playVIPChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Luxurious 2-tone aircraft cabin chime with subtle warm harmonic overtone
    const playTone = (freq: number, startTime: number, duration: number) => {
      if (!this.ctx) return;
      
      // Fundamental
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.06, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      // Subtle 2nd harmonic for warm acoustic bell resonance
      const oscHarmonic = this.ctx.createOscillator();
      const gainHarmonic = this.ctx.createGain();
      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);
      gainHarmonic.gain.setValueAtTime(0.015, startTime);
      gainHarmonic.gain.exponentialRampToValueAtTime(0.00001, startTime + duration * 0.7);

      oscHarmonic.connect(gainHarmonic);
      gainHarmonic.connect(this.ctx.destination);

      osc.start(startTime);
      oscHarmonic.start(startTime);
      osc.stop(startTime + duration);
      oscHarmonic.stop(startTime + duration);
    };

    const now = this.ctx.currentTime;
    playTone(659.25, now, 1.2); // E5
    playTone(523.25, now + 0.35, 1.5); // C5
  }

  private startAmbientCabinHum() {
    if (!this.ctx) return;
    try {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      }

      // Very subtle deep pink-noise/low-frequency jet turbine hum
      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'triangle';
      this.engineOsc.frequency.setValueAtTime(62, this.ctx.currentTime); // Low rumble

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.012, this.ctx.currentTime);

      this.engineOsc.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch {
      // Audio context handling
    }
  }

  private stopAmbientCabinHum() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        if (this.engineOsc) {
          try {
            this.engineOsc.stop();
            this.engineOsc.disconnect();
          } catch {
            // safely ignore
          }
          this.engineOsc = null;
        }
      }, 600);
    }
  }
}

export const audioService = new AudioManager();

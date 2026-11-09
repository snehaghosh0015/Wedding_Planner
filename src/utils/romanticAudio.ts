/**
 * Romantic Acoustic Soundscape Synthesizer
 * Uses native Web Audio API to generate delicate classical guitar arpeggios
 * Zero external audio file dependencies, perfectly resilient in any browser.
 */

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let sequenceTimer: any = null;
let currentVolume = 0.3;

const ARPEGGIO_NOTES = [
  // D major / B minor romantic chord sequence
  293.66, // D4
  369.99, // F#4
  440.00, // A4
  587.33, // D5
  440.00, // A4
  369.99, // F#4
  246.94, // B3
  293.66, // D4
  369.99, // F#4
  440.00, // A4
  369.99, // F#4
  293.66, // D4
  196.00, // G3
  246.94, // B3
  293.66, // D4
  392.00, // G4
  293.66, // D4
  246.94, // B3
  220.00, // A3
  277.18, // C#4
  329.63, // E4
  440.00, // A4
  329.63, // E4
  277.18, // C#4
];

function playAcousticPluck(freq: number, ctx: AudioContext, gainNode: GainNode) {
  const osc = ctx.createOscillator();
  const pluckGain = ctx.createGain();

  // Warm triangle wave for nylon guitar tone
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Pluck attack & decay
  pluckGain.gain.setValueAtTime(0.001, ctx.currentTime);
  pluckGain.gain.exponentialRampToValueAtTime(0.18 * currentVolume, ctx.currentTime + 0.03);
  pluckGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);

  // Lowpass filter to emulate warm wooden acoustic guitar body
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 1.2);

  osc.connect(filter);
  filter.connect(pluckGain);
  pluckGain.connect(gainNode);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.7);
}

export function startRomanticSoundscape(onUpdate?: (playing: boolean) => void) {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    isPlaying = true;
    onUpdate?.(true);

    let noteIdx = 0;
    const playNext = () => {
      if (!isPlaying || !audioCtx) return;
      const freq = ARPEGGIO_NOTES[noteIdx % ARPEGGIO_NOTES.length];
      playAcousticPluck(freq, audioCtx, masterGain);
      noteIdx++;
      sequenceTimer = setTimeout(playNext, 460); // ~65 bpm relaxing romantic tempo
    };

    playNext();
  } catch (err) {
    console.error('Romantic soundscape could not start', err);
    isPlaying = false;
    onUpdate?.(false);
  }
}

export function stopRomanticSoundscape(onUpdate?: (playing: boolean) => void) {
  isPlaying = false;
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
  onUpdate?.(false);
}

export function toggleRomanticSoundscape(onUpdate?: (playing: boolean) => void): boolean {
  if (isPlaying) {
    stopRomanticSoundscape(onUpdate);
    return false;
  } else {
    startRomanticSoundscape(onUpdate);
    return true;
  }
}

export function setSoundscapeVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol));
}

export function isSoundscapePlaying(): boolean {
  return isPlaying;
}

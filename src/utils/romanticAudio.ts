/**
 * Romantic Acoustic Soundscape & Wedding Song Synthesizer
 * Uses native Web Audio API to play distinct, rich, classical melodies
 * Zero external audio file dependencies — instant, reliable playback in any browser.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let activeSongId: string | null = null;
let currentTimer: any = null;
let currentVolume = 0.35;
let globalListener: ((playing: boolean, songId: string | null) => void) | null = null;

// Distinct acoustic melody notes (frequencies in Hz)
export interface SongTrack {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  notes: number[];
  intervalMs: number;
}

export const ROMANTIC_SONGS: SongTrack[] = [
  {
    id: 'por-una-cabeza',
    title: 'Por Una Cabeza',
    subtitle: 'Carlos Gardel · Ceremony Processional',
    vibe: 'Dramatic Argentine tango played on acoustic strings',
    // D Minor / D Major dramatic lyrical melody notes
    notes: [
      293.66, 369.99, 440.00, 587.33, 554.37, 587.33, 440.00, 369.99,
      293.66, 329.63, 369.99, 440.00, 369.99, 329.63, 293.66, 277.18,
      293.66, 369.99, 440.00, 587.33, 659.25, 587.33, 554.37, 440.00,
      369.99, 392.00, 440.00, 493.88, 440.00, 369.99, 329.63, 293.66
    ],
    intervalMs: 380,
  },
  {
    id: 'clair-de-lune',
    title: 'Clair de Lune',
    subtitle: 'Claude Debussy · Sunset First Dance',
    vibe: 'Impressionist piano & nylon guitar falling arpeggio',
    // Db major / gentle cascading harmonies
    notes: [
      349.23, 415.30, 523.25, 622.25, 698.46, 622.25, 523.25, 415.30,
      311.13, 392.00, 466.16, 622.25, 466.16, 392.00, 311.13, 261.63,
      329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63, 261.63,
      277.18, 349.23, 415.30, 554.37, 415.30, 349.23, 277.18, 220.00
    ],
    intervalMs: 460,
  },
  {
    id: 'la-vie-en-rose',
    title: 'La Vie En Rose',
    subtitle: 'Édith Piaf · Tuscan Courtyard Aperitivo',
    vibe: 'Romantic Parisian waltz in gentle 3/4 acoustic tempo',
    // C Major / G7 warm Parisian cadence
    notes: [
      261.63, 329.63, 392.00, 523.25, 493.88, 440.00, 392.00, 329.63,
      293.66, 349.23, 440.00, 493.88, 440.00, 392.00, 349.23, 293.66,
      261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63, 246.94,
      261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 196.00
    ],
    intervalMs: 410,
  },
  {
    id: 'cant-help-falling',
    title: 'Can’t Help Falling in Love',
    subtitle: 'Weiss & Creatore · Lantern Light Sendoff',
    vibe: 'Timeless folk ballad with rich descending chord plucks',
    // D Major / B Minor romantic progression
    notes: [
      293.66, 369.99, 440.00, 587.33, 440.00, 369.99,
      246.94, 293.66, 369.99, 440.00, 369.99, 293.66,
      196.00, 246.94, 293.66, 392.00, 293.66, 246.94,
      220.00, 277.18, 329.63, 440.00, 329.63, 277.18
    ],
    intervalMs: 440,
  },
];

function initAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playAcousticNote(freq: number, ctx: AudioContext, gainNode: GainNode) {
  const osc = ctx.createOscillator();
  const pluckGain = ctx.createGain();

  // Warm triangle wave for nylon guitar tone
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Pluck attack & decay envelope
  pluckGain.gain.setValueAtTime(0.001, ctx.currentTime);
  pluckGain.gain.exponentialRampToValueAtTime(0.24 * currentVolume, ctx.currentTime + 0.025);
  pluckGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

  // Lowpass filter for warm wooden acoustic resonance
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1500, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 1.3);

  osc.connect(filter);
  filter.connect(pluckGain);
  pluckGain.connect(gainNode);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 1.85);
}

export function playSongMelody(songId: string, onUpdate?: (playing: boolean, songId: string | null) => void) {
  try {
    const ctx = initAudioContext();
    if (!masterGain) return;

    if (onUpdate) globalListener = onUpdate;

    // If already playing this exact song, toggle it off
    if (isPlaying && activeSongId === songId) {
      stopRomanticSoundscape(onUpdate);
      return;
    }

    // Stop current sequence if running
    if (currentTimer) {
      clearTimeout(currentTimer);
      currentTimer = null;
    }

    const track = ROMANTIC_SONGS.find((s) => s.id === songId) || ROMANTIC_SONGS[0];
    isPlaying = true;
    activeSongId = track.id;

    globalListener?.(true, track.id);
    onUpdate?.(true, track.id);

    let noteIdx = 0;
    const playNext = () => {
      if (!isPlaying || !audioCtx || !masterGain) return;
      const freq = track.notes[noteIdx % track.notes.length];
      playAcousticNote(freq, audioCtx, masterGain);
      noteIdx++;
      currentTimer = setTimeout(playNext, track.intervalMs);
    };

    playNext();
  } catch (err) {
    console.error('Romantic melody error:', err);
    isPlaying = false;
    activeSongId = null;
    globalListener?.(false, null);
    onUpdate?.(false, null);
  }
}

export function startRomanticSoundscape(onUpdate?: (playing: boolean, songId: string | null) => void) {
  playSongMelody('clair-de-lune', onUpdate);
}

export function stopRomanticSoundscape(onUpdate?: (playing: boolean, songId: string | null) => void) {
  isPlaying = false;
  activeSongId = null;
  if (currentTimer) {
    clearTimeout(currentTimer);
    currentTimer = null;
  }
  globalListener?.(false, null);
  onUpdate?.(false, null);
}

export function toggleRomanticSoundscape(onUpdate?: (playing: boolean, songId: string | null) => void): boolean {
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
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
  }
}

export function isSoundscapePlaying(): boolean {
  return isPlaying;
}

export function getActiveSongId(): string | null {
  return activeSongId;
}

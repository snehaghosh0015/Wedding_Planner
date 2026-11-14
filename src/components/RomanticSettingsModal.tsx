import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Music, 
  Volume2, 
  Flame, 
  Feather, 
  Disc, 
  Check, 
  Play, 
  Square,
  Radio,
  Sliders
} from 'lucide-react';
import { 
  isSoundscapePlaying, 
  toggleRomanticSoundscape, 
  setSoundscapeVolume,
  playSongMelody,
  stopRomanticSoundscape,
  getActiveSongId,
  ROMANTIC_SONGS
} from '../utils/romanticAudio';
import { OliveBranchFlourish } from './RomanticFlourish';

export type AmbianceLighting = 'candlelit' | 'goldenHour' | 'sunlit';
export type WaxSealChoice = 'crimson' | 'gold' | 'olive';

interface RomanticSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ambiance: AmbianceLighting;
  onChangeAmbiance: (mode: AmbianceLighting) => void;
  waxSeal: WaxSealChoice;
  onChangeWaxSeal: (seal: WaxSealChoice) => void;
  vowsExcerpt: string;
  onSaveVows?: (newVows: string) => void;
  isCouple: boolean;
}

export const RomanticSettingsModal: React.FC<RomanticSettingsModalProps> = ({
  isOpen,
  onClose,
  ambiance,
  onChangeAmbiance,
  waxSeal,
  onChangeWaxSeal,
  vowsExcerpt,
  onSaveVows,
  isCouple,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(isSoundscapePlaying());
  const [currentSongId, setCurrentSongId] = useState<string | null>(getActiveSongId());
  const [volume, setVolume] = useState(0.35);
  const [activeTab, setActiveTab] = useState<'ambiance' | 'vows' | 'playlist'>('playlist');
  const [editingVows, setEditingVows] = useState(vowsExcerpt);
  const [isSavedToast, setIsSavedToast] = useState(false);

  useEffect(() => {
    setIsPlayingMusic(isSoundscapePlaying());
    setCurrentSongId(getActiveSongId());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrackClick = (songId: string) => {
    playSongMelody(songId, (playing, activeId) => {
      setIsPlayingMusic(playing);
      setCurrentSongId(activeId);
    });
  };

  const handleStopAll = () => {
    stopRomanticSoundscape((playing, activeId) => {
      setIsPlayingMusic(playing);
      setCurrentSongId(activeId);
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setSoundscapeVolume(val);
  };

  const handleSaveVowsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveVows?.(editingVows);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const activeTrack = ROMANTIC_SONGS.find((s) => s.id === currentSongId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950 via-stone-900 to-amber-950 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-300" />
              <span className="text-[11px] font-mono tracking-widest text-amber-200 uppercase font-semibold">
                Classic Romance & Atmosphere
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-white mt-1.5 font-bold">
            Wedding Ambiance & Classic Settings
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Curate candlelit warmth, authentic acoustic melodies, and the couple’s heirloom vows.
          </p>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/15">
            <button
              onClick={() => setActiveTab('playlist')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'playlist'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Disc className="w-3.5 h-3.5 text-rose-600" />
              <span>Romantic Playlist</span>
              {isPlayingMusic && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ambiance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'ambiance'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Atmosphere & Lighting
            </button>
            <button
              onClick={() => setActiveTab('vows')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'vows'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Vows & Love Letter
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-900">
          {/* TAB 1: ROMANTIC PLAYLIST */}
          {activeTab === 'playlist' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-wider uppercase text-rose-800 font-bold">
                    Now Playing
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-900 mt-0.5">
                    {isPlayingMusic && activeTrack ? activeTrack.title : 'Courtyard Melody Paused'}
                  </h4>
                  <p className="text-xs text-stone-500">
                    {isPlayingMusic && activeTrack
                      ? activeTrack.subtitle
                      : 'Click any song below to play its authentic acoustic melody.'}
                  </p>
                </div>

                {isPlayingMusic && (
                  <button
                    onClick={handleStopAll}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Music</span>
                  </button>
                )}
              </div>

              {/* Volume Slider */}
              <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-xs flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-stone-600 shrink-0" />
                <span className="text-xs font-medium text-stone-700 shrink-0">Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-rose-700 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-stone-600 font-semibold w-10 text-right">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              {/* High-Legibility Song Cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono uppercase tracking-wider text-rose-900 font-bold block">
                  Select A Song To Play Melody
                </label>

                {ROMANTIC_SONGS.map((track, i) => {
                  const isCurrent = isPlayingMusic && currentSongId === track.id;
                  return (
                    <div
                      key={track.id}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                            isCurrent
                              ? 'bg-rose-700 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          0{i + 1}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-serif font-bold text-stone-900 truncate">
                            {track.title}
                          </h4>
                          <p className="text-xs text-stone-600 truncate">
                            {track.subtitle}
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                            {track.vibe}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTrackClick(track.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-rose-700 text-white shadow-xs hover:bg-rose-800'
                            : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xs'
                        }`}
                        aria-label={`Play ${track.title}`}
                      >
                        {isCurrent ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Melody</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-stone-800 text-xs">
                <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Instant Acoustic Audio
                </p>
                <p className="mt-0.5 text-stone-700 leading-relaxed text-[11px]">
                  All song melodies are synthesized live via the Web Audio API with realistic nylon-guitar plucks and reverb resonance. Zero network loading delay.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: AMBIANCE & LIGHTING */}
          {activeTab === 'ambiance' && (
            <div className="space-y-6">
              {/* Ambiance Lighting Mode */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-rose-800 font-semibold block">
                  1. Lighting & Visual Warmth
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangeAmbiance('candlelit')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      ambiance === 'candlelit'
                        ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-600" /> Candlelit Evening
                      </span>
                      {ambiance === 'candlelit' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Warm candle flicker, soft amber glow, and twilight romance.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeAmbiance('goldenHour')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      ambiance === 'goldenHour'
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Golden Hour
                      </span>
                      {ambiance === 'goldenHour' && <Check className="w-3.5 h-3.5 text-rose-600" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Radiant sunset highlights over Chianti vineyards.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeAmbiance('sunlit')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      ambiance === 'sunlit'
                        ? 'border-stone-800 bg-stone-100 ring-2 ring-stone-800/10 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif font-bold text-stone-900">
                        Sunlit Tuscan Day
                      </span>
                      {ambiance === 'sunlit' && <Check className="w-3.5 h-3.5 text-stone-800" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
                      Crisp Florentine linen and soft natural daylight.
                    </p>
                  </button>
                </div>
              </div>

              {/* Classic Monogram & Wax Seal Choice */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-rose-800 font-semibold block">
                  2. Official Wax Seal & Monogram
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onChangeWaxSeal('crimson')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      waxSeal === 'crimson'
                        ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-600/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-full overflow-hidden shadow-xs border border-rose-200">
                      <img
                        src="/src/assets/images/vintage_wax_seal_crest_1794235743246.jpg"
                        alt="Crimson Wax Seal"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[11px] font-serif font-bold text-stone-900 mt-1.5 block">
                      Florentine Crimson
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeWaxSeal('gold')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      waxSeal === 'gold'
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-600/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-amber-950 flex items-center justify-center font-serif font-bold text-xs shadow-xs border border-amber-300">
                      E&J
                    </div>
                    <span className="text-[11px] font-serif font-bold text-stone-900 mt-1.5 block">
                      Gilded Gold
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeWaxSeal('olive')}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      waxSeal === 'olive'
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-br from-stone-700 to-emerald-950 text-emerald-100 flex items-center justify-center font-serif font-bold text-xs shadow-xs border border-emerald-300">
                      Tuscan Olive
                    </div>
                    <span className="text-[11px] font-serif font-bold text-stone-900 mt-1.5 block">
                      Tuscan Olive
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOWS & LOVE LETTER */}
          {activeTab === 'vows' && (
            <div className="space-y-4">
              <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-md relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-rose-800" />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-rose-800 font-semibold">
                      Heirloom Vows Excerpt
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm border border-amber-200">
                    <img
                      src="/src/assets/images/vintage_wax_seal_crest_1794235743246.jpg"
                      alt="Wax seal stamp"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="py-5 text-center space-y-2">
                  <OliveBranchFlourish className="mx-auto w-36 h-6 text-rose-800/70" />
                  <p className="font-serif italic text-stone-900 text-base sm:text-lg leading-relaxed px-2 font-medium">
                    &ldquo;{editingVows}&rdquo;
                  </p>
                  <p className="text-xs font-serif text-rose-950 font-semibold pt-2">
                    — Elena Vance & Julian Hayes · Villa La Selva
                  </p>
                </div>

                {isCouple && (
                  <form onSubmit={handleSaveVowsSubmit} className="pt-3 border-t border-amber-200/50 space-y-2">
                    <label className="text-xs font-semibold text-stone-800 block">
                      Couple Admin: Edit Vows & Love Letter Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={editingVows}
                      onChange={(e) => setEditingVows(e.target.value)}
                      className="w-full p-2.5 text-xs border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-stone-900"
                    />
                    <div className="flex items-center justify-between pt-1">
                      {isSavedToast ? (
                        <span className="text-xs text-emerald-700 font-semibold">
                          Vows updated successfully ✓
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-600">
                          Appears on official stationery and wedding program
                        </span>
                      )}
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
                      >
                        Save Vows
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-600">
            {isPlayingMusic && activeTrack ? (
              <span className="flex items-center gap-1.5 text-rose-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                Playing {activeTrack.title}
              </span>
            ) : (
              <span>Soundscape paused</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

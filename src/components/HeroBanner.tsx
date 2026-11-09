import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Sparkles, Heart } from 'lucide-react';
import { UserRole } from '../types/wedding';

interface HeroBannerProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  weddingDateStr: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentRole,
  onSwitchRole,
  weddingDateStr,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(weddingDateStr).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  return (
    <div className="relative rounded-3xl overflow-hidden bg-stone-900 border border-stone-200/90 shadow-md">
      {/* Background Hero Image */}
      <div className="relative min-h-[460px] sm:min-h-[400px] md:h-[440px] w-full flex flex-col justify-between p-4 sm:p-6">
        <img
          src="/src/assets/images/hero_wedding_couple_1794230266576.jpg"
          alt="Elena & Julian Tuscan Wedding"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

        {/* Top Badges: Role switcher floating pill */}
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="self-start flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs border border-white/20">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span className="font-serif tracking-wide">E & J · September 18, 2027</span>
          </div>

          {/* Interactive Role Switcher Pill */}
          <div className="self-start sm:self-auto flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs">
            <button
              onClick={() => onSwitchRole('Couple')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'Couple'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Couple Mode (Admin)
            </button>
            <button
              onClick={() => onSwitchRole('Guest')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                currentRole === 'Guest'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Guest Mode (Viewer)
            </button>
          </div>
        </div>

        {/* Hero Title & Countdown Details */}
        <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-5 text-white pt-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-rose-300 uppercase font-semibold">
              Celebrating The Marriage Of
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif tracking-tight text-white leading-tight">
              Elena Vance & Julian Hayes
            </h1>
            <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-1.5 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Villa La Selva Estate · Tuscany, Italy</span>
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="self-start md:self-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 sm:p-3.5 flex items-center gap-2.5 sm:gap-4 shrink-0 text-center">
            <div>
              <span className="text-lg sm:text-2xl font-serif font-bold text-white block tabular-nums">
                {timeLeft.days}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-rose-200">
                Days
              </span>
            </div>
            <span className="text-white/40 text-sm font-serif">·</span>
            <div>
              <span className="text-lg sm:text-2xl font-serif font-bold text-white block tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-rose-200">
                Hours
              </span>
            </div>
            <span className="text-white/40 text-sm font-serif">·</span>
            <div>
              <span className="text-lg sm:text-2xl font-serif font-bold text-white block tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-rose-200">
                Mins
              </span>
            </div>
            <span className="text-white/40 text-sm font-serif">·</span>
            <div>
              <span className="text-lg sm:text-2xl font-serif font-bold text-white block tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-rose-200">
                Secs
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

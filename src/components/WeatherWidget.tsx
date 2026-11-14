import React, { useState } from 'react';
import { 
  Sun, 
  CloudSun, 
  Wind, 
  Droplets, 
  Sunset, 
  Sparkles, 
  MapPin, 
  Thermometer, 
  ShieldCheck 
} from 'lucide-react';

interface WeatherWidgetProps {
  locationName?: string;
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  locationName = 'Villa La Selva, Tuscany',
  className = '',
}) => {
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  // Weather data in Celsius
  const currentTempC = 24;
  const currentTempF = Math.round((currentTempC * 9) / 5 + 32);

  const forecast = [
    { day: 'Friday (Rehearsal)', tempC: 25, condition: 'Sunny & Warm', icon: Sun, pop: '0%' },
    { day: 'Saturday (Wedding Day)', tempC: 24, condition: 'Golden Tuscan Breeze', icon: CloudSun, pop: '5%' },
    { day: 'Sunday (Farewell Brunch)', tempC: 23, condition: 'Partly Cloudy', icon: CloudSun, pop: '10%' },
  ];

  return (
    <div className={`bg-gradient-to-br from-amber-50/70 via-white to-rose-50/40 rounded-3xl p-5 border border-amber-200/80 shadow-xs space-y-4 ${className}`}>
      {/* Top row */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sun className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-semibold block">
              Tuscan Microclimate Forecast
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-700 font-semibold">
              <MapPin className="w-3 h-3 text-rose-600" />
              <span>{locationName}</span>
            </div>
          </div>
        </div>

        {/* Unit switch */}
        <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setUnit('C')}
            className={`px-2 py-1 rounded-md transition-all ${
              unit === 'C' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-2 py-1 rounded-md transition-all ${
              unit === 'F' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            °F
          </button>
        </div>
      </div>

      {/* Main weather banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tabular-nums">
            {unit === 'C' ? `${currentTempC}°C` : `${currentTempF}°F`}
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-800">
              Sunny & Golden
            </p>
            <p className="text-xs text-stone-500">
              Ideal conditions for outdoor garden ceremony & terrace banquet
            </p>
          </div>
        </div>

        {/* Golden hour & sunset metric pills */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
              <Sparkles className="w-3 h-3" /> Golden Hour
            </div>
            <p className="font-mono font-bold text-stone-800 mt-0.5">6:42 PM</p>
          </div>
          <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
            <div className="flex items-center gap-1 text-[11px] text-rose-700 font-medium">
              <Sunset className="w-3 h-3" /> Sunset
            </div>
            <p className="font-mono font-bold text-stone-800 mt-0.5">7:18 PM</p>
          </div>
        </div>
      </div>

      {/* Secondary metrics grid */}
      <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 text-center">
          <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px]">
            <Droplets className="w-3 h-3 text-cyan-500" /> Humidity
          </div>
          <p className="font-mono font-semibold text-stone-800 mt-0.5">45%</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 text-center">
          <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px]">
            <Wind className="w-3 h-3 text-emerald-500" /> Wind
          </div>
          <p className="font-mono font-semibold text-stone-800 mt-0.5">9 km/h</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-stone-200/70 text-center">
          <div className="flex items-center justify-center gap-1 text-stone-400 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-rose-500" /> Rain Risk
          </div>
          <p className="font-mono font-semibold text-stone-800 mt-0.5">0% (Dry)</p>
        </div>
      </div>

      {/* 3-day weekend preview */}
      <div className="pt-2 border-t border-amber-100">
        <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-2">
          Wedding Weekend Outlook
        </p>
        <div className="space-y-1.5">
          {forecast.map((f, i) => {
            const Icon = f.icon;
            const temp = unit === 'C' ? `${f.tempC}°C` : `${Math.round((f.tempC * 9) / 5 + 32)}°F`;
            return (
              <div key={i} className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white/60">
                <span className="font-medium text-stone-800 w-44">{f.day}</span>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                  <span>{f.condition}</span>
                </div>
                <span className="font-mono font-semibold text-stone-900">{temp}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

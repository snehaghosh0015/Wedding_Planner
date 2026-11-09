import React, { useState } from 'react';
import { 
  Palmtree, 
  Compass, 
  DollarSign, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Plane, 
  Hotel, 
  Heart,
  Sliders
} from 'lucide-react';
import { HoneymoonDestination, HoneymoonVibe } from '../types/wedding';
import { matchHoneymoonDestinations } from '../utils/honeymoon';

interface HoneymoonMatchmakerProps {
  destinations: HoneymoonDestination[];
  remainingBudget: number;
}

export const HoneymoonMatchmaker: React.FC<HoneymoonMatchmakerProps> = ({
  destinations,
  remainingBudget,
}) => {
  const [budgetCap, setBudgetCap] = useState<number>(remainingBudget > 0 ? remainingBudget : 15000);
  const [selectedVibes, setSelectedVibes] = useState<HoneymoonVibe[]>([
    'Beach',
    'Gastronomy',
    'Romantic Hideaway',
  ]);

  const allVibes: HoneymoonVibe[] = [
    'Beach',
    'Mountains',
    'Cultural',
    'Romantic Hideaway',
    'Adventure',
    'Gastronomy',
  ];

  const toggleVibe = (vibe: HoneymoonVibe) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const matches = matchHoneymoonDestinations(budgetCap, selectedVibes, destinations);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Post-Wedding Escape
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Honeymoon Matchmaker
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Algorithmically curate your dream getaway matched against your remaining wedding fund and desired travel vibes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono self-start sm:self-auto bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          <span>Synced with Live Budget Remaining: ${remainingBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Control Panel: Budget Slider & Vibe Selectors */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget Range Controller */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-rose-600" />
                Allocated Honeymoon Budget Cap
              </label>
              <span className="text-lg font-serif font-bold text-stone-900 tabular-nums">
                ${budgetCap.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="5000"
              max="25000"
              step="500"
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-stone-400 font-mono">
              <span>$5,000 (Chic Cozy)</span>
              <span>$15,000 (Luxury Boutique)</span>
              <span>$25,000+ (Ultra Grand)</span>
            </div>
          </div>

          {/* Vibe Chips Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              Desired Travel Vibes & Atmospheres
            </label>
            <div className="flex flex-wrap gap-2">
              {allVibes.map((vibe) => {
                const isActive = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    onClick={() => toggleVibe(vibe)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-rose-900 text-white shadow-xs scale-102'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Matches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong>{matches.length} curated destinations</strong> ranked by compatibility
          </span>
          <span className="font-mono text-[11px]">
            {selectedVibes.length} vibes selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((res) => {
            const { destination, suitabilityScore, budgetFit, varianceAmount, matchingVibes } = res;
            const isSurplus = varianceAmount >= 0;

            return (
              <article
                key={destination.id}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Photo & Scrim */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Compatibility Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-stone-900 shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{suitabilityScore}% Match</span>
                  </div>

                  {/* Destination Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-rose-300 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{destination.country}</span>
                    </div>
                    <h3 className="text-xl font-serif text-white mt-0.5">
                      {destination.name}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {destination.tagline}
                  </p>

                  {/* Vibe Tags as Clean Unboxed Editorial Typography */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                    <span className="text-[11px] font-mono text-stone-400">Vibes:</span>
                    {destination.vibes.map((v, i) => {
                      const isMatched = matchingVibes.includes(v);
                      return (
                        <React.Fragment key={v}>
                          <span
                            className={
                              isMatched
                                ? 'font-semibold text-rose-900 underline decoration-rose-300 underline-offset-2'
                                : 'text-stone-500'
                            }
                          >
                            {v}
                          </span>
                          {i < destination.vibes.length - 1 && (
                            <span className="text-stone-300">·</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Cost Breakdown Accordion */}
                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200/60 font-semibold text-stone-900">
                      <span>Total Estimated Cost</span>
                      <span className="font-serif text-base tabular-nums">
                        ${destination.estimatedCostTotal.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-600">
                      <div>
                        <span className="block text-stone-400">Flights (x2)</span>
                        <span className="font-semibold text-stone-800">
                          ${destination.costBreakdown.flights.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-stone-400">Luxury Stay</span>
                        <span className="font-semibold text-stone-800">
                          ${(destination.costBreakdown.luxuryStayPerNight * destination.costBreakdown.nights).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-stone-400">Dining/Tours</span>
                        <span className="font-semibold text-stone-800">
                          ${destination.costBreakdown.activitiesAndDining.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-stone-500">Budget Variance:</span>
                      <span
                        className={`font-semibold font-mono ${
                          isSurplus ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isSurplus
                          ? `+$${varianceAmount.toLocaleString()} surplus`
                          : `-$${Math.abs(varianceAmount).toLocaleString()} stretch`}
                      </span>
                    </div>
                  </div>

                  {/* Romantic Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-stone-800 block">
                      Curated Highlights:
                    </span>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {destination.romanticHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Heart className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Best Season */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Prime Season: {destination.bestSeason}
                    </span>
                    <span className="font-serif font-bold text-stone-800">
                      ★ {destination.rating}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

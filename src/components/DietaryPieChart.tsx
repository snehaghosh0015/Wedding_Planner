import React, { useMemo, useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Utensils, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Guest, DietaryOption } from '../types/wedding';

interface DietaryPieChartProps {
  guests: Guest[];
  onSelectDietaryFilter?: (dietary: DietaryOption | 'All') => void;
  selectedFilter?: DietaryOption | 'All';
}

interface DietaryDatum {
  dietary: DietaryOption;
  label: string;
  count: number;
  percentage: number;
  color: string;
  guestNames: string[];
}

const DIETARY_META: Record<DietaryOption, { label: string; color: string; description: string }> = {
  'None': {
    label: 'Standard Tuscan Banquet',
    color: '#9A7B56', // Warm Tuscan Ochre
    description: 'Traditional Bistecca, Handmade Pasta & Seasonal Antipasti',
  },
  'Vegetarian': {
    label: 'Vegetarian',
    color: '#2E7D32', // Tuscan Olive Green
    description: 'Fresh Truffle Risotto, Porcini & Grilled Vegetables',
  },
  'Vegan': {
    label: 'Vegan',
    color: '#059669', // Emerald Herb
    description: 'Plant-Based Ribollita & Heirloom Vegetable Medley',
  },
  'Gluten-Free': {
    label: 'Gluten-Free',
    color: '#D97706', // Sunlit Amber
    description: 'Certified GF Polenta & Chestnut Flour Specialties',
  },
  'Halal': {
    label: 'Halal',
    color: '#2563EB', // Sapphire Blue
    description: 'Certified Halal Prepared Lamb & Herb Roast',
  },
  'Kosher': {
    label: 'Kosher Box',
    color: '#7C3AED', // Deep Royal Violet
    description: 'Glatt Kosher Sealed Meal from Certified Florence Kitchen',
  },
  'Nut Allergy': {
    label: 'Nut Allergy (Strict)',
    color: '#DC2626', // Crimson Alert
    description: 'Nut-Free Kitchen Prep & Isolated Plating',
  },
};

export const DietaryPieChart: React.FC<DietaryPieChartProps> = ({
  guests,
  onSelectDietaryFilter,
  selectedFilter = 'All',
}) => {
  const [hoveredDietary, setHoveredDietary] = useState<DietaryOption | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute breakdown strictly among CONFIRMED guests and their attending plus-ones
  const { chartData, totalConfirmedMeals, confirmedAttendeesCount } = useMemo(() => {
    const counts: Record<DietaryOption, { count: number; guests: string[] }> = {
      'None': { count: 0, guests: [] },
      'Vegetarian': { count: 0, guests: [] },
      'Vegan': { count: 0, guests: [] },
      'Gluten-Free': { count: 0, guests: [] },
      'Halal': { count: 0, guests: [] },
      'Kosher': { count: 0, guests: [] },
      'Nut Allergy': { count: 0, guests: [] },
    };

    let totalMeals = 0;
    let attendees = 0;

    guests.forEach((g) => {
      if (g.status === 'Confirmed') {
        attendees += 1;
        totalMeals += 1;
        const diet = g.dietary || 'None';
        counts[diet].count += 1;
        counts[diet].guests.push(g.name);

        if (g.hasPlusOne && g.plusOneName) {
          attendees += 1;
          totalMeals += 1;
          const plusDiet = g.plusOneDietary || 'None';
          counts[plusDiet].count += 1;
          counts[plusDiet].guests.push(`${g.plusOneName} (Guest of ${g.name})`);
        }
      }
    });

    const data: DietaryDatum[] = (Object.keys(counts) as DietaryOption[])
      .map((key) => {
        const count = counts[key].count;
        return {
          dietary: key,
          label: DIETARY_META[key].label,
          count,
          percentage: totalMeals > 0 ? Math.round((count / totalMeals) * 100) : 0,
          color: DIETARY_META[key].color,
          guestNames: counts[key].guests,
        };
      })
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);

    return {
      chartData: data,
      totalConfirmedMeals: totalMeals,
      confirmedAttendeesCount: attendees,
    };
  }, [guests]);

  // Dimension constants for D3 pie chart
  const width = 260;
  const height = 260;
  const radius = Math.min(width, height) / 2 - 12;
  const innerRadius = radius * 0.58; // Modern Tuscan Donut Style

  // D3 Pie & Arc generators
  const arcs = useMemo(() => {
    const pieGenerator = d3
      .pie<DietaryDatum>()
      .value((d) => d.count)
      .sort(null)
      .padAngle(0.025);

    return pieGenerator(chartData);
  }, [chartData]);

  const arcGenerator = useMemo(() => {
    return d3
      .arc<d3.PieArcDatum<DietaryDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4);
  }, [innerRadius, radius]);

  const hoveredArcGenerator = useMemo(() => {
    return d3
      .arc<d3.PieArcDatum<DietaryDatum>>()
      .innerRadius(innerRadius - 2)
      .outerRadius(radius + 6)
      .cornerRadius(5);
  }, [innerRadius, radius]);

  const activeFocusItem = hoveredDietary
    ? chartData.find((d) => d.dietary === hoveredDietary)
    : null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
      {/* Header with Title and Catering Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center shrink-0">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">
              Dietary Requirements Breakdown (D3 Visualization)
            </h3>
            <p className="text-xs text-stone-500">
              Catering distribution among all {totalConfirmedMeals} confirmed banquet attendees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{totalConfirmedMeals} Confirmed Meals</span>
          </span>
          {selectedFilter && selectedFilter !== 'All' && (
            <button
              onClick={() => onSelectDietaryFilter?.('All')}
              className="text-xs text-rose-700 hover:text-rose-800 underline font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {totalConfirmedMeals === 0 ? (
        <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-2">
          <Info className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-sm font-serif font-bold text-stone-700">
            No Confirmed RSVPs Yet
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            As guests confirm attendance through the RSVP form above, their dietary selections and plus-one requirements will chart automatically here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* D3 Pie Chart Canvas Column (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="relative w-[260px] h-[260px]">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible select-none drop-shadow-xs"
              >
                <g transform={`translate(${width / 2}, ${height / 2})`}>
                  {arcs.map((arcData, i) => {
                    const isHovered = hoveredDietary === arcData.data.dietary;
                    const isFilterSelected = selectedFilter === arcData.data.dietary;
                    const isDimmed =
                      (hoveredDietary && !isHovered) ||
                      (selectedFilter !== 'All' && !isFilterSelected);

                    const pathD = isHovered
                      ? hoveredArcGenerator(arcData) || undefined
                      : arcGenerator(arcData) || undefined;

                    return (
                      <g
                        key={arcData.data.dietary}
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredDietary(arcData.data.dietary)}
                        onMouseLeave={() => setHoveredDietary(null)}
                        onClick={() => {
                          if (onSelectDietaryFilter) {
                            onSelectDietaryFilter(
                              selectedFilter === arcData.data.dietary
                                ? 'All'
                                : arcData.data.dietary
                            );
                          }
                        }}
                      >
                        <path
                          d={pathD}
                          fill={arcData.data.color}
                          opacity={isDimmed ? 0.35 : 1}
                          stroke="#ffffff"
                          strokeWidth={isHovered ? 2.5 : 1.5}
                          className="transition-all duration-150"
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                {activeFocusItem ? (
                  <>
                    <span
                      className="w-3 h-3 rounded-full mb-1"
                      style={{ backgroundColor: activeFocusItem.color }}
                    />
                    <span className="text-2xl font-serif font-bold text-stone-900 leading-tight">
                      {activeFocusItem.percentage}%
                    </span>
                    <span className="text-[11px] font-mono text-stone-600 font-semibold truncate max-w-[120px]">
                      {activeFocusItem.count} {activeFocusItem.count === 1 ? 'Plate' : 'Plates'}
                    </span>
                    <span className="text-[10px] text-stone-500 truncate max-w-[120px]">
                      {activeFocusItem.dietary}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 font-bold">
                      Catering
                    </span>
                    <span className="text-2xl font-serif font-bold text-stone-900 leading-tight">
                      {totalConfirmedMeals}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Confirmed Meals
                    </span>
                    <span className="text-[9px] text-stone-400 mt-0.5">
                      Hover Slices
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-[11px] text-stone-400 font-mono text-center mt-2">
              D3.js SVG Visualization · Interactive Slices
            </p>
          </div>

          {/* Detailed Legend & Catering Specification Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-semibold uppercase font-mono tracking-wider text-[11px] text-stone-700">
                Dietary Category Distribution
              </span>
              <span className="text-[11px] text-stone-500">
                Click category to filter guest list
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {chartData.map((d) => {
                const isHovered = hoveredDietary === d.dietary;
                const isSelected = selectedFilter === d.dietary;
                const meta = DIETARY_META[d.dietary];

                return (
                  <div
                    key={d.dietary}
                    onMouseEnter={() => setHoveredDietary(d.dietary)}
                    onMouseLeave={() => setHoveredDietary(null)}
                    onClick={() => {
                      if (onSelectDietaryFilter) {
                        onSelectDietaryFilter(isSelected ? 'All' : d.dietary);
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-600/20 shadow-xs'
                        : isHovered
                        ? 'border-stone-400 bg-stone-50/90 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: d.color }}
                        />
                        <span className="text-xs font-serif font-bold text-stone-900 truncate">
                          {d.dietary}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-serif font-bold text-stone-900 tabular-nums">
                          {d.count}
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {d.percentage}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1 leading-snug">
                      {meta.description}
                    </p>

                    {/* Guest attendees tooltip on hover */}
                    {isHovered && d.guestNames.length > 0 && (
                      <div className="mt-2 pt-1.5 border-t border-stone-200/60 text-[10px] text-stone-600 font-mono">
                        <span className="font-semibold text-stone-800">Guests: </span>
                        {d.guestNames.slice(0, 3).join(', ')}
                        {d.guestNames.length > 3 && ` +${d.guestNames.length - 3} more`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chef / Catering Kitchen Notice */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-stone-800 font-semibold">
                  Villa La Selva Kitchen Coordination:
                </strong>{' '}
                Executive Chef Lorenzo prepares separate segregated prep stations for Halal, Kosher boxed catering, and severe Nut Allergies.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

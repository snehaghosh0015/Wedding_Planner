import React from 'react';
import { 
  X, 
  Globe, 
  Coins, 
  Clock, 
  Languages, 
  Plane, 
  Compass, 
  MapPin, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { 
  CURRENCIES, 
  SupportedCurrency, 
  SupportedTimezone, 
  SupportedLanguage, 
  GLOBAL_TIMEZONES, 
  LANGUAGE_OPTIONS,
  convertTimeCET
} from '../utils/globalization';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: SupportedCurrency;
  onChangeCurrency: (c: SupportedCurrency) => void;
  timezone: SupportedTimezone;
  onChangeTimezone: (tz: SupportedTimezone) => void;
  language: SupportedLanguage;
  onChangeLanguage: (l: SupportedLanguage) => void;
}

export const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({
  isOpen,
  onClose,
  currency,
  onChangeCurrency,
  timezone,
  onChangeTimezone,
  language,
  onChangeLanguage,
}) => {
  const [activeTab, setActiveTab] = React.useState<'currency' | 'timezone' | 'language' | 'travel'>('currency');

  if (!isOpen) return null;

  const sampleUSD = 1000;
  const currentTzInfo = GLOBAL_TIMEZONES.find((t) => t.id === timezone) || GLOBAL_TIMEZONES[0];
  const ceremonyTimeInTz = convertTimeCET('4:30 PM', timezone);
  const dinnerTimeInTz = convertTimeCET('7:00 PM', timezone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full border border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-300" />
              <span className="text-[11px] font-mono tracking-widest text-amber-200 uppercase font-semibold">
                Global Destination Settings
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif text-white mt-1.5 font-bold">
            International Guests & Currency
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Personalize your wedding experience with native currency, local timezone, and multi-language support.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/15 overflow-x-auto">
            <button
              onClick={() => setActiveTab('currency')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeTab === 'currency'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Currency ({currency})</span>
            </button>
            <button
              onClick={() => setActiveTab('timezone')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeTab === 'timezone'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>Timezone</span>
            </button>
            <button
              onClick={() => setActiveTab('language')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeTab === 'language'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>Language</span>
            </button>
            <button
              onClick={() => setActiveTab('travel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                activeTab === 'travel'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-sky-400" />
              <span>Tuscany Travel Guide</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-900">
          {/* TAB 1: CURRENCY */}
          {activeTab === 'currency' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  Select Preferred Display Currency
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Converts the Wedding Budget, Honeymoon Matchmaker, and gifts in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(CURRENCIES).map((curr) => {
                  const isSelected = currency === curr.code;
                  const convertedPreview = Math.round(sampleUSD * curr.rateAgainstUSD);
                  return (
                    <button
                      key={curr.code}
                      onClick={() => onChangeCurrency(curr.code)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm ${
                            isSelected
                              ? 'bg-rose-700 text-white'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {curr.symbol}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-900">
                            {curr.name} ({curr.code})
                          </p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            $1,000 USD ≈ {curr.symbol}{convertedPreview.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-rose-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-stone-700">
                <span className="font-semibold text-amber-950 block">Multi-Currency Global Ready:</span>
                Tuscan vendors invoice primarily in Euro (€). The app automatically converts your wedding budget expenses and Honeymoon trip calculations so you can track expenses in your home currency.
              </div>
            </div>
          )}

          {/* TAB 2: TIMEZONE */}
          {activeTab === 'timezone' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  Select Guest Local Timezone
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  View the ceremony, aperitivo, and formal dinner times converted to your local time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {GLOBAL_TIMEZONES.map((tz) => {
                  const isSelected = timezone === tz.id;
                  const convertedCeremony = convertTimeCET('4:30 PM', tz.id);
                  return (
                    <button
                      key={tz.id}
                      onClick={() => onChangeTimezone(tz.id as SupportedTimezone)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 shadow-xs'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-stone-900">{tz.city}</p>
                        <p className="text-[11px] text-stone-500 font-mono">{tz.label}</p>
                        <p className="text-[11px] text-rose-900 font-semibold mt-1">
                          Ceremony: {convertedCeremony}
                        </p>
                      </div>

                      {isSelected && <Check className="w-4 h-4 text-rose-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Time comparison card */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-bold">
                    Schedule Comparison
                  </span>
                  <span className="text-xs font-serif font-semibold text-rose-900">
                    {currentTzInfo.city} ({currentTzInfo.label})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Ceremony</span>
                    <span className="font-bold text-stone-900">4:30 PM CET</span>
                    <span className="text-[11px] text-rose-700 block font-mono font-semibold">
                      → {ceremonyTimeInTz}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Formal Dinner</span>
                    <span className="font-bold text-stone-900">7:00 PM CET</span>
                    <span className="text-[11px] text-rose-700 block font-mono font-semibold">
                      → {dinnerTimeInTz}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  Select Application Language
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Translates primary navigation, invitation details, and wedding logistics.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => onChangeLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 shadow-xs'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{lang.flag}</span>
                      <p className="text-xs font-bold text-stone-900">{lang.label}</p>
                      <p className="text-[10px] text-stone-500 font-mono uppercase mt-0.5">
                        {lang.code}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TUSCANY TRAVEL GUIDE */}
          {activeTab === 'travel' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-stone-900">
                  International Guest Concierge & Travel Tips
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Everything international attendees need for a smooth journey to Castelnuovo Berardenga.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Plane className="w-4 h-4 text-rose-700" />
                    <span>Recommended Arrival Airports</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 text-xs text-stone-600 pl-6 list-disc">
                    <li>
                      <strong className="text-stone-900">Florence Peretola (FLR):</strong> 1 hr 10 min drive to Villa La Selva. Closest for European connections.
                    </li>
                    <li>
                      <strong className="text-stone-900">Pisa International (PSA):</strong> 1 hr 45 min drive. Direct flights from UK & continental hubs.
                    </li>
                    <li>
                      <strong className="text-stone-900">Rome Fiumicino (FCO):</strong> High-speed Frecciarossa train from Rome to Florence SMN takes only 1 hr 35 min.
                    </li>
                  </ul>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>Electricity & Plugs in Italy</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Italy operates on <strong>230V / 50Hz</strong> with European Type C and Type L grounded plugs. Universal plug adapters are provided in all Villa guest rooms.
                  </p>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                    <MapPin className="w-4 h-4 text-emerald-700" />
                    <span>Estate Shuttles & Transport</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Private chartered Mercedes coaches depart Florence Grand Hotel at <strong>3:15 PM</strong> and <strong>3:45 PM</strong>. Return shuttles run every 45 minutes back to Florence starting at 11:00 PM.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-600 font-mono">
            Active: {currency} · {currentTzInfo.label} · {language.toUpperCase()}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors shadow-xs"
          >
            Apply Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Globe, QrCode, Sparkles } from 'lucide-react';
import { UserRole } from '../types/wedding';
import { 
  SupportedCurrency, 
  SupportedLanguage, 
  TRANSLATIONS,
  CURRENCIES 
} from '../utils/globalization';

interface HeaderProps {
  currentRole: UserRole;
  currentUserName: string;
  onOpenAuthModal: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenRomanticSettings: () => void;
  onOpenGlobalSettings?: () => void;
  onOpenWeddingCard?: () => void;
  isCandlelit: boolean;
  currency?: SupportedCurrency;
  language?: SupportedLanguage;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUserName,
  onOpenAuthModal,
  activeTab,
  onSelectTab,
  onOpenRomanticSettings,
  onOpenGlobalSettings,
  onOpenWeddingCard,
  isCandlelit,
  currency = 'EUR',
  language = 'en',
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.EUR;

  const navItems = [
    { id: 'timeline', label: t.story || 'Story' },
    { id: 'album', label: t.album || 'Live Album' },
    { id: 'logistics', label: t.rsvp || 'RSVP' },
    { id: 'seating', label: t.seating || 'Seating' },
    ...(currentRole === 'Couple' ? [{ id: 'budget', label: t.budget || 'Budget' }] : []),
    { id: 'assistant', label: t.concierge || 'Concierge' },
    { id: 'honeymoon', label: t.honeymoon || 'Honeymoon' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark with wax crest */}
        <button
          onClick={() => onSelectTab('timeline')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs border border-amber-200 shrink-0">
            <img
              src="/src/assets/images/vintage_wax_seal_crest_1794235743246.jpg"
              alt="E & J Wax Seal"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-serif tracking-tight text-stone-900 group-hover:text-rose-800 transition-colors">
              EverAfter
            </span>
            <span className="hidden sm:inline font-mono text-[11px] text-stone-400 ml-2">
              Elena & Julian
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === item.id
                  ? 'border-rose-600 text-stone-900'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Action cluster */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Printable Wedding Card & QR Scanner */}
          {onOpenWeddingCard && (
            <button
              onClick={onOpenWeddingCard}
              title="Print Wedding Invitation Card & QR Scanner"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-all shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-rose-800" />
              <span>Wedding Card</span>
            </button>
          )}

          {/* Global Destination Settings (Currency, Timezone, Language) */}
          {onOpenGlobalSettings && (
            <button
              onClick={onOpenGlobalSettings}
              title="Global Currency, Timezone & Language"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold transition-all shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-rose-700" />
              <span className="font-mono text-[11px] font-bold">{currencyInfo.code}</span>
            </button>
          )}

          {/* Romantic Settings & Ambiance Trigger */}
          <button
            onClick={onOpenRomanticSettings}
            title="Wedding Ambiance & Classic Settings"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isCandlelit 
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs ring-1 ring-amber-400/30'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <span className="text-sm">🕯️</span>
            <span className="hidden sm:inline">Ambiance</span>
          </button>

          {/* Role / Profile badge */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all text-xs font-medium text-stone-800 whitespace-nowrap shrink-0"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                currentRole === 'Couple' ? 'bg-rose-600' : 'bg-amber-600'
              }`}
            />
            <span className="max-w-28 sm:max-w-36 truncate font-semibold">
              {currentUserName}
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              ({currentRole})
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

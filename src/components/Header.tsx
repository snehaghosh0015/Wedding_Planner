import React from 'react';
import { UserRole } from '../types/wedding';

interface HeaderProps {
  currentRole: UserRole;
  currentUserName: string;
  onOpenAuthModal: () => void;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  currentUserName,
  onOpenAuthModal,
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    { id: 'timeline', label: 'Story' },
    { id: 'album', label: 'Live Album' },
    { id: 'logistics', label: 'RSVP' },
    { id: 'budget', label: 'Budget' },
    { id: 'assistant', label: 'Concierge' },
    { id: 'honeymoon', label: 'Honeymoon' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('timeline')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-serif tracking-tight text-stone-900 group-hover:text-rose-800 transition-colors">
            EverAfter
          </span>
          <span className="hidden sm:inline font-mono text-[11px] text-stone-400 ml-2">
            Elena & Julian
          </span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
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

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
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

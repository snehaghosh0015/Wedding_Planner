import React from 'react';
import { 
  Heart, 
  Camera, 
  CalendarCheck, 
  DollarSign, 
  Bot, 
  Palmtree 
} from 'lucide-react';
import { UserRole } from '../types/wedding';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  userRole: UserRole;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  userRole,
}) => {
  const tabs = [
    { id: 'timeline', label: 'Story', icon: Heart },
    { id: 'album', label: 'Album', icon: Camera },
    { id: 'logistics', label: 'RSVP', icon: CalendarCheck },
    ...(userRole === 'Couple' ? [{ id: 'budget', label: 'Budget', icon: DollarSign }] : []),
    { id: 'assistant', label: 'AI Concierge', icon: Bot },
    { id: 'honeymoon', label: 'Honeymoon', icon: Palmtree },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg pb-safe">
      <div className="flex items-center justify-around h-15 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              data-testid={`mobile-nav-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 focus:outline-none transition-colors ${
                isActive ? 'text-rose-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-14">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

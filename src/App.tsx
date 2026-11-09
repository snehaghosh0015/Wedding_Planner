import React, { useState } from 'react';
import { 
  Heart, 
  Camera, 
  CalendarCheck, 
  DollarSign, 
  Bot, 
  Palmtree 
} from 'lucide-react';
import { 
  UserRole, 
  StoryMilestone, 
  AlbumPhoto, 
  StoryMoment, 
  Guest, 
  Expense, 
  RsvpStatus, 
  DietaryOption 
} from './types/wedding';
import { 
  INITIAL_WEDDING_DETAILS, 
  INITIAL_STORY_MILESTONES, 
  INITIAL_STORIES, 
  INITIAL_ALBUM_PHOTOS, 
  INITIAL_GUESTS, 
  INITIAL_EXPENSES, 
  INITIAL_HONEYMOON_DESTINATIONS 
} from './data/weddingData';
import { calculateRsvpStats } from './utils/rsvp';
import { calculateBudgetMetrics } from './utils/budget';

import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { StorylineTimeline } from './components/StorylineTimeline';
import { LiveWeddingAlbum } from './components/LiveWeddingAlbum';
import { LogisticsAndRsvp } from './components/LogisticsAndRsvp';
import { BudgetTracker } from './components/BudgetTracker';
import { AiWeddingAssistant } from './components/AiWeddingAssistant';
import { HoneymoonMatchmaker } from './components/HoneymoonMatchmaker';
import { StoryViewerModal } from './components/StoryViewerModal';
import { AuthRoleModal } from './components/AuthRoleModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  RomanticSettingsModal, 
  AmbianceLighting, 
  WaxSealChoice 
} from './components/RomanticSettingsModal';

export default function App() {
  // Navigation & Role States
  const [currentRole, setCurrentRole] = useState<UserRole>('Couple');
  const [currentUserName, setCurrentUserName] = useState<string>('Elena & Julian');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('elena.julian@wedding.com');
  const [activeTab, setActiveTab] = useState<string>('timeline');

  // Romantic Settings & Ambiance States
  const [isRomanticSettingsOpen, setIsRomanticSettingsOpen] = useState(false);
  const [ambiance, setAmbiance] = useState<AmbianceLighting>('candlelit');
  const [waxSeal, setWaxSeal] = useState<WaxSealChoice>('crimson');
  const [vowsExcerpt, setVowsExcerpt] = useState<string>(
    INITIAL_WEDDING_DETAILS.couple.vowsExcerpt ||
    'I choose you today and all our tomorrows, through Florentine rainstorms, starry Tuscan hills, and every quiet morning in between.'
  );

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState<number | null>(null);

  // Applet Data States
  const [milestones, setMilestones] = useState<StoryMilestone[]>(INITIAL_STORY_MILESTONES);
  const [photos, setPhotos] = useState<AlbumPhoto[]>(INITIAL_ALBUM_PHOTOS);
  const [stories, setStories] = useState<StoryMoment[]>(INITIAL_STORIES);
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [totalBudget, setTotalBudget] = useState<number>(75000);

  // Context Metrics for Assistant & Honeymoon
  const rsvpStats = calculateRsvpStats(guests);
  const budgetStats = calculateBudgetMetrics(totalBudget, expenses);

  // Handlers
  const handleRoleSwitch = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'Couple') {
      setCurrentUserName('Elena & Julian');
      setCurrentUserEmail('elena.julian@wedding.com');
    } else {
      setCurrentUserName('Sofia Rossi');
      setCurrentUserEmail('sofia.rossi@example.com');
    }
  };

  const handleSelectCustomProfile = (role: UserRole, name: string, email: string) => {
    setCurrentRole(role);
    setCurrentUserName(name);
    setCurrentUserEmail(email);
  };

  const handleAddMilestone = (m: StoryMilestone) => {
    setMilestones((prev) => [m, ...prev]);
  };

  const handleUploadPhoto = (p: AlbumPhoto) => {
    setPhotos((prev) => [p, ...prev]);
  };

  const handlePostStory = (s: StoryMoment) => {
    setStories((prev) => [s, ...prev]);
  };

  const handleToggleLike = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleUpdateGuestStatus = (
    guestId: string, 
    status: RsvpStatus, 
    plusOneName?: string, 
    dietary?: DietaryOption
  ) => {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id === guestId) {
          return {
            ...g,
            status,
            plusOneName: plusOneName !== undefined ? plusOneName : g.plusOneName,
            dietary: dietary !== undefined ? dietary : g.dietary,
            updatedAt: new Date().toISOString().split('T')[0],
          };
        }
        return g;
      })
    );
  };

  const handleAddGuest = (g: Guest) => {
    setGuests((prev) => [g, ...prev]);
  };

  const handleUpdateTotalBudget = (newBudget: number) => {
    setTotalBudget(newBudget);
  };

  const handleAddExpense = (e: Expense) => {
    setExpenses((prev) => [e, ...prev]);
  };

  const handleToggleExpensePaid = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id === expenseId) {
          const isNowPaid = !exp.isPaid;
          return {
            ...exp,
            isPaid: isNowPaid,
            paidAmount: isNowPaid ? exp.actualCost : 0,
          };
        }
        return exp;
      })
    );
  };

  return (
    <div 
      className={`min-h-screen flex flex-col justify-between font-sans selection:bg-rose-100 selection:text-rose-900 pb-20 lg:pb-8 transition-colors duration-500 ${
        ambiance === 'candlelit'
          ? 'bg-[#FAF8F5] text-stone-800'
          : ambiance === 'goldenHour'
          ? 'bg-[#FDF9F3] text-stone-800'
          : 'bg-stone-50 text-stone-800'
      }`}
    >
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        currentUserName={currentUserName}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenRomanticSettings={() => setIsRomanticSettingsOpen(true)}
        isCandlelit={ambiance === 'candlelit'}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-8">
        {/* Hero Banner with Countdown, Wax Seal Monogram & Role Switcher */}
        <HeroBanner
          currentRole={currentRole}
          onSwitchRole={handleRoleSwitch}
          weddingDateStr={INITIAL_WEDDING_DETAILS.date}
          waxSealUrl={
            waxSeal === 'crimson'
              ? '/src/assets/images/vintage_wax_seal_crest_1794235743246.jpg'
              : undefined
          }
          onOpenRomanticSettings={() => setIsRomanticSettingsOpen(true)}
        />

        <div className="space-y-8">
          {/* Desktop Navigation Segmented Bar */}
          <div className="hidden lg:flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-2">
              {[
                { id: 'timeline', label: 'Our Story Timeline', icon: Heart },
                { id: 'album', label: 'Live Album & 24h Stories', icon: Camera },
                { id: 'logistics', label: 'Logistics & RSVP', icon: CalendarCheck },
                ...(currentRole === 'Couple'
                  ? [{ id: 'budget', label: 'Budget Tracker', icon: DollarSign }]
                  : []),
                { id: 'assistant', label: 'AI Wedding Assistant', icon: Bot },
                { id: 'honeymoon', label: 'Honeymoon Matchmaker', icon: Palmtree },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Module Container */}
          <div className="transition-opacity duration-200">
            {activeTab === 'timeline' && (
              <StorylineTimeline
                milestones={milestones}
                userRole={currentRole}
                onAddMilestone={handleAddMilestone}
              />
            )}

            {activeTab === 'album' && (
              <LiveWeddingAlbum
                photos={photos}
                stories={stories}
                userRole={currentRole}
                userName={currentUserName}
                onOpenStory={(idx) => setStoryViewerIndex(idx)}
                onUploadPhoto={handleUploadPhoto}
                onPostStory={handlePostStory}
                onToggleLike={handleToggleLike}
              />
            )}

            {activeTab === 'logistics' && (
              <LogisticsAndRsvp
                weddingDetails={INITIAL_WEDDING_DETAILS}
                guests={guests}
                userRole={currentRole}
                currentGuestName={currentUserName}
                onUpdateGuestStatus={handleUpdateGuestStatus}
                onAddGuest={handleAddGuest}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetTracker
                expenses={expenses}
                totalBudget={totalBudget}
                userRole={currentRole}
                onUpdateTotalBudget={handleUpdateTotalBudget}
                onAddExpense={handleAddExpense}
                onToggleExpensePaid={handleToggleExpensePaid}
              />
            )}

            {activeTab === 'assistant' && (
              <AiWeddingAssistant
                userRole={currentRole}
                weddingContext={{
                  rsvpStats,
                  budgetStats: {
                    total: budgetStats.totalBudget,
                    spent: budgetStats.totalActual,
                    remaining: budgetStats.totalRemainingBalance,
                  },
                }}
              />
            )}

            {activeTab === 'honeymoon' && (
              <HoneymoonMatchmaker
                destinations={INITIAL_HONEYMOON_DESTINATIONS}
                remainingBudget={budgetStats.totalRemainingBalance}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-serif text-stone-800 text-sm">
            EverAfter — Elena Vance & Julian Hayes
          </p>
          <p className="text-stone-400 text-[11px]">
            Villa La Selva Estate, Tuscany · September 18, 2027
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (Ergonomic Thumb Zone) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userRole={currentRole}
      />

      {/* 24h Story Viewer Modal */}
      {storyViewerIndex !== null && (
        <StoryViewerModal
          stories={stories}
          initialIndex={storyViewerIndex}
          onClose={() => setStoryViewerIndex(null)}
          onLikeStory={() => {}}
        />
      )}

      {/* Authentication & Role Switcher Modal */}
      {isAuthModalOpen && (
        <AuthRoleModal
          currentRole={currentRole}
          currentUserName={currentUserName}
          onSelectRole={handleSelectCustomProfile}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {/* Romantic Settings & Ambiance Modal */}
      <RomanticSettingsModal
        isOpen={isRomanticSettingsOpen}
        onClose={() => setIsRomanticSettingsOpen(false)}
        ambiance={ambiance}
        onChangeAmbiance={setAmbiance}
        waxSeal={waxSeal}
        onChangeWaxSeal={setWaxSeal}
        vowsExcerpt={vowsExcerpt}
        onSaveVows={(newVows) => setVowsExcerpt(newVows)}
        isCouple={currentRole === 'Couple'}
      />
    </div>
  );
}

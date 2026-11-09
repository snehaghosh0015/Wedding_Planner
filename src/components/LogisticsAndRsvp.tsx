import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Compass, 
  Car, 
  Bus, 
  Search, 
  UserPlus, 
  Check, 
  X, 
  Filter, 
  Utensils, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Guest, RsvpStatus, DietaryOption, UserRole } from '../types/wedding';
import { calculateRsvpStats, filterGuests } from '../utils/rsvp';

interface LogisticsAndRsvpProps {
  weddingDetails: any;
  guests: Guest[];
  userRole: UserRole;
  currentGuestName: string;
  onUpdateGuestStatus: (guestId: string, status: RsvpStatus, plusOneName?: string, dietary?: DietaryOption) => void;
  onAddGuest: (guest: Guest) => void;
}

export const LogisticsAndRsvp: React.FC<LogisticsAndRsvpProps> = ({
  weddingDetails,
  guests,
  userRole,
  currentGuestName,
  onUpdateGuestStatus,
  onAddGuest,
}) => {
  const [activeTab, setActiveTab] = useState<'rsvp' | 'logistics'>('rsvp');
  const [statusFilter, setStatusFilter] = useState<'All' | RsvpStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);

  // New guest modal state
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestDietary, setNewGuestDietary] = useState<DietaryOption>('None');
  const [newGuestHasPlusOne, setNewGuestHasPlusOne] = useState(false);

  // Guest self-RSVP state
  const currentGuest = guests.find(
    (g) => g.name.toLowerCase() === currentGuestName.toLowerCase()
  ) || guests[0];

  const [selfAttending, setSelfAttending] = useState<RsvpStatus>(
    currentGuest?.status || 'Confirmed'
  );
  const [selfDietary, setSelfDietary] = useState<DietaryOption>(
    currentGuest?.dietary || 'None'
  );
  const [selfPlusOneName, setSelfPlusOneName] = useState(
    currentGuest?.plusOneName || ''
  );
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const stats = calculateRsvpStats(guests);
  const filteredList = filterGuests(guests, statusFilter, searchQuery);

  const handleSelfRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuest) {
      onUpdateGuestStatus(
        currentGuest.id, 
        selfAttending, 
        selfPlusOneName, 
        selfDietary
      );
      setRsvpSubmitted(true);
      setTimeout(() => setRsvpSubmitted(false), 4000);
    }
  };

  const handleAddNewGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !newGuestEmail.trim()) return;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: newGuestName.trim(),
      email: newGuestEmail.trim(),
      status: 'Pending',
      tableNumber: 5,
      dietary: newGuestDietary,
      hasPlusOne: newGuestHasPlusOne,
      plusOneName: newGuestHasPlusOne ? 'Guest of ' + newGuestName : undefined,
      attendingCeremony: false,
      attendingReception: false,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onAddGuest(newGuest);
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestDietary('None');
    setNewGuestHasPlusOne(false);
    setIsAddGuestOpen(false);
  };

  return (
    <section className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Event Coordination
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Logistics & RSVP Dashboard
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Venue coordinates, arrival navigation, and dynamic guest confirmation tracking.
          </p>
        </div>

        {/* Segmented View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'rsvp'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Guest RSVP Tracker
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'logistics'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Venue & Map Logistics
          </button>
        </div>
      </div>

      {activeTab === 'rsvp' ? (
        <div className="space-y-6">
          {/* Guest RSVP Submission Box (Highlighted for current Guest role) */}
          <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50/40 rounded-3xl p-5 sm:p-6 border border-rose-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
              <div>
                <span className="text-[11px] font-mono uppercase text-rose-700 tracking-wider font-semibold">
                  Personal RSVP Response
                </span>
                <h3 className="text-lg font-serif text-stone-900 mt-0.5">
                  Confirm Attendance: {currentGuest?.name || currentGuestName}
                </h3>
              </div>

              {currentGuest && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-stone-500">Current Status:</span>
                  <span
                    className={`font-semibold ${
                      currentGuest.status === 'Confirmed'
                        ? 'text-emerald-700'
                        : currentGuest.status === 'Declined'
                        ? 'text-rose-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {currentGuest.status}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSelfRsvpSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* RSVP Choice Buttons */}
                <button
                  type="button"
                  onClick={() => setSelfAttending('Confirmed')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selfAttending === 'Confirmed'
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-emerald-900 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Joyfully Accept
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Attending both ceremony & evening celebration
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelfAttending('Pending')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selfAttending === 'Pending'
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Still Deciding
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Awaiting travel or schedule confirmation
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelfAttending('Declined')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selfAttending === 'Declined'
                      ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-semibold text-rose-900 flex items-center gap-1">
                    <X className="w-3.5 h-3.5 text-rose-600" /> Regretfully Decline
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Sending love from afar
                  </p>
                </button>
              </div>

              {selfAttending === 'Confirmed' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Dietary Preferences
                    </label>
                    <select
                      value={selfDietary}
                      onChange={(e) => setSelfDietary(e.target.value as DietaryOption)}
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    >
                      <option value="None">Standard Tuscan Banquet</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                      <option value="Halal">Halal</option>
                      <option value="Kosher">Kosher Box</option>
                      <option value="Nut Allergy">Nut Allergy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Plus-One Guest Full Name (If Invited)
                    </label>
                    <input
                      type="text"
                      value={selfPlusOneName}
                      onChange={(e) => setSelfPlusOneName(e.target.value)}
                      placeholder="e.g. Marco Rossi"
                      className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500">
                  RSVP deadline: August 1, 2027
                </span>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-xs transition-colors"
                >
                  {rsvpSubmitted ? 'RSVP Recorded ✓' : 'Save RSVP Response'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 block">Total Invited</span>
              <span className="text-2xl font-serif text-stone-900 mt-1 block tabular-nums">
                {stats.invited}
              </span>
              <span className="text-[11px] text-stone-400 mt-1 block">
                {stats.totalAttendees} total seats including plus-ones
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-emerald-700 block">Confirmed</span>
              <span className="text-2xl font-serif text-emerald-800 mt-1 block tabular-nums">
                {stats.confirmed}
              </span>
              <span className="text-[11px] text-emerald-600 mt-1 block">
                {stats.confirmationRate}% attendance rate
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-amber-700 block">Pending</span>
              <span className="text-2xl font-serif text-amber-800 mt-1 block tabular-nums">
                {stats.pending}
              </span>
              <span className="text-[11px] text-amber-600 mt-1 block">
                Follow-up reminder sent
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 block">Declined</span>
              <span className="text-2xl font-serif text-stone-600 mt-1 block tabular-nums">
                {stats.declined}
              </span>
              <span className="text-[11px] text-stone-400 mt-1 block">
                {stats.invited - stats.confirmed - stats.pending} responses
              </span>
            </div>
          </div>

          {/* Guest List Management Table */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif text-stone-900">
                  Guest Directory
                </h3>
                <span className="text-xs text-stone-500">
                  ({filteredList.length} of {guests.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest or plus-one..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {userRole === 'Couple' && (
                  <button
                    onClick={() => setIsAddGuestOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Guest</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex items-center gap-1 overflow-x-auto text-xs">
              {(['All', 'Confirmed', 'Pending', 'Declined'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-200/60'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-stone-100 overflow-x-auto">
              {filteredList.map((guest) => (
                <div
                  key={guest.id}
                  className="p-4 hover:bg-stone-50/70 transition-colors flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center font-semibold text-xs shrink-0">
                      {guest.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-stone-900 truncate">
                        {guest.name}
                      </p>
                      <p className="text-stone-500 truncate text-[11px]">
                        {guest.email}
                      </p>
                      {guest.hasPlusOne && guest.plusOneName && (
                        <p className="text-[11px] text-rose-800 truncate mt-0.5">
                          +1: {guest.plusOneName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Dietary */}
                    <div className="hidden sm:flex items-center gap-1 text-stone-600">
                      <Utensils className="w-3 h-3 text-stone-400" />
                      <span>{guest.dietary}</span>
                    </div>

                    {/* Table Assignment */}
                    {guest.tableNumber && (
                      <span className="hidden md:inline-block font-mono text-stone-500 text-[11px]">
                        Table {guest.tableNumber}
                      </span>
                    )}

                    {/* Status Pill */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        guest.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : guest.status === 'Declined'
                          ? 'bg-stone-100 text-stone-500'
                          : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                      }`}
                    >
                      {guest.status}
                    </span>

                    {/* Couple Quick Actions */}
                    {userRole === 'Couple' && (
                      <div className="flex items-center gap-1">
                        {guest.status !== 'Confirmed' && (
                          <button
                            onClick={() => onUpdateGuestStatus(guest.id, 'Confirmed')}
                            title="Mark as Confirmed"
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {guest.status !== 'Declined' && (
                          <button
                            onClick={() => onUpdateGuestStatus(guest.id, 'Declined')}
                            title="Mark as Declined"
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Logistics & Google Maps Tab */
        <div className="space-y-6">
          {/* Venue & Map Showcase Card */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative aspect-16/9 sm:aspect-21/9 bg-stone-100">
              <img
                src="/src/assets/images/venue_villa_estate_1794230269596.jpg"
                alt="Villa La Selva Estate"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest">
                  Official Wedding Venue
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-white mt-1">
                  {weddingDetails.venue.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  {weddingDetails.venue.address}
                </p>
              </div>
            </div>

            {/* Logistics Details Grid */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Interactive Schedule & Directions */}
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-rose-600" /> Day-of Itinerary
                  </h4>
                  <div className="mt-3 divide-y divide-stone-100 border border-stone-200/80 rounded-2xl overflow-hidden">
                    {weddingDetails.schedule.map((item: any, i: number) => (
                      <div key={i} className="p-3 flex items-start justify-between text-xs bg-white">
                        <span className="font-mono font-medium text-stone-500 w-20 shrink-0">
                          {item.time}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-stone-900">{item.event}</p>
                          <p className="text-stone-500 text-[11px]">{item.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2">
                  <h4 className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Dress Code Guidelines
                  </h4>
                  <p className="text-xs text-stone-700 font-medium">
                    {weddingDetails.venue.dressCode}
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    {weddingDetails.venue.dressCodeDetails}
                  </p>
                </div>
              </div>

              {/* Right Column: Google Maps & Transportation */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-rose-600" /> Google Maps & Navigation
                    </h4>
                    <a
                      href="https://maps.google.com/?q=Villa+La+Selva+Castelnuovo+Berardenga"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800"
                    >
                      <span>Open in Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Simulated interactive map container with live Google Maps embed */}
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-16/10 bg-stone-100">
                    <iframe
                      title="Villa La Selva Google Map"
                      src={weddingDetails.venue.mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <Car className="w-3.5 h-3.5 text-rose-600" />
                      <span>Valet Parking</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {weddingDetails.venue.parking}
                    </p>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                      <Bus className="w-3.5 h-3.5 text-rose-600" />
                      <span>Shuttle Service</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {weddingDetails.venue.shuttle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Guest Modal for Couple Admin */}
      {isAddGuestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-serif text-stone-900">Add Guest Invite</h3>
              <button
                onClick={() => setIsAddGuestOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddNewGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="e.g. Isabella Rossi"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newGuestEmail}
                  onChange={(e) => setNewGuestEmail(e.target.value)}
                  placeholder="e.g. isabella@example.com"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Dietary Note
                </label>
                <select
                  value={newGuestDietary}
                  onChange={(e) => setNewGuestDietary(e.target.value as DietaryOption)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <option value="None">None</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal</option>
                  <option value="Kosher">Kosher</option>
                  <option value="Nut Allergy">Nut Allergy</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="plusOneCheck"
                  checked={newGuestHasPlusOne}
                  onChange={(e) => setNewGuestHasPlusOne(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <label htmlFor="plusOneCheck" className="text-xs text-stone-700 font-medium">
                  Allow Plus-One Guest (+1)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGuestOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Add to Guest List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

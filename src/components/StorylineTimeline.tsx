import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Quote, Sparkles, Heart } from 'lucide-react';
import { StoryMilestone, UserRole } from '../types/wedding';

interface StorylineTimelineProps {
  milestones: StoryMilestone[];
  userRole: UserRole;
  onAddMilestone: (milestone: StoryMilestone) => void;
}

export const StorylineTimeline: React.FC<StorylineTimelineProps> = ({
  milestones,
  userRole,
  onAddMilestone,
}) => {
  const [filter, setFilter] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newQuote, setNewQuote] = useState('');

  const categories = ['All', 'Met', 'Adventure', 'The Move', 'Proposal'];

  const filteredMilestones = milestones.filter(
    (m) => filter === 'All' || m.category === filter
  );

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate.trim()) return;

    const milestone: StoryMilestone = {
      id: `m-${Date.now()}`,
      title: newTitle,
      date: newDate,
      location: newLocation || 'Tuscany, Italy',
      description: newDescription,
      quote: newQuote ? `"${newQuote}"` : undefined,
      imageUrl: '/src/assets/images/hero_wedding_couple_1794230266576.jpg',
      category: 'Adventure',
    };

    onAddMilestone(milestone);
    setNewTitle('');
    setNewDate('');
    setNewLocation('');
    setNewDescription('');
    setNewQuote('');
    setIsAddOpen(false);
  };

  return (
    <section className="space-y-6">
      {/* Header & Sub-narrative */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Interactive Timeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Our Sweet Story
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            The serendipitous journey of Elena Vance & Julian Hayes, from a rainy Florence piazza to forever.
          </p>
        </div>

        {userRole === 'Couple' && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === cat
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-10 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-rose-200">
        {filteredMilestones.map((m, idx) => (
          <div key={m.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-rose-50 border-2 border-rose-500 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Heart className="w-2.5 h-2.5 fill-current" />
            </div>

            {/* Milestone Card */}
            <article className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium text-rose-900">
                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                    {m.date}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {m.location}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-stone-400">
                  Chapter 0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-serif text-stone-900">
                  {m.title}
                </h3>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Photo Showcase */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-100 border border-stone-100">
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white/90 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">{m.location}</span>
                </div>
              </div>

              {/* Quote Block */}
              {m.quote && (
                <div className="bg-rose-50/60 rounded-xl p-3.5 border border-rose-100/70 text-xs sm:text-sm text-rose-950 italic flex items-start gap-2.5">
                  <Quote className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{m.quote}</span>
                </div>
              )}
            </article>
          </div>
        ))}
      </div>

      {/* Add Milestone Modal for Couple Admin */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-serif text-stone-900">Add Story Milestone</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. When We Said Yes"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. October 14, 2024"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Florence, Italy"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Story Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Share the memory of this unforgettable chapter..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Couple's Personal Quote (Optional)
                </label>
                <input
                  type="text"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder="e.g. It was the moment everything fell into place."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Publish to Timeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

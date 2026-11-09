import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Heart, 
  Sparkles, 
  Plus, 
  Tag, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { AlbumPhoto, StoryMoment, UserRole } from '../types/wedding';

interface LiveWeddingAlbumProps {
  photos: AlbumPhoto[];
  stories: StoryMoment[];
  userRole: UserRole;
  userName: string;
  onOpenStory: (index: number) => void;
  onUploadPhoto: (photo: AlbumPhoto) => void;
  onPostStory: (story: StoryMoment) => void;
  onToggleLike: (photoId: string) => void;
}

export const LiveWeddingAlbum: React.FC<LiveWeddingAlbumProps> = ({
  photos,
  stories,
  userRole,
  userName,
  onOpenStory,
  onUploadPhoto,
  onPostStory,
  onToggleLike,
}) => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);
  const [isStoryPostOpen, setIsStoryPostOpen] = useState(false);

  // Photo form states
  const [caption, setCaption] = useState('');
  const [selectedTag, setSelectedTag] = useState('Candid');
  const [previewImage, setPreviewImage] = useState<string>('/src/assets/images/live_album_moment_1794230269470.jpg');

  // Story form states
  const [storyText, setStoryText] = useState('');
  const [storyPreview, setStoryPreview] = useState<string>('/src/assets/images/venue_villa_estate_1794230269596.jpg');

  const tags = ['All', 'Couple', 'Portraits', 'Decor', 'Candid', 'Proposal'];

  const filteredPhotos = photos.filter(
    (p) => activeTag === 'All' || p.tags.includes(activeTag)
  );

  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const newPhoto: AlbumPhoto = {
      id: `p-${Date.now()}`,
      uploaderName: userName,
      uploaderRole: userRole,
      imageUrl: previewImage,
      caption: caption.trim(),
      timestamp: 'Just now',
      likesCount: 1,
      isLiked: true,
      tags: [selectedTag],
    };

    onUploadPhoto(newPhoto);
    setCaption('');
    setIsPhotoUploadOpen(false);
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStory: StoryMoment = {
      id: `s-${Date.now()}`,
      userName,
      userRole,
      mediaUrl: storyPreview,
      text: storyText.trim() || undefined,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      viewed: false,
    };

    onPostStory(newStory);
    setStoryText('');
    setIsStoryPostOpen(false);
  };

  return (
    <section className="space-y-6">
      {/* 24-Hour Stories Carousel Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-semibold tracking-tight text-stone-900">
              Wedding Week Stories
            </h3>
            <span className="text-[11px] text-stone-500 font-mono">
              24h Disappearing
            </span>
          </div>

          <button
            onClick={() => setIsStoryPostOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Story</span>
          </button>
        </div>

        {/* Stories Horizontal Tray */}
        <div className="flex items-center gap-4 overflow-x-auto py-2 scrollbar-none">
          {/* Add story trigger button */}
          <button
            onClick={() => setIsStoryPostOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group"
          >
            <div className="relative w-15 h-15 rounded-full border-2 border-dashed border-stone-300 hover:border-rose-400 bg-stone-50 flex items-center justify-center text-stone-500 group-hover:text-rose-600 transition-colors">
              <Camera className="w-5 h-5" />
              <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                +
              </div>
            </div>
            <span className="text-[11px] font-medium text-stone-600 truncate max-w-16">
              Your Story
            </span>
          </button>

          {/* Active 24h stories */}
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => onOpenStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 focus:outline-none group"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 group-hover:scale-105 transition-transform">
                <div className="p-0.5 bg-white rounded-full">
                  <img
                    src={story.mediaUrl}
                    alt={story.userName}
                    className="w-13 h-13 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-stone-700 truncate max-w-16">
                {story.userName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Album Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
            Shared Memory Repository
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Live Wedding Album
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Crowdsourced moments captured in high-resolution by the couple and cherished guests.
          </p>
        </div>

        <button
          onClick={() => setIsPhotoUploadOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Upload High-Res Photo</span>
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTag === tag
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry / Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map((photo) => (
          <article
            key={photo.id}
            className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-[11px] font-medium">
                <Tag className="w-3 h-3 text-rose-300" />
                <span>{photo.tags[0] || 'Moments'}</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                {photo.caption}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-stone-900">
                    {photo.uploaderName}
                  </span>
                  <span>·</span>
                  <span>{photo.timestamp}</span>
                </div>

                <button
                  onClick={() => onToggleLike(photo.id)}
                  aria-label="Like photo"
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    photo.isLiked
                      ? 'bg-rose-50 text-rose-600'
                      : 'hover:bg-stone-100 text-stone-600'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      photo.isLiked ? 'fill-current text-rose-600' : ''
                    }`}
                  />
                  <span className="font-mono tabular-nums">{photo.likesCount}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Photo Upload Modal */}
      {isPhotoUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-lg font-serif text-stone-900">Upload to Live Album</h3>
              <button
                onClick={() => setIsPhotoUploadOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handlePhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Choose Photo Sample
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    '/src/assets/images/live_album_moment_1794230269470.jpg',
                    '/src/assets/images/venue_villa_estate_1794230269596.jpg',
                    '/src/assets/images/story_proposal_moment_1794230267202.jpg',
                  ].map((imgSrc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPreviewImage(imgSrc)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        previewImage === imgSrc
                          ? 'border-rose-600 ring-2 ring-rose-600/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt="Sample"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tag Category
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                >
                  <option value="Candid">Candid</option>
                  <option value="Portraits">Portraits</option>
                  <option value="Decor">Decor</option>
                  <option value="Couple">Couple</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Caption *
                </label>
                <textarea
                  required
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share what made this moment unforgettable..."
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoUploadOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Post to Live Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Story Modal */}
      {isStoryPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600" />
                <h3 className="text-lg font-serif text-stone-900">Post 24h Story</h3>
              </div>
              <button
                onClick={() => setIsStoryPostOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Stories remain visible to all guests in the live wedding week feed for exactly 24 hours.
            </p>

            <form onSubmit={handleStorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Story Image Snapshot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    '/src/assets/images/venue_villa_estate_1794230269596.jpg',
                    '/src/assets/images/story_proposal_moment_1794230267202.jpg',
                    '/src/assets/images/live_album_moment_1794230269470.jpg',
                  ].map((imgSrc, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStoryPreview(imgSrc)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        storyPreview === imgSrc
                          ? 'border-rose-600 ring-2 ring-rose-600/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt="Story Sample"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Story Caption / Greeting
                </label>
                <input
                  type="text"
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="e.g. Just checked into the Tuscan estate! 🌿🥂"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStoryPostOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
                >
                  Publish 24h Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

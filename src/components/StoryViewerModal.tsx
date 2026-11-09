import React, { useState, useEffect } from 'react';
import { X, Heart, Clock, Sparkles } from 'lucide-react';
import { StoryMoment } from '../types/wedding';

interface StoryViewerModalProps {
  stories: StoryMoment[];
  initialIndex: number;
  onClose: () => void;
  onLikeStory?: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  onClose,
  onLikeStory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const activeStory = stories[currentIndex];

  useEffect(() => {
    setProgress(0);
    setIsLiked(false);
    const interval = 50; // update every 50ms
    const step = (50 / 6000) * 100; // 6 seconds duration

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + step));
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((curr) => curr + 1);
      } else {
        onClose();
      }
    }
  }, [progress, currentIndex, stories.length, onClose]);

  if (!activeStory) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((curr) => curr - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((curr) => curr + 1);
    } else {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      role="dialog"
      aria-label="Story Viewer"
    >
      <div className="relative w-full max-w-sm sm:max-w-md h-[90vh] max-h-[780px] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-800">
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-500/80 border border-white/60 flex items-center justify-center text-xs font-semibold text-white">
              {activeStory.userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight leading-none text-white">
                {activeStory.userName}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-white/80 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>24h Disappearing Story</span>
                <span>·</span>
                <span className="font-mono">{activeStory.userRole}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close story viewer"
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Content */}
        <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
          <img
            src={activeStory.mediaUrl}
            alt="Wedding Story Moment"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Left / Right Tap zones */}
          <button
            onClick={handlePrev}
            aria-label="Previous story"
            className="absolute left-0 top-16 bottom-24 w-1/3 cursor-pointer z-20 focus:outline-none"
          />
          <button
            onClick={handleNext}
            aria-label="Next story"
            className="absolute right-0 top-16 bottom-24 w-2/3 cursor-pointer z-20 focus:outline-none"
          />

          {/* Scrim Gradient for caption */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Story Caption & Action Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col gap-3">
          {activeStory.text && (
            <p className="text-sm font-medium text-white/95 leading-relaxed bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              {activeStory.text}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Live Wedding Feed
            </span>

            <button
              onClick={() => {
                setIsLiked(!isLiked);
                onLikeStory?.(activeStory.id);
              }}
              aria-label="Send love reaction"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? 'Loved' : 'React'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

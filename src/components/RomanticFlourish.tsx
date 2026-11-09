import React from 'react';

interface FlourishProps {
  className?: string;
}

export const OliveBranchFlourish: React.FC<FlourishProps> = ({ className = 'w-32 h-6' }) => (
  <svg 
    viewBox="0 0 120 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`inline-block text-rose-800/60 ${className}`}
    aria-hidden="true"
  >
    <path 
      d="M10 12 C35 12, 45 4, 60 12 C75 20, 85 12, 110 12" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round"
    />
    <circle cx="60" cy="12" r="2.5" fill="currentColor" />
    <path 
      d="M30 10 C32 6, 36 6, 38 10 C36 12, 32 12, 30 10 Z" 
      fill="currentColor" 
      opacity="0.7"
    />
    <path 
      d="M48 14 C50 18, 54 18, 56 14 C54 12, 50 12, 48 14 Z" 
      fill="currentColor" 
      opacity="0.7"
    />
    <path 
      d="M64 14 C66 18, 70 18, 72 14 C70 12, 66 12, 64 14 Z" 
      fill="currentColor" 
      opacity="0.7"
    />
    <path 
      d="M82 10 C84 6, 88 6, 90 10 C88 12, 84 12, 82 10 Z" 
      fill="currentColor" 
      opacity="0.7"
    />
  </svg>
);

export const ClassicMonogramSeal: React.FC<{
  monogram?: string;
  sealUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}> = ({ monogram = 'E & J', sealUrl, size = 'md', onClick }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
  }[size];

  if (sealUrl) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`relative rounded-full overflow-hidden shadow-md border-2 border-amber-100/80 hover:scale-105 active:scale-95 transition-transform duration-200 shrink-0 ${sizeClasses}`}
        title="Elena & Julian Florentine Wax Seal"
      >
        <img
          src={sealUrl}
          alt="E & J Wax Seal Crest"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </button>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-full bg-gradient-to-br from-rose-900 via-rose-800 to-amber-950 text-amber-100 flex items-center justify-center font-serif font-bold shadow-md border-2 border-amber-200/50 shrink-0 ${sizeClasses}`}
    >
      <span className="tracking-tighter">{monogram}</span>
    </div>
  );
};

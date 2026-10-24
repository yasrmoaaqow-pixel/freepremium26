import React from 'react';

export const TelegramPremiumArtwork: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = ''
}) => {
  const dim = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-36 h-36' : 'w-24 h-24';
  return (
    <div className={`relative flex items-center justify-center ${dim} ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/20 via-[#B8860B]/10 to-transparent blur-md -z-0" />
      
      {/* Geometric background badge */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#181822] to-[#0D0D12] border border-[#D4AF37]/35 flex items-center justify-center p-3 shadow-inner">
        {/* Subtle radial inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]" fill="none">
          <defs>
            <linearGradient id="goldPlaneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3B0" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8C6514" />
            </linearGradient>
            <linearGradient id="starShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F5D77F" />
            </linearGradient>
          </defs>

          {/* Golden Telegram Paper Plane */}
          <path
            d="M86 21L14 49L38 61L44 81L57 69L72 79L86 21Z"
            fill="url(#goldPlaneGrad)"
          />
          {/* Plane inner shadow wing */}
          <path
            d="M38 61L86 21L49 61L44 81L38 61Z"
            fill="#805908"
            fillOpacity="0.45"
          />
          {/* Subtle star in top corner */}
          <path
            d="M78 12L80 18L86 20L80 22L78 28L76 22L70 20L76 18L78 12Z"
            fill="url(#starShineGrad)"
          />
        </svg>
      </div>
    </div>
  );
};

export const TelegramStarsArtwork: React.FC<{ size?: 'sm' | 'md' | 'lg'; count?: number; className?: string }> = ({
  size = 'md',
  count,
  className = ''
}) => {
  const dim = size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-36 h-36' : 'w-24 h-24';
  return (
    <div className={`relative flex items-center justify-center ${dim} ${className}`}>
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#E5C07B]/20 via-[#D4AF37]/10 to-transparent blur-md -z-0" />
      
      {/* Geometric background badge */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-[#181822] to-[#0D0D12] border border-[#D4AF37]/35 flex items-center justify-center p-3 shadow-inner">
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-transparent pointer-events-none" />

        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(212,175,55,0.45)]" fill="none">
          <defs>
            <linearGradient id="goldStarMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9D2" />
              <stop offset="40%" stopColor="#F5D061" />
              <stop offset="80%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#7E560E" />
            </linearGradient>
            <linearGradient id="goldStarFacet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFEAA7" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>

          {/* Central 3D Faceted Star */}
          <g transform="translate(0, 0)">
            <polygon
              points="50,14 62,38 88,42 69,60 74,86 50,73 26,86 31,60 12,42 38,38"
              fill="url(#goldStarMain)"
            />
            {/* Center light reflection facet */}
            <polygon
              points="50,14 50,73 31,60 12,42 38,38"
              fill="#523906"
              fillOpacity="0.25"
            />
            <polygon
              points="50,14 62,38 50,73"
              fill="url(#goldStarFacet)"
              fillOpacity="0.6"
            />
          </g>

          {/* Tiny accent spark */}
          <circle cx="24" cy="22" r="2.5" fill="#FFF8DC" />
          <circle cx="78" cy="74" r="1.8" fill="#FFF8DC" />
        </svg>

        {count && (
          <div className="absolute bottom-1.5 inset-x-0 text-center font-mono text-[10px] font-bold text-[#F5E6B8] tracking-wider">
            {count} ★
          </div>
        )}
      </div>
    </div>
  );
};

export const LuxuryDiamondBadge: React.FC<{ text?: string }> = ({ text = 'YASSER' }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181822]/80 border border-[#D4AF37]/40 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
      <span className="text-[11px] font-semibold text-[#F5E6B8] tracking-widest uppercase">
        {text}
      </span>
    </div>
  );
};

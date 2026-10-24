import React from 'react';
import { Sparkles, ShieldCheck, Zap, ArrowRight, Star, Clock } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { TelegramPremiumArtwork, TelegramStarsArtwork } from './LuxuryVisuals';

interface HeroProps {
  lang: Language;
  onExplorePremium: () => void;
  onExploreStars: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExplorePremium,
  onExploreStars,
}) => {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#D4AF37]/10 via-[#B8860B]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline and CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Subtle Text Kicker (No Pill Box) */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-4">
              <span>{t.heroBadge}</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-400">24/7 Active</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold font-cinzel leading-tight tracking-tight text-white mb-5 text-balance">
              {t.heroTitlePrefix}{' '}
              <span className="gold-text-gradient block sm:inline">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              {t.heroDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
              <button
                onClick={onExplorePremium}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] text-[#0A0A0E] font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t.explorePremium}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreStars}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#14141C] border border-[#D4AF37]/40 text-[#F5E6B8] hover:bg-[#1A1A24] active:scale-98 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>{t.getStars}</span>
              </button>
            </div>

            {/* Clean inline trust proof markers without pills */}
            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.instantDelivery}</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.zeroPassword}</span>
              </div>
              <span className="text-neutral-700 hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.officialGift}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#14141C] to-[#0D0D12] border border-[#D4AF37]/25 shadow-2xl">
              {/* Radial flare */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-white">YASSER PREMIUM STORE</h3>
                  <p className="text-xs text-[#D4AF37]">Premium Services. Instant Experience.</p>
                </div>
                <div className="px-2.5 py-1 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-mono font-medium text-[#F5E6B8]">
                  24/7 ONLINE
                </div>
              </div>

              {/* Showcase Dual Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  onClick={onExplorePremium}
                  className="p-4 rounded-2xl bg-[#09090D] border border-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer text-center group"
                >
                  <div className="flex justify-center mb-2">
                    <TelegramPremiumArtwork size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">Telegram Premium</h4>
                  <div className="mt-1 text-xs font-mono font-bold text-[#F5E6B8]">From $12.50</div>
                  <p className="text-[10px] text-neutral-500 mt-0.5">3, 6, 12 Months</p>
                </div>

                <div 
                  onClick={onExploreStars}
                  className="p-4 rounded-2xl bg-[#09090D] border border-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer text-center group"
                >
                  <div className="flex justify-center mb-2">
                    <TelegramStarsArtwork size="sm" count={100} />
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors">Telegram Stars</h4>
                  <div className="mt-1 text-xs font-mono font-bold text-[#F5E6B8]">From $1.00</div>
                  <p className="text-[10px] text-neutral-500 mt-0.5">50 to 250+ Stars</p>
                </div>
              </div>

              {/* Accepted crypto info strip */}
              <div className="p-3.5 rounded-xl bg-[#09090E] border border-[#D4AF37]/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span className="font-medium text-neutral-300">Binance Pay & USDT BEP20</span>
                </div>
                <span className="text-[#D4AF37] font-mono font-bold">0% Gas Fee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Check, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';
import { TelegramPremiumArtwork } from './LuxuryVisuals';

interface PremiumPackagesProps {
  products: Product[];
  lang: Language;
  showDZD: boolean;
  onAddToCart: (product: Product, username: string) => void;
  onInstantBuy: (product: Product, username: string) => void;
}

export const PremiumPackages: React.FC<PremiumPackagesProps> = ({
  products,
  lang,
  showDZD,
  onAddToCart,
  onInstantBuy,
}) => {
  const t = translations[lang];
  const premiumProducts = products.filter((p) => p.type === 'premium');

  // Local state for username input on cards
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [errorIds, setErrorIds] = useState<Record<string, string>>({});

  const handleUsernameChange = (productId: string, val: string) => {
    // Auto-clean to format @username
    let formatted = val.trim();
    if (formatted && !formatted.startsWith('@')) {
      formatted = '@' + formatted;
    }
    setUsernames((prev) => ({ ...prev, [productId]: formatted }));
    if (errorIds[productId]) {
      setErrorIds((prev) => ({ ...prev, [productId]: '' }));
    }
  };

  const validateUsername = (productId: string): string | null => {
    const raw = usernames[productId] || '';
    if (!raw || raw.replace('@', '').length < 3) {
      setErrorIds((prev) => ({
        ...prev,
        [productId]: t.telegramUsernameRequired,
      }));
      return null;
    }
    return raw;
  };

  const handleAdd = (product: Product) => {
    const valid = validateUsername(product.id);
    if (!valid) return;
    onAddToCart(product, valid);
  };

  const handleBuy = (product: Product) => {
    const valid = validateUsername(product.id);
    if (!valid) return;
    onInstantBuy(product, valid);
  };

  return (
    <section id="premium-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Official Gift Upgrade</span>
          <span aria-hidden="true">·</span>
          <span>Zero Password Required</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cinzel text-white mb-4 text-balance">
          {t.premiumHeading}
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          {t.premiumSubheading}
        </p>
      </div>

      {/* 3-Column Luxury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {premiumProducts.map((product) => {
          const isPopular = product.popular;
          const name = lang === 'ar' ? product.nameAr : lang === 'fr' ? product.nameFr : product.name;
          const badge = lang === 'ar' ? product.badgeAr : lang === 'fr' ? product.badgeFr : product.badge;
          const features = lang === 'ar' ? product.featuresAr : lang === 'fr' ? product.featuresFr : product.features;
          const dzdPrice = Math.round(product.price * BUSINESS_INFO.dzdExchangeRate);

          return (
            <div
              key={product.id}
              className={`relative flex flex-col justify-between rounded-3xl bg-[#0F0F16] transition-all duration-300 p-7 ${
                isPopular
                  ? 'border-2 border-[#D4AF37] shadow-[0_0_35px_-8px_rgba(212,175,55,0.3)] md:-translate-y-2'
                  : 'border border-white/10 hover:border-[#D4AF37]/50 shadow-xl'
              }`}
            >
              {/* Optional editorial badge */}
              {badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] text-xs font-bold tracking-wider uppercase shadow-md whitespace-nowrap">
                  {badge}
                </div>
              )}

              {/* Card Header & Artwork */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                      {product.durationMonths} {t.months}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">{name}</h3>
                  </div>
                  <TelegramPremiumArtwork size="sm" />
                </div>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-extrabold font-mono text-[#F5E6B8] tracking-tight tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-mono text-neutral-500 line-through tabular-nums">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">/ {t.billedOnce}</span>
                  </div>

                  {/* Monthly equivalent breakdown */}
                  <div className="text-xs text-[#D4AF37] mt-1 font-mono">
                    ≈ ${(product.price / (product.durationMonths || 1)).toFixed(2)} {t.perMonth}
                  </div>

                  {showDZD && (
                    <div className="text-xs text-neutral-400 mt-1">
                      {t.currencyDZDNote}{' '}
                      <span className="font-mono font-bold text-neutral-200">
                        {dzdPrice.toLocaleString()} DZD
                      </span>
                    </div>
                  )}
                </div>

                {/* Feature Bullet List */}
                <div className="space-y-3 mb-8">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0 mt-0.5 text-[#D4AF37]">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Purchase Form */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t.enterTelegramUsername}
                  </label>
                  <input
                    type="text"
                    value={usernames[product.id] || ''}
                    onChange={(e) => handleUsernameChange(product.id, e.target.value)}
                    placeholder={t.telegramUsernamePlaceholder}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#08080C] border text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                      errorIds[product.id]
                        ? 'border-red-500/70 focus:border-red-500'
                        : 'border-white/10 focus:border-[#D4AF37]'
                    }`}
                  />
                  {errorIds[product.id] && (
                    <p className="text-[11px] text-red-400 mt-1">{errorIds[product.id]}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleAdd(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#171722] hover:bg-[#1E1E2C] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-semibold text-neutral-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{t.addToCart}</span>
                  </button>

                  <button
                    onClick={() => handleBuy(product)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-98 text-xs font-bold text-[#0A0A0E] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <span>{t.buyNow}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

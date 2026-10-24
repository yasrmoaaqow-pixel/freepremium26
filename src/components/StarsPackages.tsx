import React, { useState } from 'react';
import { Star, ShoppingBag, ArrowRight, Calculator, Check, Sparkles } from 'lucide-react';
import { Product, Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';
import { TelegramStarsArtwork } from './LuxuryVisuals';

interface StarsPackagesProps {
  products: Product[];
  lang: Language;
  showDZD: boolean;
  onAddToCart: (product: Product, username: string) => void;
  onInstantBuy: (product: Product, username: string) => void;
}

export const StarsPackages: React.FC<StarsPackagesProps> = ({
  products,
  lang,
  showDZD,
  onAddToCart,
  onInstantBuy,
}) => {
  const t = translations[lang];
  const starProducts = products.filter((p) => p.type === 'stars');

  // Selected preset product or calculator
  const [selectedProductId, setSelectedProductId] = useState<string>(
    starProducts.find((p) => p.popular)?.id || starProducts[0]?.id || ''
  );
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');

  // Interactive custom calculator
  const [customStars, setCustomStars] = useState<number>(100);

  const selectedProduct = starProducts.find((p) => p.id === selectedProductId) || starProducts[0];

  const handleUsernameChange = (val: string) => {
    let formatted = val.trim();
    if (formatted && !formatted.startsWith('@')) {
      formatted = '@' + formatted;
    }
    setUsername(formatted);
    if (usernameError) setUsernameError('');
  };

  const validate = (): string | null => {
    if (!username || username.replace('@', '').length < 3) {
      setUsernameError(t.telegramUsernameRequired);
      return null;
    }
    return username;
  };

  const handleAdd = () => {
    const valid = validate();
    if (!valid || !selectedProduct) return;
    onAddToCart(selectedProduct, valid);
  };

  const handleBuy = () => {
    const valid = validate();
    if (!valid || !selectedProduct) return;
    onInstantBuy(selectedProduct, valid);
  };

  // Custom rate: approx $0.018 per star with volume discount
  const customPrice = Math.max(1.0, +(customStars * (customStars >= 200 ? 0.016 : customStars >= 100 ? 0.018 : 0.02)).toFixed(2));

  return (
    <section id="stars-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Digital Currency</span>
          <span aria-hidden="true">·</span>
          <span>Mini-Apps & Bot Unlocks</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cinzel text-white mb-4 text-balance">
          {t.starsHeading}
        </h2>
        <p className="text-sm sm:text-base text-neutral-400">
          {t.starsSubheading}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preset Package Cards Grid (6 packages) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {starProducts.map((pkg) => {
              const isSelected = selectedProductId === pkg.id;
              const badge = lang === 'ar' ? pkg.badgeAr : lang === 'fr' ? pkg.badgeFr : pkg.badge;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedProductId(pkg.id)}
                  className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#151520] border-2 border-[#D4AF37] shadow-[0_0_20px_-4px_rgba(212,175,55,0.35)] scale-[1.02]'
                      : 'bg-[#0E0E14] border border-white/5 hover:border-[#D4AF37]/40 hover:bg-[#12121A]'
                  }`}
                >
                  {badge && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-[10px] font-bold uppercase tracking-wider">
                      {badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                      <Star className="w-4 h-4 fill-[#D4AF37]" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      ${(pkg.price / (pkg.starsCount || 1)).toFixed(3)}/★
                    </span>
                  </div>

                  <div>
                    <div className="text-xl sm:text-2xl font-bold font-mono text-white">
                      {pkg.starsCount} <span className="text-xs font-sans text-[#D4AF37]">{t.stars}</span>
                    </div>
                    <div className="text-lg font-bold font-mono text-[#F5E6B8] mt-1 tabular-nums">
                      ${pkg.price.toFixed(2)}
                    </div>
                    {showDZD && (
                      <div className="text-[11px] text-neutral-500 font-mono">
                        ≈ {Math.round(pkg.price * BUSINESS_INFO.dzdExchangeRate)} DZD
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Range Slider Helper */}
          <div className="mt-6 p-6 rounded-2xl bg-[#0D0D14] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                <h4 className="text-sm font-semibold text-white">{t.starCalculator}</h4>
              </div>
              <span className="text-xs font-mono text-[#D4AF37]">{customStars} Stars = ${customPrice.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={50}
              max={1000}
              step={25}
              value={customStars}
              onChange={(e) => setCustomStars(Number(e.target.value))}
              className="w-full accent-[#D4AF37] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-500 mt-2">
              <span>50 Stars ($1.00)</span>
              <span>250 Stars ($4.00)</span>
              <span>500 Stars ($8.50)</span>
              <span>1000 Stars ($16.00)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Package Summary & Instant Order Form */}
        {selectedProduct && (
          <div className="lg:col-span-5 sticky top-24 p-7 rounded-3xl bg-gradient-to-b from-[#14141E] to-[#0A0A0F] border border-[#D4AF37]/30 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider">
                  Selected Package
                </span>
                <h3 className="text-2xl font-bold font-mono text-white mt-0.5">
                  {selectedProduct.starsCount} {t.stars}
                </h3>
              </div>
              <TelegramStarsArtwork size="sm" count={selectedProduct.starsCount} />
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#08080C] border border-white/5 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-400 block">{t.calculatePrice}</span>
                <span className="text-3xl font-extrabold font-mono text-[#F5E6B8] tabular-nums">
                  ${selectedProduct.price.toFixed(2)}
                </span>
              </div>
              {showDZD && (
                <div className="text-right">
                  <span className="text-xs text-neutral-400 block">{t.currencyDZDNote}</span>
                  <span className="text-sm font-mono font-bold text-neutral-200">
                    {Math.round(selectedProduct.price * BUSINESS_INFO.dzdExchangeRate)} DZD
                  </span>
                </div>
              )}
            </div>

            {/* Features of this stars package */}
            <div className="space-y-2.5 mb-6 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Instant API delivery to @username</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Works on all Telegram Bots & Mini-Apps</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Zero login password requested</span>
              </div>
            </div>

            {/* Recipient username input */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {t.enterTelegramUsername}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder={t.telegramUsernamePlaceholder}
                className={`w-full px-4 py-3 rounded-xl bg-[#08080C] border text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors ${
                  usernameError
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-white/10 focus:border-[#D4AF37]'
                }`}
              />
              {usernameError && (
                <p className="text-[11px] text-red-400 mt-1">{usernameError}</p>
              )}
              <p className="text-[11px] text-neutral-500 mt-1">{t.usernameHelp}</p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAdd}
                className="w-full py-3 px-4 rounded-xl bg-[#181824] hover:bg-[#202030] border border-white/10 hover:border-[#D4AF37]/50 text-xs font-semibold text-neutral-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.addToCart}</span>
              </button>

              <button
                onClick={handleBuy}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-xs font-bold text-[#0A0A0E] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <span>{t.buyNow}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

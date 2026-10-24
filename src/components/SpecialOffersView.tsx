import React, { useState } from 'react';
import { Sparkles, Gift, Crown, Share2, Copy, Check, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../translations';
import { TelegramPremiumArtwork, TelegramStarsArtwork } from './LuxuryVisuals';

interface SpecialOffersViewProps {
  lang: Language;
  onAddToCart: (product: Product, username: string) => void;
  onInstantBuy: (product: Product, username: string) => void;
  products: Product[];
}

export const SpecialOffersView: React.FC<SpecialOffersViewProps> = ({
  lang,
  onAddToCart,
  onInstantBuy,
  products,
}) => {
  const t = translations[lang];
  const [refUsername, setRefUsername] = useState('@yasser_client');
  const [copiedRef, setCopiedRef] = useState(false);

  const bundleProduct: Product = {
    id: 'bundle-vip-ultimate',
    type: 'premium',
    name: 'VIP Executive Bundle: 12M Premium + 100 Stars',
    nameAr: 'حزمة كبار العملاء: 12 شهر بريميوم + 100 نجمة',
    nameFr: 'Pack VIP Exécutif : 12 Mois Premium + 100 Étoiles',
    durationMonths: 12,
    starsCount: 100,
    price: 30.50,
    originalPrice: 35.00,
    badge: 'Exclusive Combo',
    badgeAr: 'عرض خاص مدمج',
    badgeFr: 'Offre Spéciale',
    description: 'Get 1 full year of Telegram Premium plus 100 Telegram Stars in a single discounted package.',
    descriptionAr: 'احصل على اشتراك سنة كاملة مع 100 نجمة هدية في باقة واحدة بتخفيض مميز.',
    descriptionFr: '1 an de Telegram Premium + 100 Étoiles réunies à un tarif préférentiel.',
    features: [
      'Full 12 Months Telegram Premium ($29.99 value)',
      '100 Telegram Stars ($1.80 value)',
      'Instant Dual Activation on @username',
      'Priority VIP processing queue in under 3 minutes'
    ],
    featuresAr: [
      'سنة كاملة تيليجرام بريميوم (بقيمة 29.99$)',
      '100 نجمة تيليجرام للألعاب والبوتات (بقيمة 1.80$)',
      'تفعيل ثنائي فوري بنفس الحساب',
      'أولوية معالجة فورية فائقة السرعة'
    ],
    featuresFr: [
      '12 mois complets de Telegram Premium',
      '100 Étoiles Telegram incluses',
      'Activation double immédiate',
      'Traitement prioritaire VIP en moins de 3 minutes'
    ],
    inStock: true
  };

  const handleCopyRef = () => {
    const link = `https://yasserpremium.store/?ref=${encodeURIComponent(refUsername)}`;
    navigator.clipboard.writeText(link);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="py-12 md:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Weekly Curated Deals</span>
          <span aria-hidden="true">·</span>
          <span>Limited Availability</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          {t.specialOffersTitle}
        </h1>
        <p className="text-sm text-neutral-400">
          {t.specialOffersSub}
        </p>
      </div>

      {/* Featured Weekly Combo Bundle */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#14141E] via-[#1B1914] to-[#14141E] border-2 border-[#D4AF37] shadow-[0_0_35px_-8px_rgba(212,175,55,0.35)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {bundleProduct.badge}
            </span>

            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-3">
              {lang === 'ar' ? bundleProduct.nameAr : lang === 'fr' ? bundleProduct.nameFr : bundleProduct.name}
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {lang === 'ar' ? bundleProduct.descriptionAr : lang === 'fr' ? bundleProduct.descriptionFr : bundleProduct.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {(lang === 'ar' ? bundleProduct.featuresAr : lang === 'fr' ? bundleProduct.featuresFr : bundleProduct.features).map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                  <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold font-mono text-[#F5E6B8] tabular-nums">
                ${bundleProduct.price.toFixed(2)}
              </span>
              <span className="text-lg font-mono text-neutral-500 line-through tabular-nums">
                ${bundleProduct.originalPrice?.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                Save $4.50 Instant Discount
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => onInstantBuy(bundleProduct, '@your_username')}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-[#0A0A0E] font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Instant Order Bundle</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onAddToCart(bundleProduct, '@your_username')}
                className="px-6 py-3.5 rounded-xl bg-[#171722] hover:bg-[#20202F] border border-white/10 text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer"
              >
                Add Bundle to Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative p-6 rounded-3xl bg-[#09090D] border border-[#D4AF37]/30 shadow-2xl flex flex-col items-center">
              <div className="flex items-center gap-3 mb-4">
                <TelegramPremiumArtwork size="md" />
                <span className="text-2xl font-black text-[#D4AF37]">+</span>
                <TelegramStarsArtwork size="md" count={100} />
              </div>
              <span className="text-xs font-mono font-bold text-[#F5E6B8] tracking-widest uppercase">
                COMPLETE TELEGRAM SUITE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Club Tiers Section */}
      <div className="p-8 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-xl font-bold text-white">{t.vipClubTitle}</h3>
            <p className="text-xs text-neutral-400">{t.vipClubDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Bronze Tier */}
          <div className="p-5 rounded-2xl bg-[#09090D] border border-white/5 space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Tier 1 · Bronze</span>
            <h4 className="text-sm font-bold text-white">First Purchase</h4>
            <p className="text-xs text-neutral-400">Automatic 5% promo code for your second purchase with code <code className="text-[#D4AF37]">WELCOME5</code>.</p>
          </div>

          {/* Silver Tier */}
          <div className="p-5 rounded-2xl bg-[#09090D] border border-white/5 space-y-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">Tier 2 · Silver</span>
            <h4 className="text-sm font-bold text-white">$50+ Total Spend</h4>
            <p className="text-xs text-neutral-400">10% permanent discount coupon <code className="text-[#D4AF37]">YASSER10</code> plus priority order queue.</p>
          </div>

          {/* Gold Tier */}
          <div className="p-5 rounded-2xl bg-[#09090D] border border-[#D4AF37]/30 space-y-2">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Tier 3 · Gold VIP</span>
            <h4 className="text-sm font-bold text-white">$100+ Total Spend</h4>
            <p className="text-xs text-neutral-400">15% discount coupon <code className="text-[#D4AF37]">VIPGOLD</code> + 50 free bonus Telegram Stars every month!</p>
          </div>

          {/* Diamond Tier */}
          <div className="p-5 rounded-2xl bg-[#09090D] border border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Tier 4 · Diamond Elite</span>
            <h4 className="text-sm font-bold text-white">Resellers & Partners</h4>
            <p className="text-xs text-neutral-400">Wholesale API rates, dedicated Telegram direct line with Yasser, custom bulk invoice delivery.</p>
          </div>
        </div>
      </div>

      {/* Referral Link Generator */}
      <div className="p-8 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-cinzel text-lg font-bold text-white">{t.referralTitle}</h3>
            </div>
            <p className="text-xs text-neutral-400">{t.referralDesc}</p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={refUsername}
              onChange={(e) => setRefUsername(e.target.value)}
              placeholder="Your Telegram @username"
              className="px-3.5 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-full sm:w-48"
            />
            <button
              onClick={handleCopyRef}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedRef ? 'Link Copied!' : 'Copy Referral Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  showDZD: boolean;
  onToggleDZD: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  lang,
  onSelectLang,
  showDZD,
  onToggleDZD,
  isAdmin,
  onOpenAdmin,
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'premium', label: t.navPremium },
    { id: 'stars', label: t.navStars },
    { id: 'offers', label: t.navSpecial },
    { id: 'track', label: t.navTrack },
    { id: 'instructions', label: t.navInstructions },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08080A]/90 backdrop-blur-md border-b border-white/5 transition-all">
      {/* Top micro announcement bar */}
      <div className="w-full bg-gradient-to-r from-[#121217] via-[#1A1813] to-[#121217] border-b border-[#D4AF37]/15 py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-medium">⚡ 24/7 Fast Delivery</span>
            <span className="hidden sm:inline text-neutral-600">·</span>
            <span className="hidden sm:inline">Binance ID: <code className="text-[#F5E6B8] font-mono">986517873</code></span>
            <span className="hidden md:inline text-neutral-600">·</span>
            <span className="hidden md:inline">USDT BEP20 Supported</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency conversion preview toggle */}
            <button
              onClick={onToggleDZD}
              className="text-[11px] font-medium text-neutral-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
              title="Toggle DZD approximate conversion"
            >
              <span className="text-neutral-500">Currency:</span>
              <span className={showDZD ? 'text-[#D4AF37] font-semibold' : 'text-neutral-300'}>
                {showDZD ? 'USD ($) + DZD' : 'USD ($)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 text-left group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6514] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0D0D12] rounded-[6px] flex items-center justify-center text-[#D4AF37] font-serif font-black text-sm group-hover:text-white transition-colors">
              YP
            </div>
          </div>
          <span className="font-cinzel text-lg md:text-xl font-bold tracking-wider gold-text-gradient whitespace-nowrap">
            YASSER PREMIUM
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-300">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#F5E6B8] font-semibold'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F5E6B8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Essential Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#14141B] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-medium text-neutral-300 transition-colors"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="uppercase">{lang}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-[#121218] border border-[#D4AF37]/30 rounded-xl shadow-2xl py-1 z-50">
                <button
                  onClick={() => {
                    onSelectLang('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                    lang === 'en' ? 'text-[#D4AF37] font-semibold' : 'text-neutral-300'
                  }`}
                >
                  <span>English</span>
                  <span>🇬🇧</span>
                </button>
                <button
                  onClick={() => {
                    onSelectLang('ar');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                    lang === 'ar' ? 'text-[#D4AF37] font-semibold' : 'text-neutral-300'
                  }`}
                >
                  <span>العربية</span>
                  <span>🇩🇿</span>
                </button>
                <button
                  onClick={() => {
                    onSelectLang('fr');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                    lang === 'fr' ? 'text-[#D4AF37] font-semibold' : 'text-neutral-300'
                  }`}
                >
                  <span>Français</span>
                  <span>🇫🇷</span>
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-95 text-[#0A0A0E] font-semibold text-xs transition-all shadow-md"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline font-bold">{t.cart}</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#08080A] text-[#F5E6B8] border border-[#D4AF37] flex items-center justify-center text-[10px] font-mono font-bold">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg bg-[#14141B] border border-white/10"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0C0C10] border-b border-white/10 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-[#181824] text-[#D4AF37] font-semibold'
                  : 'text-neutral-300 hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
            <span>Support: @yasser_fr</span>
            <span className="text-[11px] text-[#D4AF37]">24/7 Available</span>
          </div>
        </div>
      )}
    </header>
  );
};

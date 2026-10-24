import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Heart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';

interface FooterProps {
  lang: Language;
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, onOpenAdmin }) => {
  const t = translations[lang];
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-[#050507] border-t border-white/5 pt-16 pb-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6514] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0D0D12] rounded-[6px] flex items-center justify-center text-[#D4AF37] font-serif font-black text-sm">
                  YP
                </div>
              </div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                YASSER PREMIUM
              </span>
            </div>

            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              {lang === 'ar' ? BUSINESS_INFO.sloganAr : lang === 'fr' ? BUSINESS_INFO.sloganFr : BUSINESS_INFO.slogan} — Official high-speed provider of Telegram Premium upgrades and Telegram Stars with verified crypto settlement.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12121A] border border-white/10 text-[11px] text-[#F5E6B8]">
                <span>Binance ID: {BUSINESS_INFO.binanceId}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#12121A] border border-white/10 text-[11px] text-emerald-400">
                <span>USDT BEP20</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
              Store Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('premium')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.navPremium}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stars')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.navStars}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.navSpecial}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.navTrack}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('instructions')}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  {t.navInstructions}
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Support & Legal */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-white uppercase tracking-wider">
              24/7 Priority Support
            </h4>
            <p className="text-xs text-neutral-400">
              For manual order verification, custom requests, or partnership inquiries:
            </p>
            <a
              href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14141E] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold text-[#F5E6B8] transition-colors"
            >
              <span>Telegram: @{BUSINESS_INFO.telegramSupport}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="pt-2 flex items-center gap-4 text-[11px] text-neutral-500">
              <button
                onClick={() => setModalType('terms')}
                className="hover:text-neutral-300 underline cursor-pointer"
              >
                {t.termsAndConditions}
              </button>
              <span>·</span>
              <button
                onClick={() => setModalType('privacy')}
                className="hover:text-neutral-300 underline cursor-pointer"
              >
                {t.privacyPolicy}
              </button>
              <span>·</span>
              <a
                href="#admin"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenAdmin();
                }}
                className="text-neutral-400 hover:text-[#D4AF37] transition-colors font-medium flex items-center gap-1 cursor-pointer"
                title="Administrator Access Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Admin Login</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. {t.rightsReserved}</p>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>{t.securityGuarantee}</span>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#101016] border border-[#D4AF37]/30 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto text-neutral-300 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-cinzel text-sm font-bold text-white">
                {modalType === 'terms' ? t.termsAndConditions : t.privacyPolicy}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {modalType === 'terms' ? (
              <div className="space-y-3 leading-relaxed">
                <p>1. <strong>Service Nature:</strong> YASSER PREMIUM delivers official Telegram subscriptions and Stars via Telegram's gift mechanism. No account credentials or passwords are ever required.</p>
                <p>2. <strong>Payment Verification:</strong> Orders are processed upon confirmed receipt on Binance Pay or the BNB Smart Chain BEP20 blockchain. Customers are responsible for sending funds exclusively on the specified BEP20 network.</p>
                <p>3. <strong>Delivery Timeframe:</strong> Most orders are fulfilled within 2 to 5 minutes. In rare cases of high network congestion, fulfillment may take up to 30 minutes.</p>
                <p>4. <strong>Support:</strong> 24/7 support is provided via official Telegram channel @yasser_fr.</p>
              </div>
            ) : (
              <div className="space-y-3 leading-relaxed">
                <p>1. <strong>Data Collection:</strong> We collect only the public Telegram @username required to direct your gift upgrade and transaction reference IDs to confirm payment.</p>
                <p>2. <strong>Zero Credential Retention:</strong> We never request, process, or store passwords, seed phrases, or private keys.</p>
                <p>3. <strong>Order Storage:</strong> Local order information is stored locally in your client session and encrypted in our order tracking ledger strictly for dispute resolution.</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0A0A0E] text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

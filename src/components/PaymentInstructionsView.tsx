import React, { useState } from 'react';
import {
  Copy,
  Check,
  AlertTriangle,
  Smartphone,
  Wallet,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PaymentInstructionsViewProps {
  lang: Language;
  onGoToShop: () => void;
}

export const PaymentInstructionsView: React.FC<PaymentInstructionsViewProps> = ({
  lang,
  onGoToShop,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'binance' | 'usdt'>('binance');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Official Payment Channels</span>
          <span aria-hidden="true">·</span>
          <span>Zero Fees</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          {t.paymentMethodsTitle}
        </h1>
        <p className="text-sm text-neutral-400">
          Step-by-step instructions for paying via Binance Pay or USDT BEP20 cryptocurrency.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="p-1 rounded-2xl bg-[#12121A] border border-white/10 flex gap-2">
          <button
            onClick={() => setActiveTab('binance')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'binance'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Method 1: Binance Pay</span>
          </button>

          <button
            onClick={() => setActiveTab('usdt')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'usdt'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Method 2: USDT BEP20</span>
          </button>
        </div>
      </div>

      {/* Method 1: Binance Pay */}
      {activeTab === 'binance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-7 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">Binance Pay Transfer</h3>
                  <p className="text-xs text-[#D4AF37]">Zero fee user-to-user instant settlement</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  Recommended
                </span>
              </div>

              {/* Copy Binance ID */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Official Binance ID (Pay ID)
                </label>
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#08080C] border border-white/10">
                  <span className="font-mono text-xl font-bold text-[#F5E6B8] flex-1">
                    {BUSINESS_INFO.binanceId}
                  </span>
                  <button
                    onClick={() => handleCopy(BUSINESS_INFO.binanceId, 'binance')}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'binance' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'binance' ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">Nickname: {BUSINESS_INFO.binanceNickname}</p>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  How to send via Binance App:
                </h4>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#181824] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                      1
                    </span>
                    <span>Open the Binance App on your phone and tap <strong>Pay</strong> (or the Pay icon in the top right).</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#181824] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                      2
                    </span>
                    <span>Select <strong>Send</strong> and choose <strong>Binance ID</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#181824] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                      3
                    </span>
                    <span>Paste our Binance ID: <code className="text-[#F5E6B8] font-mono">986517873</code>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#181824] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                      4
                    </span>
                    <span>Enter the exact USD amount (e.g. $12.50 or $29.99) and complete authentication.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#181824] border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                      5
                    </span>
                    <span>Copy the Order ID / Reference or take a screenshot and submit it during checkout.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code and Quick Support */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-[#0F0F16] border border-white/10 shadow-xl flex flex-col items-center text-center">
              <h4 className="text-sm font-bold text-white mb-1">Scan with Binance App</h4>
              <p className="text-xs text-neutral-400 mb-6">Instantly opens transfer screen</p>
              <QRCodeDisplay value={BUSINESS_INFO.binanceId} size={180} label="Binance Pay ID: 986517873" />
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#14141E] to-[#0A0A0F] border border-[#D4AF37]/20">
              <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-2">Need live assistance?</h4>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                Yasser is available 24/7 on Telegram to guide you through Binance payment or confirm transfer within seconds.
              </p>
              <a
                href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1C1C28] hover:bg-[#252536] border border-[#D4AF37]/40 text-xs font-bold text-[#F5E6B8] flex items-center justify-center gap-2 transition-colors"
              >
                <span>Message @{BUSINESS_INFO.telegramSupport}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Method 2: USDT BEP20 */}
      {activeTab === 'usdt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-7 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">USDT (BNB Smart Chain)</h3>
                  <p className="text-xs text-[#D4AF37]">Decentralized crypto payment on BEP20</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                  BEP20 / BSC
                </span>
              </div>

              {/* CRITICAL WARNING */}
              <div className="p-4 rounded-2xl bg-amber-950/50 border-2 border-amber-500/70 text-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>CRITICAL NETWORK REQUIREMENT</span>
                </div>
                <p className="leading-relaxed">
                  You MUST choose the <strong>BNB Smart Chain (BEP20)</strong> network when withdrawing or sending.
                  Do NOT send using TRC20, ERC20, Polygon, or Arbitrum. Funds sent on the wrong network cannot be recovered!
                </p>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Deposit Wallet Address (BEP20)
                </label>
                <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <span className="font-mono text-xs text-[#F5E6B8] break-all flex-1">
                    {BUSINESS_INFO.usdtAddress}
                  </span>
                  <button
                    onClick={() => handleCopy(BUSINESS_INFO.usdtAddress, 'usdt')}
                    className="px-4 py-2 rounded-lg bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedKey === 'usdt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'usdt' ? 'Copied!' : 'Copy Address'}</span>
                  </button>
                </div>
              </div>

              {/* Wallet Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Supported Wallets & Exchanges:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-neutral-300">
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Trust Wallet</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>MetaMask</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Binance App</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>OKX</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Bybit</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#09090D] border border-white/5 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Coinbase Wallet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-[#0F0F16] border border-white/10 shadow-xl flex flex-col items-center text-center">
              <h4 className="text-sm font-bold text-white mb-1">Scan USDT BEP20 QR</h4>
              <p className="text-xs text-neutral-400 mb-6">Compatible with all crypto wallet cameras</p>
              <QRCodeDisplay value={BUSINESS_INFO.usdtAddress} size={180} label="Network: BNB Smart Chain (BEP20)" />
            </div>

            <button
              onClick={onGoToShop}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-98 text-xs font-bold text-[#0A0A0E] tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Back to Store & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

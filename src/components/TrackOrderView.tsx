import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Package,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { Order, Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';

interface TrackOrderViewProps {
  orders: Order[];
  lang: Language;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ orders, lang }) => {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(orders[0] || null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const matched = orders.find(
      (o) =>
        o.id.toLowerCase() === query ||
        o.telegramUsername.toLowerCase() === query ||
        o.telegramUsername.toLowerCase().replace('@', '') === query.replace('@', '')
    );

    setFoundOrder(matched || null);
  };

  const getStatusStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment':
        return 0;
      case 'verifying':
        return 1;
      case 'processing':
        return 2;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const stepIndex = foundOrder ? getStatusStepIndex(foundOrder.status) : 0;

  return (
    <div className="py-12 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          {t.trackOrderTitle}
        </h1>
        <p className="text-sm text-neutral-400">
          {t.trackOrderSub}
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.orderIdInputPlaceholder}
            className="w-full pl-5 pr-28 py-3.5 rounded-2xl bg-[#0F0F16] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-all shadow-lg"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-95 text-[#0A0A0E] text-xs font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{t.trackButton}</span>
          </button>
        </div>
      </form>

      {/* Quick Demo Pre-seed Chips */}
      <div className="text-center mb-10">
        <span className="text-xs text-neutral-500 mr-2">Quick test orders:</span>
        <div className="inline-flex flex-wrap gap-2 justify-center">
          {orders.slice(0, 3).map((ord) => (
            <button
              key={ord.id}
              onClick={() => {
                setSearchTerm(ord.id);
                setFoundOrder(ord);
                setHasSearched(true);
              }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#14141C] border border-white/5 hover:border-[#D4AF37]/50 text-[#D4AF37] transition-colors"
            >
              {ord.id} ({ord.status})
            </button>
          ))}
        </div>
      </div>

      {/* Results Box */}
      {foundOrder ? (
        <div className="p-7 sm:p-8 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/30 shadow-2xl space-y-8">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs text-neutral-400 block">{t.yourOrderId}</span>
              <h2 className="text-2xl font-mono font-black text-[#F5E6B8] tracking-wider mt-0.5">
                {foundOrder.id}
              </h2>
              <span className="text-xs text-neutral-400">
                Created: {new Date(foundOrder.createdAt).toLocaleDateString()} at{' '}
                {new Date(foundOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-neutral-400 block">Target Account</span>
              <span className="text-base font-bold text-white block">
                {foundOrder.telegramUsername}
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37]">
                ${foundOrder.totalUSD.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {foundOrder.status === 'cancelled' ? (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <strong className="block font-semibold">Order Cancelled</strong>
                <span>{foundOrder.adminNote || 'Payment was not verified or cancelled by administrator.'}</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-[12%] right-[12%] h-0.5 bg-neutral-800 -z-0">
                  <div
                    className="h-full bg-[#D4AF37] transition-all duration-500"
                    style={{ width: `${Math.min(100, (stepIndex / 3) * 100)}%` }}
                  />
                </div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      stepIndex >= 0
                        ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    1
                  </div>
                  <span className={`font-medium ${stepIndex >= 0 ? 'text-white' : 'text-neutral-500'}`}>
                    {t.stepPlaced}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      stepIndex >= 1
                        ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    2
                  </div>
                  <span className={`font-medium ${stepIndex >= 1 ? 'text-white' : 'text-neutral-500'}`}>
                    {t.statusVerifying}
                  </span>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      stepIndex >= 2
                        ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    3
                  </div>
                  <span className={`font-medium ${stepIndex >= 2 ? 'text-white' : 'text-neutral-500'}`}>
                    {t.statusProcessing}
                  </span>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      stepIndex >= 3
                        ? 'bg-emerald-400 text-[#0A0A0E] shadow-[0_0_14px_rgba(52,211,153,0.5)]'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    4
                  </div>
                  <span className={`font-medium ${stepIndex >= 3 ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                    {t.statusCompleted}
                  </span>
                </div>
              </div>

              {/* Status explanation note */}
              <div className="mt-6 p-4 rounded-2xl bg-[#09090E] border border-white/5 text-xs text-neutral-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    Status:{' '}
                    <strong className="text-[#F5E6B8] capitalize">
                      {foundOrder.status.replace('_', ' ')}
                    </strong>
                  </span>
                </div>
                {foundOrder.completedAt && (
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Completed on {new Date(foundOrder.completedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Itemized Order Details */}
          <div>
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Ordered Products
            </h4>
            <div className="space-y-2">
              {foundOrder.items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#08080C] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[#D4AF37]" />
                    <div>
                      <h5 className="font-bold text-white">{it.productName}</h5>
                      <p className="text-[11px] text-neutral-400">
                        Qty: {it.quantity} · Recipient: <span className="text-[#D4AF37] font-mono">{it.telegramUsername}</span>
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#F5E6B8] tabular-nums">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-300">
            <div className="p-4 rounded-xl bg-[#08080C] border border-white/5 space-y-1">
              <span className="text-neutral-500 block">Payment Method</span>
              <span className="font-semibold text-white capitalize">
                {foundOrder.paymentMethod === 'binance' ? 'Binance Pay Transfer' : 'USDT BEP20'}
              </span>
              {foundOrder.txId && (
                <p className="text-[11px] font-mono text-neutral-400 truncate mt-1">
                  TxID: {foundOrder.txId}
                </p>
              )}
              {foundOrder.binanceSenderId && (
                <p className="text-[11px] font-mono text-neutral-400 mt-1">
                  Binance Sender: {foundOrder.binanceSenderId}
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#08080C] border border-white/5 space-y-1">
              <span className="text-neutral-500 block">Customer Support</span>
              <span className="font-semibold text-white">Yasser Direct Line</span>
              <a
                href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:underline font-medium text-xs mt-1"
              >
                <span>@{BUSINESS_INFO.telegramSupport}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Admin notes if any */}
          {foundOrder.adminNote && (
            <div className="p-4 rounded-xl bg-[#14141E] border border-[#D4AF37]/30 text-xs">
              <span className="text-[#D4AF37] font-semibold block mb-1">Store Dispatch Note:</span>
              <p className="text-neutral-200">{foundOrder.adminNote}</p>
            </div>
          )}
        </div>
      ) : hasSearched ? (
        <div className="py-12 text-center text-neutral-400 p-8 rounded-3xl bg-[#0F0F16] border border-white/5">
          <p className="text-sm mb-4">{t.orderNotFound}</p>
          <a
            href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline"
          >
            <span>Ask @{BUSINESS_INFO.telegramSupport} for assistance</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : null}
    </div>
  );
};

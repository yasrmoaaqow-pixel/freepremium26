import React, { useState } from 'react';
import {
  ShieldCheck,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  FileCheck,
  ShoppingBag,
  ExternalLink,
  Info
} from 'lucide-react';
import { CartItem, Language, PaymentMethod, Order, Coupon } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';
import { QRCodeDisplay } from './QRCodeDisplay';

interface CheckoutViewProps {
  cart: CartItem[];
  lang: Language;
  showDZD: boolean;
  appliedCoupon: Coupon | null;
  onOrderCreated: (newOrder: Order) => void;
  onBackToShopping: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  lang,
  showDZD,
  appliedCoupon,
  onOrderCreated,
  onBackToShopping,
}) => {
  const t = translations[lang];

  // Primary recipient username
  const initialUsername = cart[0]?.telegramUsername || '';
  const [telegramUsername, setTelegramUsername] = useState(initialUsername);
  const [usernameError, setUsernameError] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('binance');

  // Proof submission
  const [txId, setTxId] = useState('');
  const [binanceSenderId, setBinanceSenderId] = useState('');
  const [receiptDataUrl, setReceiptDataUrl] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [customerNote, setCustomerNote] = useState('');

  // UI status
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountUSD = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const totalUSD = Math.max(0, subtotal - discountUSD);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let cleanUser = telegramUsername.trim();
    if (!cleanUser) {
      cleanUser = cart[0]?.telegramUsername || '';
    }
    if (!cleanUser || cleanUser.replace('@', '').length < 3) {
      setUsernameError(t.telegramUsernameRequired);
      return;
    }
    if (!cleanUser.startsWith('@')) {
      cleanUser = '@' + cleanUser;
    }

    if (!txId.trim() && !receiptDataUrl && !binanceSenderId.trim()) {
      alert(lang === 'ar' ? 'يرجى إدخال رقم المعاملة أو كود بايننس أو رفع إيصال الدفع للمتابعة.' : 'Please provide either a Transaction ID, Binance Pay ID, or upload a payment receipt.');
      return;
    }

    setSubmitting(true);

    // Generate unique order ID: YP-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `YP-${randomNum}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      telegramUsername: cleanUser,
      items: cart.map((c) => ({
        productId: c.product.id,
        productName: lang === 'ar' ? c.product.nameAr : lang === 'fr' ? c.product.nameFr : c.product.name,
        type: c.product.type,
        quantity: c.quantity,
        price: c.product.price,
        telegramUsername: c.telegramUsername || cleanUser,
        details: c.product.type === 'premium' ? `${c.product.durationMonths} Months` : `${c.product.starsCount} Stars`,
      })),
      subtotalUSD: subtotal,
      discountUSD,
      couponCode: appliedCoupon?.code,
      totalUSD,
      paymentMethod,
      txId: txId.trim() || undefined,
      binanceSenderId: binanceSenderId.trim() || undefined,
      receiptDataUrl: receiptDataUrl || undefined,
      receiptFileName: receiptFileName || undefined,
      status: 'verifying',
      customerNote: customerNote.trim() || undefined,
    };

    setTimeout(() => {
      setSubmitting(false);
      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
    }, 600);
  };

  // If order was successfully created, show confirmation view
  if (createdOrder) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/40 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-5 text-[#0A0A0E] shadow-lg">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
            {t.orderSuccessTitle}
          </h2>
          <p className="text-sm text-neutral-300 max-w-md mx-auto mb-6">
            {t.orderSuccessDesc}
          </p>

          <div className="p-4 rounded-2xl bg-[#08080C] border border-[#D4AF37]/30 mb-6 inline-block">
            <span className="text-xs text-neutral-400 block mb-1">{t.yourOrderId}</span>
            <span className="font-mono text-2xl font-black text-[#F5E6B8] tracking-widest">
              {createdOrder.id}
            </span>
          </div>

          <div className="text-xs text-neutral-400 space-y-1 mb-8">
            <p>Target Account: <span className="text-[#D4AF37] font-semibold">{createdOrder.telegramUsername}</span></p>
            <p>Amount Paid: <span className="text-white font-mono font-bold">${createdOrder.totalUSD.toFixed(2)} USD</span></p>
            <p>Method: <span className="text-neutral-200 capitalize">{createdOrder.paymentMethod === 'binance' ? 'Binance Pay' : 'USDT BEP20'}</span></p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onBackToShopping()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
            >
              {t.trackOrderCta}
            </button>

            <a
              href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#171722] border border-white/10 text-neutral-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Contact Support @{BUSINESS_INFO.telegramSupport}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back to store */}
      <button
        onClick={onBackToShopping}
        className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Store</span>
      </button>

      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
          {t.checkoutTitle}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Official Direct Delivery • No Password Required
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment & Proof Submission Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Recipient Telegram Username */}
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h3 className="text-sm font-bold text-white">{t.recipientDetails}</h3>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {t.enterTelegramUsername} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => {
                  let v = e.target.value.trim();
                  if (v && !v.startsWith('@')) v = '@' + v;
                  setTelegramUsername(v);
                  if (usernameError) setUsernameError('');
                }}
                placeholder="@username (e.g. @yasser_fr)"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                required
              />
              {usernameError && (
                <p className="text-[11px] text-red-400 mt-1">{usernameError}</p>
              )}
              <p className="text-[11px] text-neutral-500 mt-1.5">{t.usernameHelp}</p>
            </div>
          </div>

          {/* Step 2: Choose Payment Method */}
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="text-sm font-bold text-white">{t.paymentSelection}</h3>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setPaymentMethod('binance')}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  paymentMethod === 'binance'
                    ? 'bg-[#181824] border-[#D4AF37] shadow-lg'
                    : 'bg-[#09090D] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Binance Pay</span>
                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">0% FEE</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  User-to-user ID transfer via Binance App
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('usdt_bep20')}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  paymentMethod === 'usdt_bep20'
                    ? 'bg-[#181824] border-[#D4AF37] shadow-lg'
                    : 'bg-[#09090D] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">USDT (BEP20)</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">BSC</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  BNB Smart Chain cryptocurrency transfer
                </p>
              </button>
            </div>

            {/* Payment Details Container */}
            <div className="p-5 rounded-2xl bg-[#08080C] border border-[#D4AF37]/25 space-y-5">
              {paymentMethod === 'binance' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {t.binanceIdLabel}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      Nickname: {BUSINESS_INFO.binanceNickname}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#14141C] border border-white/10">
                    <span className="font-mono text-base font-bold text-[#F5E6B8] flex-1">
                      {BUSINESS_INFO.binanceId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BUSINESS_INFO.binanceId, 'binanceId')}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'binanceId' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'binanceId' ? t.copiedText : t.copyButton}</span>
                    </button>
                  </div>

                  {/* QR Code */}
                  <div className="mt-4 flex flex-col items-center">
                    <QRCodeDisplay value={BUSINESS_INFO.binanceId} size={150} label="Binance Pay ID: 986517873" />
                  </div>
                </div>
              ) : (
                <div>
                  {/* Critical Network Warning */}
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 text-amber-200 text-xs mb-4">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-semibold mb-0.5">
                        NETWORK: {BUSINESS_INFO.usdtNetwork}
                      </strong>
                      <span>{t.networkWarning}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      {t.walletLabel}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400">
                      BEP20 / BSC Only
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-[#14141C] border border-white/10">
                    <span className="font-mono text-xs text-[#F5E6B8] break-all flex-1">
                      {BUSINESS_INFO.usdtAddress}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(BUSINESS_INFO.usdtAddress, 'usdtAddress')}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedKey === 'usdtAddress' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'usdtAddress' ? t.copiedText : t.copyButton}</span>
                    </button>
                  </div>

                  {/* QR Code */}
                  <div className="mt-4 flex flex-col items-center">
                    <QRCodeDisplay value={BUSINESS_INFO.usdtAddress} size={150} label="USDT BEP20 Address" />
                  </div>
                </div>
              )}

              {/* Exact Amount Highlight */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-400">{t.amountToPay}</span>
                <span className="text-lg font-mono font-black text-[#F5E6B8] tabular-nums">
                  ${totalUSD.toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Proof Submission Form */}
          <form onSubmit={handleSubmitOrder} className="p-6 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-lg space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="text-sm font-bold text-white">{t.proofSubmission}</h3>
            </div>

            {paymentMethod === 'binance' ? (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Sender Binance ID or Order ID
                </label>
                <input
                  type="text"
                  value={binanceSenderId}
                  onChange={(e) => setBinanceSenderId(e.target.value)}
                  placeholder="e.g. 782910482 or BP-88219412"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  {t.txIdLabel}
                </label>
                <input
                  type="text"
                  value={txId}
                  onChange={(e) => setTxId(e.target.value)}
                  placeholder={t.txIdPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            )}

            {/* Receipt Upload */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                {t.uploadReceipt}
              </label>
              <div className="relative border-2 border-dashed border-white/10 hover:border-[#D4AF37]/50 rounded-2xl p-4 text-center bg-[#08080C] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {receiptDataUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={receiptDataUrl}
                      alt="Receipt preview"
                      className="w-12 h-12 object-cover rounded-lg border border-[#D4AF37]/40"
                    />
                    <div className="text-left">
                      <p className="text-xs text-white font-medium truncate max-w-xs">{receiptFileName}</p>
                      <span className="text-[10px] text-emerald-400">✓ Receipt attached successfully</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-5 h-5 mx-auto text-[#D4AF37]" />
                    <p className="text-xs text-neutral-300 font-medium">{t.dragReceipt}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Note */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Additional Instructions / Notes (Optional)
              </label>
              <input
                type="text"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. Please activate as an official gift link"
                className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 disabled:opacity-50 text-xs font-bold text-[#0A0A0E] tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {submitting ? (
                <span>{t.submittingOrder}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.confirmOrderButton}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary & Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0E0E14] border border-white/10 shadow-lg">
            <h3 className="font-cinzel text-base font-bold text-white mb-4 pb-3 border-b border-white/10">
              {t.orderSummary}
            </h3>

            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-xs">
                  <div>
                    <h5 className="font-semibold text-white">
                      {lang === 'ar' ? item.product.nameAr : lang === 'fr' ? item.product.nameFr : item.product.name}
                    </h5>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Qty: {item.quantity} · For: <span className="text-[#D4AF37]">{item.telegramUsername || telegramUsername || 'Pending'}</span>
                    </p>
                  </div>
                  <span className="font-mono font-bold text-[#F5E6B8] tabular-nums">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>{t.subtotal}</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>{t.discount} ({appliedCoupon?.code})</span>
                  <span className="font-mono tabular-nums">-${discountUSD.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span className="font-cinzel">{t.total}</span>
                <span className="font-mono text-xl text-[#F5E6B8] tabular-nums">
                  ${totalUSD.toFixed(2)} USD
                </span>
              </div>

              {showDZD && (
                <div className="flex justify-between text-xs text-neutral-400 pt-1">
                  <span>{t.currencyDZDNote}</span>
                  <span className="font-mono font-bold text-neutral-200">
                    {Math.round(totalUSD * BUSINESS_INFO.dzdExchangeRate).toLocaleString()} DZD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Security & Support Guarantee */}
          <div className="p-5 rounded-2xl bg-[#09090E] border border-[#D4AF37]/20 space-y-3 text-xs text-neutral-300">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Guaranteed Official Service</span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Orders are fulfilled through legitimate Telegram gift links. Your Telegram password is never requested, keeping your personal account completely safe and secure.
            </p>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">Need urgent help?</span>
              <a
                href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] hover:underline font-medium"
              >
                Telegram: @{BUSINESS_INFO.telegramSupport}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

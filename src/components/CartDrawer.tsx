import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, AlertCircle } from 'lucide-react';
import { CartItem, Language, Coupon } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';
import { TelegramPremiumArtwork, TelegramStarsArtwork } from './LuxuryVisuals';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onProceedCheckout: () => void;
  lang: Language;
  showDZD: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedCheckout,
  lang,
  showDZD,
}) => {
  const t = translations[lang];
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponMsg, setCouponMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const ok = onApplyCoupon(couponCode.trim().toUpperCase());
    if (ok) {
      setCouponError(false);
      setCouponMsg(t.couponSuccess);
      setCouponCode('');
    } else {
      setCouponError(true);
      setCouponMsg(t.couponInvalid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D0D12] border-l border-[#D4AF37]/20 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-cinzel text-lg font-bold text-white tracking-wide">
                {t.cart} ({cart.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-neutral-400">
                <ShoppingBag className="w-12 h-12 mx-auto text-neutral-600 mb-3" />
                <p className="text-sm">{t.cartEmpty}</p>
              </div>
            ) : (
              cart.map((item) => {
                const name = lang === 'ar' ? item.product.nameAr : lang === 'fr' ? item.product.nameFr : item.product.name;
                const itemTotal = item.product.price * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#14141C] border border-white/5 flex gap-3.5 items-center justify-between"
                  >
                    <div className="shrink-0">
                      {item.product.type === 'premium' ? (
                        <TelegramPremiumArtwork size="sm" />
                      ) : (
                        <TelegramStarsArtwork size="sm" count={item.product.starsCount} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{name}</h4>
                      <p className="text-[11px] font-mono text-[#D4AF37] mt-0.5">
                        Target: <span className="text-neutral-200">{item.telegramUsername}</span>
                      </p>
                      <div className="text-xs font-mono font-bold text-[#F5E6B8] mt-1 tabular-nums">
                        ${itemTotal.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-1.5 bg-[#08080C] px-2 py-0.5 rounded-lg border border-white/10 text-xs font-mono">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-neutral-400 hover:text-white px-1"
                        >
                          -
                        </button>
                        <span className="text-white px-1 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-neutral-400 hover:text-white px-1"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-[#09090E] space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-[#141814] border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedCoupon.code} (-{appliedCoupon.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-neutral-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={t.couponPlaceholder}
                      className="flex-1 px-3 py-2 rounded-xl bg-[#14141C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-[#1C1C28] hover:bg-[#252536] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] transition-colors"
                    >
                      {t.applyCoupon}
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] mt-1 ${couponError ? 'text-red-400' : 'text-emerald-400'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-neutral-300">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>{t.discount}</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                  <span className="font-cinzel">{t.total}</span>
                  <span className="font-mono text-base text-[#F5E6B8] tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {showDZD && (
                  <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
                    <span>{t.currencyDZDNote}</span>
                    <span className="font-mono font-medium text-neutral-300">
                      {Math.round(total * BUSINESS_INFO.dzdExchangeRate).toLocaleString()} DZD
                    </span>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onProceedCheckout();
                  onClose();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-xs font-bold text-[#0A0A0E] tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

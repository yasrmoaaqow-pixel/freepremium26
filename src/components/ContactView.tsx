import React, { useState } from 'react';
import { Send, ExternalLink, ShieldCheck, Clock, MessageSquare, Check, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';

interface ContactViewProps {
  lang: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Direct Operator Line</span>
          <span aria-hidden="true">·</span>
          <span>Average reply &lt; 2 minutes</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          {t.contactTitle}
        </h1>
        <p className="text-sm text-neutral-400">
          {t.contactSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Telegram Connection Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#14141E] to-[#0A0A0F] border border-[#D4AF37]/30 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <MessageSquare className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs text-[#D4AF37] font-semibold tracking-wider uppercase block">
                {t.telegramDirect}
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-white mt-1">
                @{BUSINESS_INFO.telegramSupport}
              </h3>
              <p className="text-xs text-neutral-400 mt-2">
                Fastest response channel for order verification, custom bulk purchases, and instant support.
              </p>
            </div>

            <a
              href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-[#0A0A0E] font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span>{t.contactDirectCta}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-neutral-400 text-left">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Operating Hours: 24/7 (Always Available)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Region: Algeria 🇩🇿 & Worldwide 🌍</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Web Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-[#0F0F16] border border-white/10 shadow-xl">
            <h3 className="font-cinzel text-lg font-bold text-white mb-2">
              {t.contactFormTitle}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Leave a note and our support agents will contact you on Telegram promptly.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#08080C] border border-[#D4AF37]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-base font-bold text-white">{t.messageSent}</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  We have forwarded your inquiry to @{BUSINESS_INFO.telegramSupport}. You may also ping us directly anytime.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#171722] text-xs font-semibold text-[#D4AF37] hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t.yourName} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Walid M."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      {t.yourTelegram}
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@your_username"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {t.yourMessage} <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, order question, or bulk request..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-98 text-xs font-bold text-[#0A0A0E] tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendMessage}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

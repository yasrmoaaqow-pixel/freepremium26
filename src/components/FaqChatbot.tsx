import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';

interface FaqChatbotProps {
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const FaqChatbot: React.FC<FaqChatbotProps> = ({ lang }) => {
  const t = translations[lang];

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Chatbot conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text:
        lang === 'ar'
          ? 'مرحباً بك في متجر ياسر بريميوم! أنا المساعد الآلي. كيف يمكنني مساعدتك بخصوص تفعيل تيليجرام بريميوم أو النجوم أو الدفع؟'
          : lang === 'fr'
          ? 'Bienvenue sur YASSER PREMIUM ! Je suis votre assistant virtuel. Comment puis-je vous aider pour vos commandes ou paiements ?'
          : 'Welcome to YASSER PREMIUM! I am your 24/7 store assistant. How can I help you with Telegram Premium, Stars, or payments today?',
      time: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');

  const faqItems = [
    {
      qEn: 'Do you need my Telegram password or login code?',
      qAr: 'هل تحتاجون لكلمة السر أو كود تسجيل الدخول لحسابي؟',
      qFr: 'Avez-vous besoin de mon mot de passe Telegram ?',
      aEn: 'Never! We activate Telegram Premium and send Telegram Stars strictly as official Telegram Gifts directly to your @username. We will never ask for your password, phone number, or SMS code.',
      aAr: 'أبداً ومستحيل! نحن نقوم بتفعيل تيليجرام بريميوم وشحن النجوم عن طريق نظام الهدايا الرسمي المباشر إلى معرفك (@username) فقط. لا نطلب كلمة المرور أو رقم الهاتف نهائياً.',
      aFr: 'Jamais ! Nous activons Telegram Premium et les Étoiles via le système officiel de cadeaux Telegram directement sur votre @pseudo. Aucun mot de passe ni code SMS n’est demandé.'
    },
    {
      qEn: 'How long does order delivery take?',
      qAr: 'كم يستغرق استلام وتفعيل الطلب؟',
      qFr: 'Quel est le délai de livraison de la commande ?',
      aEn: 'Orders are processed instantly once your payment proof is submitted. Binance Pay payments are typically verified within 2 to 5 minutes, 24/7.',
      aAr: 'تتم معالجة الطلبات فورياً بمجرد إرسال إثبات الدفع. عمليات التحويل عبر بايننس يتم تأكيدها خلال 2 إلى 5 دقائق على مدار 24 ساعة.',
      aFr: 'Les commandes sont traitées instantanément dès réception de la preuve. Les paiements Binance Pay sont vérifiés en 2 à 5 minutes 24h/24.'
    },
    {
      qEn: 'Which cryptocurrency network should I use for USDT?',
      qAr: 'ما هي الشبكة التي يجب استخدامها عند الدفع بـ USDT؟',
      qFr: 'Quel réseau dois-je utiliser pour le paiement en USDT ?',
      aEn: 'You must use BNB Smart Chain (BEP20 / BSC). Do NOT use TRC20 or ERC20. Sending on the wrong network will result in unrecoverable funds.',
      aAr: 'يجب التحويل حصراً عبر شبكة BNB Smart Chain (BEP20 / BSC). لا تستخدم شبكة TRC20 أو ERC20 لتفادي ضياع الأموال.',
      aFr: 'Vous devez obligatoirement utiliser le réseau BNB Smart Chain (BEP20 / BSC). N’utilisez pas TRC20 ou ERC20.'
    },
    {
      qEn: 'How does Binance Pay user transfer work?',
      qAr: 'كيف يعمل التحويل الداخلي عبر بايننس بدون رسوم؟',
      qFr: 'Comment fonctionne le transfert Binance Pay sans frais ?',
      aEn: 'Inside the Binance App, go to Pay > Send > Binance ID and enter 986517873. It is instant and free of any network transfer fees.',
      aAr: 'داخل تطبيق Binance، اضغط على Pay ثم Send واختر Binance ID وأدخل المعرف: 986517873. التحويل فوري وبدون أي رسوم.',
      aFr: 'Sur l’application Binance, allez dans Pay > Envoyer > Binance ID et saisissez 986517873. C’est instantané et sans aucun frais.'
    },
    {
      qEn: 'What can I do with Telegram Stars?',
      qAr: 'فيم تُستخدم نجوم تيليجرام (Telegram Stars)؟',
      qFr: 'À quoi servent les Étoiles Telegram (Stars) ?',
      aEn: 'Telegram Stars are the official currency for Telegram bots, mini-apps, exclusive channel subscriptions, and digital media purchases.',
      aAr: 'نجوم تيليجرام هي العملة الرسمية المعتمدة لشراء ترقيات ألعاب وتطبيقات تيليجرام المصغرة ودعم القنوات والمبدعين.',
      aFr: 'Les Étoiles sont la monnaie officielle pour débloquer des contenus sur les mini-apps, bots et canaux Telegram.'
    }
  ];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userText = inputQuestion.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputQuestion('');

    // Knowledge matching logic
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = '';

      if (lower.includes('password') || lower.includes('pass') || lower.includes('كلمة السر') || lower.includes('mot de passe')) {
        reply = lang === 'ar'
          ? 'لا، نحن لا نطلب أي كلمة مرور نهائياً! يتم التفعيل رسمياً عبر معرف حسابك @username فقط.'
          : lang === 'fr'
          ? 'Non, nous ne demandons AUCUN mot de passe. Tout est activé comme cadeau officiel via votre @pseudo.'
          : 'No password is required! We deliver 100% official gift links directly using only your Telegram @username.';
      } else if (lower.includes('binance') || lower.includes('pay id') || lower.includes('بايننس')) {
        reply = lang === 'ar'
          ? `معرف بايننس الخاص بنا هو ${BUSINESS_INFO.binanceId}. التحويل يتم في ثوانٍ بدون أي رسوم عبر تطبيق بايننس.`
          : `Our official Binance Pay ID is ${BUSINESS_INFO.binanceId}. Transfers are instant and zero fee inside the Binance app.`;
      } else if (lower.includes('usdt') || lower.includes('network') || lower.includes('شبكة') || lower.includes('bep20')) {
        reply = lang === 'ar'
          ? `تنبيه مهم: عنوان USDT الخاص بنا يعمل فقط على شبكة BNB Smart Chain (BEP20): ${BUSINESS_INFO.usdtAddress}`
          : `Important: Our USDT address is on BNB Smart Chain (BEP20) only: ${BUSINESS_INFO.usdtAddress}`;
      } else if (lower.includes('dzd') || lower.includes('دينار') || lower.includes('algeria') || lower.includes('جزائر')) {
        reply = lang === 'ar'
          ? 'نعم! نحن متجر جزائري 🇩🇿 يقدم خدماته للمواطنين في الجزائر وحول العالم بأسعار تنافسية بالدولار ومكافئها بالدينار الجزائري عبر بايننس P2P.'
          : 'Yes, we are proudly based in Algeria 🇩🇿 serving both local and worldwide clients with best crypto rates!';
      } else if (lower.includes('how long') || lower.includes('time') || lower.includes('متى') || lower.includes('وقت') || lower.includes('délai')) {
        reply = lang === 'ar'
          ? 'التسليم فوري خلال 2 إلى 5 دقائق من تأكيد عملية التحويل، ويعمل فريقنا على مدار 24 ساعة بدون انقطاع.'
          : 'Activation takes typically 2 to 5 minutes after submitting your payment reference. Our team operates 24/7!';
      } else {
        reply = lang === 'ar'
          ? `شكراً لسؤالك! لمعالجة أي استفسار خاص، يمكنك مراسلة ياسر مباشرة على تيليجرام: @${BUSINESS_INFO.telegramSupport}`
          : `Thanks for asking! For custom inquiries or instant assistance, you can message Yasser directly on Telegram: @${BUSINESS_INFO.telegramSupport}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 400);
  };

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
          <span>Knowledge & Support Hub</span>
          <span aria-hidden="true">·</span>
          <span>Instant Answers</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-cinzel text-white mb-3">
          {t.faqTitle}
        </h2>
        <p className="text-sm text-neutral-400">
          {t.faqSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            const q = lang === 'ar' ? item.qAr : lang === 'fr' ? item.qFr : item.qEn;
            const a = lang === 'ar' ? item.aAr : lang === 'fr' ? item.aFr : item.aEn;

            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0F0F16] border border-white/5 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm font-bold text-white leading-snug">{q}</span>
                  <div className="w-6 h-6 rounded-lg bg-[#181822] flex items-center justify-center text-[#D4AF37] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-white/5">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: 24/7 Interactive FAQ Assistant Chatbot */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/30 shadow-2xl flex flex-col h-[480px] overflow-hidden">
            {/* Chatbot Header */}
            <div className="p-4 bg-[#14141E] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6514] flex items-center justify-center text-[#0A0A0E]">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{t.faqChatbotTitle}</span>
                  </h4>
                  <span className="text-[10px] text-[#D4AF37] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Live 24/7 Assistant
                  </span>
                </div>
              </div>

              <a
                href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-[#F5E6B8] hover:underline flex items-center gap-1"
              >
                <span>@{BUSINESS_INFO.telegramSupport}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#09090D]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] font-medium'
                        : 'bg-[#151520] text-neutral-200 border border-white/5'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2 bg-[#0C0C12] border-t border-white/5 flex gap-1.5 overflow-x-auto text-[10px]">
              <button
                type="button"
                onClick={() => setInputQuestion('Do you need my password?')}
                className="px-2 py-1 rounded-lg bg-[#181822] text-neutral-300 hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                Password needed?
              </button>
              <button
                type="button"
                onClick={() => setInputQuestion('How do I pay on Binance?')}
                className="px-2 py-1 rounded-lg bg-[#181822] text-neutral-300 hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                Binance ID?
              </button>
              <button
                type="button"
                onClick={() => setInputQuestion('What is your USDT address?')}
                className="px-2 py-1 rounded-lg bg-[#181822] text-neutral-300 hover:text-[#D4AF37] whitespace-nowrap cursor-pointer"
              >
                USDT BEP20?
              </button>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-[#12121A] border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder={t.faqInputPlaceholder}
                className="flex-1 px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0A0A0E] text-xs font-bold transition-all hover:brightness-110 active:scale-95 cursor-pointer flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

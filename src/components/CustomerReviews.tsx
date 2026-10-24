import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquare, Check, Plus } from 'lucide-react';
import { CustomerReview, Language } from '../types';
import { translations } from '../translations';

interface CustomerReviewsProps {
  reviews: CustomerReview[];
  onAddReview: (review: CustomerReview) => void;
  lang: Language;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  onAddReview,
  lang,
}) => {
  const t = translations[lang];
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Algiers, Algeria 🇩🇿');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [productBought, setProductBought] = useState('Telegram Premium 12 Months');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      usernameMasked: `@${name.slice(0, 3).toLowerCase()}***`,
      location: location.trim(),
      rating,
      comment: comment.trim(),
      commentAr: lang === 'ar' ? comment.trim() : undefined,
      commentFr: lang === 'fr' ? comment.trim() : undefined,
      productName: productBought,
      date: 'Just now',
      verified: true,
    };

    onAddReview(newRev);
    setShowAddForm(false);
    setName('');
    setComment('');
  };

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
            <span>Verified Customer Feedback</span>
            <span aria-hidden="true">·</span>
            <span>100% Satisfaction</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t.reviewsTitle}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            {t.reviewsSub}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-xl bg-[#14141E] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold text-[#F5E6B8] transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Submission Modal / Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-10 p-6 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/40 shadow-xl space-y-4 max-w-xl">
          <h3 className="font-cinzel text-sm font-bold text-white">Share Your Store Experience</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Yacine K."
                className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Oran, Algeria 🇩🇿"
                className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Product Purchased</label>
              <select
                value={productBought}
                onChange={(e) => setProductBought(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Telegram Premium 12 Months">Telegram Premium 12 Months</option>
                <option value="Telegram Premium 6 Months">Telegram Premium 6 Months</option>
                <option value="Telegram Premium 3 Months">Telegram Premium 3 Months</option>
                <option value="250 Telegram Stars">250 Telegram Stars</option>
                <option value="100 Telegram Stars">100 Telegram Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-neutral-400 mb-1">Rating</label>
              <div className="flex items-center gap-1.5 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Review Comment</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others how fast and smooth your Telegram activation was..."
              className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-neutral-400 text-xs hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold transition-colors cursor-pointer"
            >
              Publish Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((rev) => {
          const commentText =
            lang === 'ar' && rev.commentAr
              ? rev.commentAr
              : lang === 'fr' && rev.commentFr
              ? rev.commentFr
              : rev.comment;

          return (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#0F0F16] border border-white/5 hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-neutral-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic mb-4">
                  "{commentText}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rev.name}</span>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.verifiedCustomer}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                  <span>{rev.location}</span>
                  <span>{rev.date}</span>
                </div>
                <div className="text-[10px] text-[#D4AF37] font-mono mt-1">
                  {rev.productName}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

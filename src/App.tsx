import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, Coupon, CustomerReview, Language, OrderStatus } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_ORDERS,
  BUSINESS_INFO,
} from './data/initialData';
import { translations } from './translations';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PremiumPackages } from './components/PremiumPackages';
import { StarsPackages } from './components/StarsPackages';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { TrackOrderView } from './components/TrackOrderView';
import { PaymentInstructionsView } from './components/PaymentInstructionsView';
import { SpecialOffersView } from './components/SpecialOffersView';
import { FaqChatbot } from './components/FaqChatbot';
import { CustomerReviews } from './components/CustomerReviews';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Star
} from 'lucide-react';

export default function App() {
  // Localization
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('yp_lang');
    return (saved as Language) || 'en';
  });

  // Currency conversion display helper (USD default + optional DZD)
  const [showDZD, setShowDZD] = useState<boolean>(() => {
    return localStorage.getItem('yp_show_dzd') === 'true';
  });

  // Current view/page
  const [currentView, setCurrentView] = useState<string>('home');

  // Products state (editable by Admin)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('yp_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('yp_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Active coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Available coupons list (editable by Admin)
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('yp_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Orders list (editable by Admin, viewable by Track My Order)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('yp_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Reviews list
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    const saved = localStorage.getItem('yp_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Cart Drawer open/close
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin dashboard open/close
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize language and text direction
  useEffect(() => {
    localStorage.setItem('yp_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Synchronize DZD preference
  useEffect(() => {
    localStorage.setItem('yp_show_dzd', showDZD.toString());
  }, [showDZD]);

  // Save cart
  useEffect(() => {
    localStorage.setItem('yp_cart', JSON.stringify(cart));
  }, [cart]);

  // Save orders
  useEffect(() => {
    localStorage.setItem('yp_orders', JSON.stringify(orders));
  }, [orders]);

  // Save products
  useEffect(() => {
    localStorage.setItem('yp_products', JSON.stringify(products));
  }, [products]);

  // Save coupons
  useEffect(() => {
    localStorage.setItem('yp_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Save reviews
  useEffect(() => {
    localStorage.setItem('yp_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Listen to URL hash for direct links (e.g. #admin, #premium, #stars, #track, #contact)
  useEffect(() => {
    const handleHashRouting = () => {
      const rawHash = (window.location.hash || '').toLowerCase().replace('#', '').trim();
      if (rawHash === 'admin' || rawHash === 'login' || rawHash === 'admin-login') {
        setIsAdminOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (rawHash === 'premium' || rawHash === 'stars' || rawHash === 'offers' || rawHash === 'track' || rawHash === 'instructions' || rawHash === 'contact' || rawHash === 'checkout') {
        setIsAdminOpen(false);
        setCurrentView(rawHash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (rawHash === 'home') {
        setIsAdminOpen(false);
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleHashRouting();
    window.addEventListener('hashchange', handleHashRouting);
    return () => window.removeEventListener('hashchange', handleHashRouting);
  }, []);

  // Cart Handlers
  const handleAddToCart = (product: Product, username: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (it) => it.product.id === product.id && it.telegramUsername === username
      );
      if (existing) {
        return prev.map((it) =>
          it.id === existing.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          quantity: 1,
          telegramUsername: username,
        },
      ];
    });
    showToast(translations[lang].addedToCart);
    setIsCartOpen(true);
  };

  const handleInstantBuy = (product: Product, username: string) => {
    setCart([
      {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        product,
        quantity: 1,
        telegramUsername: username,
      },
    ]);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleApplyCoupon = (code: string): boolean => {
    const found = coupons.find((c) => c.code === code && c.active);
    if (found) {
      setAppliedCoupon(found);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Order creation from checkout
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after order placed
    setAppliedCoupon(null);
    showToast(`Order #${newOrder.id} successfully recorded!`);
  };

  // Admin actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, adminNote?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: newStatus,
            adminNote: adminNote || o.adminNote,
            verifiedAt: newStatus === 'processing' || newStatus === 'completed' ? new Date().toISOString() : o.verifiedAt,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : o.completedAt,
          };
        }
        return o;
      })
    );
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const handleUpdateProductPrice = (productId: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    showToast('Product price updated');
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Coupon ${newCoupon.code} created`);
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} deleted`);
  };

  const handleAddReview = (newRev: CustomerReview) => {
    setReviews((prev) => [newRev, ...prev]);
    showToast('Review submitted! Thank you.');
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#14141E] border border-[#D4AF37]/60 shadow-[0_0_25px_rgba(212,175,55,0.35)] flex items-center gap-2.5 text-xs font-bold text-[#F5E6B8] animate-bounce">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Telegram Support Quick Bridge */}
      <a
        href={`https://t.me/${BUSINESS_INFO.telegramSupport}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:brightness-110 active:scale-95 text-[#0A0A0E] font-bold text-xs shadow-2xl flex items-center gap-2 transition-all cursor-pointer border border-[#FFF3B0]/40"
        aria-label="Direct Telegram Support"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline font-mono">@{BUSINESS_INFO.telegramSupport}</span>
      </a>

      {/* Top Bar Header */}
      <Header
        currentView={isAdminOpen ? 'admin' : currentView}
        onNavigate={(view) => {
          setIsAdminOpen(false);
          setCurrentView(view);
          window.location.hash = view === 'home' ? '' : view;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
        onSelectLang={(l) => setLang(l)}
        showDZD={showDZD}
        onToggleDZD={() => setShowDZD(!showDZD)}
        isAdmin={isAdminOpen}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminOpen ? (
          <AdminDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            products={products}
            onUpdateProductPrice={handleUpdateProductPrice}
            coupons={coupons}
            onAddCoupon={handleAddCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            lang={lang}
            onClose={() => {
              setIsAdminOpen(false);
              window.location.hash = '';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'checkout' ? (
          <CheckoutView
            cart={cart}
            lang={lang}
            showDZD={showDZD}
            appliedCoupon={appliedCoupon}
            onOrderCreated={handleOrderCreated}
            onBackToShopping={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'premium' ? (
          <div className="py-8">
            <PremiumPackages
              products={products}
              lang={lang}
              showDZD={showDZD}
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
            />
            {/* Feature comparison table */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
              <div className="p-8 rounded-3xl bg-[#0F0F16] border border-white/10 shadow-xl space-y-6">
                <h3 className="font-cinzel text-xl font-bold text-white text-center">
                  Why Upgrade to Telegram Premium?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-300">
                  <div className="p-4 rounded-2xl bg-[#09090D] border border-white/5 space-y-1.5">
                    <span className="text-[#D4AF37] font-bold block">4GB Massive Uploads</span>
                    <p className="text-neutral-400">Send huge 4K videos, zip files, and documents with zero compression restrictions.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090D] border border-white/5 space-y-1.5">
                    <span className="text-[#D4AF37] font-bold block">Voice to Text Audio</span>
                    <p className="text-neutral-400">Instantly transcribe voice notes and video messages to readable text in real-time.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#09090D] border border-white/5 space-y-1.5">
                    <span className="text-[#D4AF37] font-bold block">Ad-Free Experience</span>
                    <p className="text-neutral-400">Browse public Telegram channels without any sponsored advertisements or promos.</p>
                  </div>
                </div>
              </div>
            </div>
            <FaqChatbot lang={lang} />
          </div>
        ) : currentView === 'stars' ? (
          <div className="py-8">
            <StarsPackages
              products={products}
              lang={lang}
              showDZD={showDZD}
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
            />
            <FaqChatbot lang={lang} />
          </div>
        ) : currentView === 'offers' ? (
          <SpecialOffersView
            lang={lang}
            products={products}
            onAddToCart={handleAddToCart}
            onInstantBuy={handleInstantBuy}
          />
        ) : currentView === 'track' ? (
          <TrackOrderView orders={orders} lang={lang} />
        ) : currentView === 'instructions' ? (
          <PaymentInstructionsView
            lang={lang}
            onGoToShop={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'contact' ? (
          <ContactView lang={lang} />
        ) : (
          /* Default HOME View */
          <div>
            {/* Hero Section */}
            <Hero
              lang={lang}
              onExplorePremium={() => {
                const el = document.getElementById('premium-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('premium');
              }}
              onExploreStars={() => {
                const el = document.getElementById('stars-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('stars');
              }}
            />

            {/* Telegram Premium Packages */}
            <PremiumPackages
              products={products}
              lang={lang}
              showDZD={showDZD}
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
            />

            {/* Telegram Stars Packages */}
            <StarsPackages
              products={products}
              lang={lang}
              showDZD={showDZD}
              onAddToCart={handleAddToCart}
              onInstantBuy={handleInstantBuy}
            />

            {/* How It Works (Clean 4 Steps Process) */}
            <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#D4AF37] tracking-widest uppercase mb-2">
                  <span>Seamless Ordering</span>
                  <span aria-hidden="true">·</span>
                  <span>Instant Verification</span>
                </div>
                <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
                  {t.howItWorksTitle}
                </h2>
                <p className="text-sm text-neutral-400">
                  {t.howItWorksSub}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Step 1 */}
                <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center font-mono font-bold text-base text-[#D4AF37]">
                    01
                  </div>
                  <h3 className="text-base font-bold text-white">{t.step1Title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t.step1Desc}</p>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center font-mono font-bold text-base text-[#D4AF37]">
                    02
                  </div>
                  <h3 className="text-base font-bold text-white">{t.step2Title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t.step2Desc}</p>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/5 space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center font-mono font-bold text-base text-[#D4AF37]">
                    03
                  </div>
                  <h3 className="text-base font-bold text-white">{t.step3Title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t.step3Desc}</p>
                </div>

                {/* Step 4 */}
                <div className="p-6 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/30 space-y-3 shadow-lg">
                  <div className="w-10 h-10 rounded-2xl bg-[#D4AF37] text-[#0A0A0E] flex items-center justify-center font-mono font-bold text-base shadow-md">
                    04
                  </div>
                  <h3 className="text-base font-bold text-white">{t.step4Title}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{t.step4Desc}</p>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <CustomerReviews
              reviews={reviews}
              onAddReview={handleAddReview}
              lang={lang}
            />

            {/* FAQ and Chatbot Assistant */}
            <FaqChatbot lang={lang} />
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        showDZD={showDZD}
      />

      {/* Footer */}
      <Footer
        lang={lang}
        onNavigate={(view) => {
          setIsAdminOpen(false);
          setCurrentView(view);
          window.location.hash = view === 'home' ? '' : view;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

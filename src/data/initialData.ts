import { Product, Coupon, CustomerReview, Order } from '../types';

export const BUSINESS_INFO = {
  name: 'YASSER PREMIUM',
  slogan: 'Premium Services. Instant Experience.',
  sloganAr: 'خدمات بريميوم. تجربة فورية.',
  sloganFr: 'Services Premium. Expérience Instantanée.',
  telegramSupport: 'yasser_fr',
  telegramChannel: 'yasser_premium',
  supportHours: '24/7 Available',
  binanceId: '986517873',
  binanceNickname: 'YASSER_PREMIUM_STORE',
  usdtAddress: '0x2f2fccb9c551331776d40284f9b5876da220f2ce',
  usdtNetwork: 'BNB Smart Chain (BEP20)',
  dzdExchangeRate: 240, // Parallel market conversion approx for Algerian buyers
};

export const INITIAL_PRODUCTS: Product[] = [
  // Telegram Premium
  {
    id: 'tg-prem-3m',
    type: 'premium',
    name: 'Telegram Premium 3 Months',
    nameAr: 'تيليجرام بريميوم 3 أشهر',
    nameFr: 'Telegram Premium 3 Mois',
    durationMonths: 3,
    price: 12.50,
    originalPrice: 14.99,
    description: '3 Months direct official Telegram Premium gift activation via username.',
    descriptionAr: 'تفعيل رسمي ومباشر لاشتراك تيليجرام بريميوم لمدة 3 أشهر عبر المعرف.',
    descriptionFr: 'Activation officielle directe par nom d’utilisateur pendant 3 mois.',
    features: [
      '4 GB File Uploads',
      'Faster Download Speeds',
      'Voice-to-Text Conversion',
      'Premium Star Profile Badge',
      'Exclusive Stickers & Reactions',
      'No Ads in Public Channels'
    ],
    featuresAr: [
      'رفع ملفات بحجم يصل إلى 4 جيجابايت',
      'سرعة تنزيل فائقة بدون قيود',
      'تحويل الرسائل الصوتية إلى نصوص',
      'شارة النجمة الذهبية للملف الشخصي',
      'ملصقات وردود فعل تفاعلية حصرية',
      'حجب تام للإعلانات في القنوات العامة'
    ],
    featuresFr: [
      'Téléversement de fichiers jusqu’à 4 Go',
      'Vitesse de téléchargement maximale',
      'Conversion voix en texte',
      'Badge Premium sur le profil',
      'Stickers et réactions exclusifs',
      'Aucune publicité dans les canaux'
    ],
    inStock: true
  },
  {
    id: 'tg-prem-6m',
    type: 'premium',
    name: 'Telegram Premium 6 Months',
    nameAr: 'تيليجرام بريميوم 6 أشهر',
    nameFr: 'Telegram Premium 6 Mois',
    durationMonths: 6,
    price: 16.50,
    originalPrice: 22.00,
    popular: true,
    badge: 'Best Value',
    badgeAr: 'الأكثر طلباً',
    badgeFr: 'Meilleur Rapport',
    description: '6 Months Telegram Premium subscription. Great balance between price and duration.',
    descriptionAr: 'اشتراك تيليجرام بريميوم لمدة 6 أشهر. الخيار المثالي بين السعر والمدة.',
    descriptionFr: 'Abonnement 6 mois. L’équilibre parfait entre économie et sérénité.',
    features: [
      'All Premium Core Features',
      'Advanced Chat Management',
      'Real-Time Channel Translation',
      'Animated Profile Avatars',
      'Up to 1000 Channels Join Limit',
      'Direct Gift to @username (No Login Required)'
    ],
    featuresAr: [
      'جميع مزايا بريميوم الأساسية كاملة',
      'إدارة متقدمة لمجلدات المحادثات',
      'ترجمة فورية للمحادثات والقنوات',
      'صور رمزية متحركة للملف الشخصي',
      'الانضمام إلى ما يصل لـ 1000 قناة',
      'تفعيل كهدية برابط رسمي بدون طلب كلمة المرور'
    ],
    featuresFr: [
      'Toutes les fonctionnalités Premium',
      'Gestion avancée des dossiers de chat',
      'Traduction en temps réel',
      'Photo de profil animée',
      'Rejoignez jusqu’à 1000 canaux',
      'Cadeau officiel sans mot de passe requis'
    ],
    inStock: true
  },
  {
    id: 'tg-prem-12m',
    type: 'premium',
    name: 'Telegram Premium 12 Months',
    nameAr: 'تيليجرام بريميوم 12 شهراً (سنة كاملة)',
    nameFr: 'Telegram Premium 12 Mois (1 An)',
    durationMonths: 12,
    price: 29.99,
    originalPrice: 42.00,
    badge: 'Maximum Savings',
    badgeAr: 'أكبر توفير',
    badgeFr: 'Économie Maximale',
    description: '1 Full Year of Telegram Premium at the most competitive global rate.',
    descriptionAr: 'سنة كاملة من اشتراك بريميوم بأفضل سعر تنافسي في السوق.',
    descriptionFr: '1 an complet de Telegram Premium au tarif le plus avantageux.',
    features: [
      'Full 365 Days Uninterrupted Premium',
      'Zero Risk Official Gift Link',
      'Custom App Icons',
      'Emoji Status Badges',
      'Priority Customer Processing',
      'Save over 35% compared to monthly'
    ],
    featuresAr: [
      '365 يوماً كاملاً بدون أي انقطاع',
      'تفعيل آمن 100% كهدية رسمية',
      'أيقونات تطبيق مخصصة ومميزة',
      'حالات تعبيرية مخصصة بجانب الاسم',
      'معالجة ذات أولوية فورية',
      'وفر أكثر من 35% مقارنة بالدفع الشهري'
    ],
    featuresFr: [
      '365 jours complets sans interruption',
      'Lien cadeau officiel 100% sécurisé',
      'Icônes d’application personnalisées',
      'Statuts émoji personnalisés',
      'Traitement prioritaire 24/7',
      'Économisez plus de 35%'
    ],
    inStock: true
  },

  // Telegram Stars Packages
  {
    id: 'tg-stars-50',
    type: 'stars',
    name: '50 Telegram Stars',
    nameAr: '50 نجمة تيليجرام',
    nameFr: '50 Étoiles Telegram',
    starsCount: 50,
    price: 1.00,
    description: '50 Stars for mini-apps, bot payments, and creator support.',
    descriptionAr: '50 نجمة لتطبيقات تيليجرام المصغرة وشراء محتوى المبدعين.',
    descriptionFr: '50 étoiles pour les mini-apps et soutenir les créateurs.',
    features: ['Instant delivery to @username', 'Usable on any Telegram Bot / Mini-App', 'Official Telegram Stars balance'],
    featuresAr: ['شحن فوري لحسابك عبر @المعرف', 'صالحة لجميع بوتات وتطبيقات تيليجرام', 'رصيد رسمي دائم'],
    featuresFr: ['Livraison instantanée', 'Compatible tous bots et mini-apps', 'Solde officiel Telegram'],
    inStock: true
  },
  {
    id: 'tg-stars-75',
    type: 'stars',
    name: '75 Telegram Stars',
    nameAr: '75 نجمة تيليجرام',
    nameFr: '75 Étoiles Telegram',
    starsCount: 75,
    price: 1.50,
    description: '75 Stars package for premium reactions and game unlocks.',
    descriptionAr: 'باقة 75 نجمة للتفاعلات المميزة وفتح ميزات الألعاب.',
    descriptionFr: 'Pack de 75 étoiles pour réactions et fonctionnalités jeux.',
    features: ['Instant delivery to @username', 'Pay for digital content', '100% safe & legit'],
    featuresAr: ['إرسال فوري إلى حسابك', 'دفع ثمن المحتوى الرقمي والاشتراكات', 'آمن ورسمي 100%'],
    featuresFr: ['Envoi direct vers votre pseudo', 'Déblocage de contenus digitaux', '100% garanti'],
    inStock: true
  },
  {
    id: 'tg-stars-100',
    type: 'stars',
    name: '100 Telegram Stars',
    nameAr: '100 نجمة تيليجرام',
    nameFr: '100 Étoiles Telegram',
    starsCount: 100,
    price: 1.80,
    popular: true,
    badge: 'Popular',
    badgeAr: 'شائع',
    badgeFr: 'Populaire',
    description: '100 Stars at a discounted promotional rate.',
    descriptionAr: '100 نجمة تيليجرام بسعر مميز وتخفيض فوري.',
    descriptionFr: '100 étoiles au meilleur tarif par pack.',
    features: ['Instant transfer', 'Unlock VIP bot tiers', 'Gift to channel creators'],
    featuresAr: ['تحويل مباشر وفوري', 'ترقية بوتات واشتراكات VIP', 'إمكانية إهدائها للمنشئين'],
    featuresFr: ['Transfert rapide', 'Accès bots et mini-apps VIP', 'Peut être offert'],
    inStock: true
  },
  {
    id: 'tg-stars-150',
    type: 'stars',
    name: '150 Telegram Stars',
    nameAr: '150 نجمة تيليجرام',
    nameFr: '150 Étoiles Telegram',
    starsCount: 150,
    price: 2.50,
    description: '150 Stars for serious bot developers and avid mini-app players.',
    descriptionAr: '150 نجمة لمطوري البوتات ولاعبي التطبيقات المصغرة.',
    descriptionFr: '150 étoiles pour créateurs et joueurs actifs.',
    features: ['Top tier rate', 'Instant processing', '24/7 support backup'],
    featuresAr: ['سعر تنافسي مخفض', 'معالجة فورية على مدار الساعة', 'دعم فني مستمر'],
    featuresFr: ['Tarif ultra compétitif', 'Traitement automatisé', 'Assistance continue'],
    inStock: true
  },
  {
    id: 'tg-stars-200',
    type: 'stars',
    name: '200 Telegram Stars',
    nameAr: '200 نجمة تيليجرام',
    nameFr: '200 Étoiles Telegram',
    starsCount: 200,
    price: 3.50,
    description: '200 Stars bulk package with high saving percentage.',
    descriptionAr: 'حزمة 200 نجمة مع نسبة توفير ممتازة.',
    descriptionFr: 'Pack de 200 étoiles pour économiser davantage.',
    features: ['High capacity balance', 'Direct credit to balance', 'Priority queue'],
    featuresAr: ['رصيد وفير لجميع الاستخدامات', 'شحن مباشر للحساب', 'أولوية في التسليم'],
    featuresFr: ['Crédit direct sur votre compte', 'Idéal gros volumes', 'File prioritaire'],
    inStock: true
  },
  {
    id: 'tg-stars-250',
    type: 'stars',
    name: '250 Telegram Stars',
    nameAr: '250 نجمة تيليجرام',
    nameFr: '250 Étoiles Telegram',
    starsCount: 250,
    price: 4.00,
    badge: 'Bulk Discount',
    badgeAr: 'أفضل سعر جملة',
    badgeFr: 'Super Promo',
    description: '250 Stars at our lowest unit price of $0.016 per star.',
    descriptionAr: '250 نجمة بأقل سعر للوحدة 0.016$ فقط لكل نجمة.',
    descriptionFr: '250 étoiles à prix coûtant, tarif imbattable.',
    features: ['Lowest per-star price', 'Instant gift via Telegram API', 'Eligible for VIP rewards'],
    featuresAr: ['أرخص سعر للنجمة الواحدة', 'شحن فوري رسمي', 'مؤهل لنقاط ولاء VIP'],
    featuresFr: ['Prix par étoile le plus bas', 'Crédit direct sécurisé', 'Points fidélité VIP'],
    inStock: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'YASSER10', discountPercent: 10, minSpend: 10, active: true },
  { code: 'VIPGOLD', discountPercent: 15, minSpend: 25, active: true },
  { code: 'WELCOME5', discountPercent: 5, minSpend: 1, active: true },
  { code: 'ALGERIA2026', discountPercent: 12, minSpend: 15, active: true }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Karim B.',
    usernameMasked: '@kar***_dz',
    location: 'Algiers, Algeria 🇩🇿',
    rating: 5,
    comment: 'Activated 12 months Telegram Premium in less than 3 minutes via Binance Pay! Fast, reliable, best price in Algeria. Thank you Yasser!',
    commentAr: 'فعلت اشتراك 12 شهر بريميوم في أقل من 3 دقائق عن طريق بايننس! خدمة سريعة ومضمونة وأحسن سعر في الجزائر. شكراً ياسر!',
    commentFr: 'Activé 12 mois Telegram Premium en moins de 3 minutes via Binance Pay ! Super rapide et prix imbattable en Algérie.',
    productName: 'Telegram Premium 12 Months',
    date: 'Yesterday',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'Amine Z.',
    usernameMasked: '@ami***_oran',
    location: 'Oran, Algeria 🇩🇿',
    rating: 5,
    comment: 'Bought 250 Stars for my Telegram mini-app gaming. Sent USDT on BEP20 network and received the stars almost immediately.',
    commentAr: 'اشتريت 250 نجمة لألعاب البوتات، دفعت بـ USDT BEP20 ووصلت النجوم فوراً لحسابي. متجر احترافي وقمة في المصداقية.',
    commentFr: 'Acheté 250 Étoiles, paiement USDT BEP20 validé très rapidement. Vraiment professionnel !',
    productName: '250 Telegram Stars',
    date: '2 days ago',
    verified: true
  },
  {
    id: 'rev-3',
    name: 'Sofia M.',
    usernameMasked: '@sof***_paris',
    location: 'Paris, France 🇫🇷',
    rating: 5,
    comment: 'Super fast delivery for 6 months premium. No password requested, just sent my @username. Clean black & gold store!',
    commentAr: 'تسليم فائق السرعة لـ 6 أشهر. لم يطلب مني أي كلمة سر، فقط المعرف الخاص بي وتم التفعيل. متجر فخم وأسعار ممتازة.',
    commentFr: 'Livraison ultra rapide pour 6 mois premium. Aucun mot de passe demandé, juste mon pseudo. Boutique très soignée.',
    productName: 'Telegram Premium 6 Months',
    date: '3 days ago',
    verified: true
  },
  {
    id: 'rev-4',
    name: 'Tariq H.',
    usernameMasked: '@tar***_uae',
    location: 'Dubai, UAE 🇦🇪',
    rating: 5,
    comment: 'Customer support on @yasser_fr responded instantly when I asked about Binance transfer. Highly recommended store!',
    commentAr: 'الدعم الفني عبر @yasser_fr رد علي مباشرة وساعدني في التحويل عبر بايننس. متجر أنصح به بشدة.',
    commentFr: 'Support client sur @yasser_fr très réactif pour le paiement Binance. Je recommande sans hésiter !',
    productName: 'Telegram Premium 12 Months',
    date: '4 days ago',
    verified: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'YP-98421',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    telegramUsername: 'karim_dz26',
    items: [
      {
        productId: 'tg-prem-12m',
        productName: 'Telegram Premium 12 Months',
        type: 'premium',
        quantity: 1,
        price: 29.99,
        telegramUsername: 'karim_dz26',
        details: '1 Year Subscription'
      }
    ],
    subtotalUSD: 29.99,
    discountUSD: 3.00,
    couponCode: 'YASSER10',
    totalUSD: 26.99,
    paymentMethod: 'binance',
    binanceSenderId: '782910482',
    txId: 'BINANCE-PAY-88219412',
    status: 'completed',
    customerNote: 'Please activate as gift link',
    adminNote: 'Verified on Binance Pay ID 782910482, gift link delivered.',
    verifiedAt: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  },
  {
    id: 'YP-98420',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    telegramUsername: 'amina_oran',
    items: [
      {
        productId: 'tg-stars-250',
        productName: '250 Telegram Stars',
        type: 'stars',
        quantity: 1,
        price: 4.00,
        telegramUsername: 'amina_oran',
        details: '250 Stars Pack'
      }
    ],
    subtotalUSD: 4.00,
    discountUSD: 0,
    totalUSD: 4.00,
    paymentMethod: 'usdt_bep20',
    txId: '0x8f7c9e1b4a2d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    status: 'completed',
    adminNote: 'BEP20 Tx confirmed on BscScan block #42194012.',
    verifiedAt: new Date(Date.now() - 3600000 * 3.7).toISOString(),
    completedAt: new Date(Date.now() - 3600000 * 3.4).toISOString()
  },
  {
    id: 'YP-98419',
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    telegramUsername: 'mehdi_alger',
    items: [
      {
        productId: 'tg-prem-6m',
        productName: 'Telegram Premium 6 Months',
        type: 'premium',
        quantity: 1,
        price: 16.50,
        telegramUsername: 'mehdi_alger'
      }
    ],
    subtotalUSD: 16.50,
    discountUSD: 0,
    totalUSD: 16.50,
    paymentMethod: 'binance',
    binanceSenderId: '910284729',
    txId: 'BP-99214710',
    status: 'verifying',
    customerNote: 'Receipt submitted from Binance app transfer.',
    adminNote: 'Verifying on Binance account 986517873.',
    verifiedAt: undefined
  }
];

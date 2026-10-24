export type Language = 'en' | 'ar' | 'fr';

export type PaymentMethod = 'binance' | 'usdt_bep20';

export interface Product {
  id: string;
  type: 'premium' | 'stars';
  name: string;
  nameAr: string;
  nameFr: string;
  durationMonths?: number;
  starsCount?: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  badge?: string;
  badgeAr?: string;
  badgeFr?: string;
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  features: string[];
  featuresAr: string[];
  featuresFr: string[];
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  telegramUsername: string; // @username
}

export type OrderStatus = 'pending_payment' | 'verifying' | 'processing' | 'completed' | 'cancelled';

export interface Order {
  id: string; // e.g. YP-84729
  createdAt: string;
  telegramUsername: string;
  items: {
    productId: string;
    productName: string;
    type: 'premium' | 'stars';
    quantity: number;
    price: number;
    telegramUsername: string;
    details?: string;
  }[];
  subtotalUSD: number;
  discountUSD: number;
  couponCode?: string;
  totalUSD: number;
  paymentMethod: PaymentMethod;
  txId?: string;
  binanceSenderId?: string;
  receiptDataUrl?: string; // image or file preview
  receiptFileName?: string;
  status: OrderStatus;
  customerNote?: string;
  adminNote?: string;
  verifiedAt?: string;
  completedAt?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minSpend?: number;
  active: boolean;
}

export interface CustomerReview {
  id: string;
  name: string;
  usernameMasked: string;
  location: string;
  rating: number;
  comment: string;
  commentAr?: string;
  commentFr?: string;
  productName: string;
  date: string;
  verified: boolean;
}

export interface WebsiteNotice {
  enabled: boolean;
  textEn: string;
  textAr: string;
  textFr: string;
  urgency: 'info' | 'gold' | 'alert';
}

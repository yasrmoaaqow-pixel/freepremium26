import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  TrendingUp,
  Tag,
  Eye,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  UserPlus,
  UserCheck,
  Download,
  Search,
  MessageCircle,
  FileText,
  Key,
  Calendar,
  Layers,
  Settings
} from 'lucide-react';
import { Order, Product, Coupon, Language, OrderStatus } from '../types';
import { translations } from '../translations';
import { BUSINESS_INFO } from '../data/initialData';

interface AdminCredentials {
  username: string;
  emailOrTelegram: string;
  passwordHash: string; // stored credential
  createdAt: string;
}

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus, adminNote?: string) => void;
  products: Product[];
  onUpdateProductPrice: (productId: string, newPrice: number) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (code: string) => void;
  lang: Language;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateProductPrice,
  coupons,
  onAddCoupon,
  onDeleteCoupon,
  lang,
  onClose,
}) => {
  // Check if the single admin account slot is already taken
  const [adminAccount, setAdminAccount] = useState<AdminCredentials | null>(() => {
    const saved = localStorage.getItem('yp_admin_credentials');
    return saved ? JSON.parse(saved) : null;
  });

  // Authentication session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('yp_admin_session') === 'true';
  });

  // Registration Form State (Single slot)
  const [regUsername, setRegUsername] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  // Login Form State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Active view inside dashboard: 'bookings' | 'pricing' | 'coupons' | 'account'
  const [activeTab, setActiveTab] = useState<'bookings' | 'pricing' | 'coupons' | 'account'>('bookings');

  // Bookings search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [inspectingBooking, setInspectingBooking] = useState<Order | null>(null);

  // Status update modal state
  const [statusNote, setStatusNote] = useState('');
  const [tempStatus, setTempStatus] = useState<OrderStatus>('completed');

  // Password change state (for authenticated master admin)
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [pwdUpdateMsg, setPwdUpdateMsg] = useState('');

  // Pricing & Coupon state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState('10');

  // Handle Initial Account Creation (Single Slot)
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminAccount) {
      setRegError('Admin registration is closed: the single administrator slot has already been claimed.');
      return;
    }

    const cleanUser = regUsername.trim();
    const cleanContact = regContact.trim();

    if (!cleanUser || cleanUser.length < 3) {
      setRegError('Username must be at least 3 characters long.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter.');
      return;
    }

    const newCreds: AdminCredentials = {
      username: cleanUser,
      emailOrTelegram: cleanContact || '@yasser_fr',
      passwordHash: regPassword,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('yp_admin_credentials', JSON.stringify(newCreds));
    setAdminAccount(newCreds);
    setIsAuthenticated(true);
    sessionStorage.setItem('yp_admin_session', 'true');
    setRegError('');
  };

  // Handle Login with Registered Account
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAccount) {
      setLoginError('No admin account exists yet. Please set up your administrator account first.');
      return;
    }

    const inputUser = loginUsername.trim().toLowerCase();
    const inputPass = loginPassword;

    // Check credentials (case-insensitive username match)
    if (
      (inputUser === adminAccount.username.toLowerCase() || inputUser === 'admin') &&
      inputPass === adminAccount.passwordHash
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('yp_admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('yp_admin_session');
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAccount) return;
    if (newPassword.length < 6) {
      setPwdUpdateMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPwdUpdateMsg('Passwords do not match.');
      return;
    }

    const updated: AdminCredentials = {
      ...adminAccount,
      passwordHash: newPassword,
    };
    localStorage.setItem('yp_admin_credentials', JSON.stringify(updated));
    setAdminAccount(updated);
    setNewPassword('');
    setNewPasswordConfirm('');
    setPwdUpdateMsg('Password successfully updated!');
    setTimeout(() => setPwdUpdateMsg(''), 3000);
  };

  // Export Bookings to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Date', 'Telegram User', 'Products', 'Amount (USD)', 'Payment Method', 'TxID / Sender ID', 'Status'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleString(),
      o.telegramUsername,
      o.items.map((it) => `${it.quantity}x ${it.productName}`).join('; '),
      o.totalUSD.toFixed(2),
      o.paymentMethod,
      o.txId || o.binanceSenderId || '',
      o.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `yasser_premium_bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      o.id.toLowerCase().includes(query) ||
      o.telegramUsername.toLowerCase().includes(query) ||
      (o.txId && o.txId.toLowerCase().includes(query)) ||
      (o.binanceSenderId && o.binanceSenderId.toLowerCase().includes(query)) ||
      o.items.some((it) => it.productName.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, o) => acc + o.totalUSD, 0);
  const pendingCount = orders.filter((o) => o.status === 'verifying' || o.status === 'pending_payment').length;
  const processingCount = orders.filter((o) => o.status === 'processing').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  // -------------------------------------------------------------
  // VIEW 1: SINGLE ADMIN SLOT REGISTRATION (When no account exists)
  // -------------------------------------------------------------
  if (!adminAccount) {
    return (
      <div className="py-16 md:py-24 max-w-lg mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F0F16] border-2 border-[#D4AF37] shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)] space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-4 text-[#0A0A0E] shadow-xl">
              <UserPlus className="w-8 h-8 stroke-[2.5]" />
            </div>

            {/* Exclusive Single Slot Available Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>1 Single Admin Slot Available</span>
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-white">Create Master Admin Account</h2>
            <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
              Welcome! This single administrator slot allows you to create your personal store manager account.
              <strong> Once submitted, registration will be permanently closed and locked.</strong> Nobody else can ever create an account.
            </p>
          </div>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Admin Username <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Choose your admin username (e.g. yasser)"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Telegram Handle or Email (For Identification)
              </label>
              <input
                type="text"
                value={regContact}
                onChange={(e) => setRegContact(e.target.value)}
                placeholder="@yasser_fr or admin@yasserpremium.store"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Create Secure Password <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Confirm Password <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Re-type password"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                {regError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-[#0A0A0E] text-xs font-bold tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Claim Slot & Create Admin Account</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-neutral-500 hover:text-white underline cursor-pointer"
            >
              Cancel & Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ADMIN LOGIN (When account exists but user is logged out)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="py-16 md:py-24 max-w-md mx-auto px-4">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0F0F16] border border-[#D4AF37]/40 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center mx-auto mb-4 text-[#0A0A0E] shadow-xl">
              <Lock className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181824] border border-white/10 text-neutral-400 text-[11px] mb-2 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Slot 1/1 Claimed · Registration Locked</span>
            </div>

            <h2 className="font-cinzel text-2xl font-bold text-white">YASSER Administrator Login</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Sign in to manage bookings, receipts, and order fulfillment.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-4 pr-16 py-3 rounded-xl bg-[#08080C] border border-white/10 focus:border-[#D4AF37] text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#B8860B] hover:brightness-110 active:scale-98 text-[#0A0A0E] text-xs font-bold tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4" />
              <span>Log In to Admin Panel</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="text-xs text-neutral-500 hover:text-white underline cursor-pointer"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: AUTHENTICATED MASTER ADMIN DASHBOARD (View all bookings)
  // -------------------------------------------------------------
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header Row with Admin Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-cinzel text-2xl font-bold text-white">YASSER PREMIUM Management Portal</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-1">
            <span>
              Master Admin: <strong className="text-[#F5E6B8]">{adminAccount.username}</strong>
            </span>
            <span>·</span>
            <span>Contact: <strong className="text-white">{adminAccount.emailOrTelegram}</strong></span>
            <span>·</span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold">Slot 1/1 Secured (Registration Closed)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#14141E] border border-white/10 hover:border-[#D4AF37]/50 text-xs text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            title="Download CSV report of all customer bookings"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Export Bookings CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-[#14141E] border border-red-500/20 text-xs font-medium text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold transition-colors cursor-pointer"
          >
            Exit to Store
          </button>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">Total Settled Revenue</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#F5E6B8] tabular-nums">
            ${totalRevenue.toFixed(2)}
          </div>
          <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
            ≈ {Math.round(totalRevenue * BUSINESS_INFO.dzdExchangeRate).toLocaleString()} DZD
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">Pending Verification</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-300 tabular-nums">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-400/80 font-medium mt-1 block">
            Requires receipt check
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">Processing Gift Delivery</span>
            <RefreshCw className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-blue-300 tabular-nums">
            {processingCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Awaiting gift link dispatch
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">Completed Bookings</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
            {completedCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            {orders.length} total recorded bookings
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-md'
              : 'text-neutral-400 hover:text-white bg-[#14141E]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>All Customer Bookings ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-md'
              : 'text-neutral-400 hover:text-white bg-[#14141E]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Product Pricing</span>
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-md'
              : 'text-neutral-400 hover:text-white bg-[#14141E]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Promo Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'account'
              ? 'bg-[#D4AF37] text-[#0A0A0E] shadow-md'
              : 'text-neutral-400 hover:text-white bg-[#14141E]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Admin Account Slot</span>
        </button>
      </div>

      {/* TAB 1: ALL BOOKINGS VIEWER */}
      {activeTab === 'bookings' && (
        <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h3 className="font-cinzel text-lg font-bold text-white">All Store Bookings & Orders</h3>
              <p className="text-xs text-neutral-400">
                Inspect customer bookings, uploaded payment receipts, verify transactions, and fulfill orders.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Booking ID, Telegram..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] w-full sm:w-60"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#08080C] border border-white/5 text-xs">
                {['all', 'verifying', 'processing', 'completed', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors text-[11px] font-medium ${
                      statusFilter === st
                        ? 'bg-[#1C1C28] text-[#D4AF37] font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="text-[11px] uppercase tracking-wider text-neutral-400 bg-[#08080C] border-b border-white/5">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Customer Telegram</th>
                  <th className="py-3 px-4">Product(s) Booked</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment & Receipt</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      No customer bookings found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#F5E6B8] block">{b.id}</span>
                        <span className="text-[10px] text-neutral-500 block">
                          {new Date(b.createdAt).toLocaleDateString()} {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Customer Telegram with direct message link */}
                      <td className="py-3.5 px-4">
                        <a
                          href={`https://t.me/${b.telegramUsername.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-white hover:text-[#D4AF37] flex items-center gap-1"
                        >
                          <span>{b.telegramUsername}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-500" />
                        </a>
                      </td>

                      {/* Products */}
                      <td className="py-3.5 px-4">
                        {b.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-xs text-neutral-200">
                            <span className="text-[#D4AF37] font-bold">{it.quantity}x</span> {it.productName}
                          </div>
                        ))}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#F5E6B8] text-sm tabular-nums">
                          ${b.totalUSD.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-500 block">
                          ≈ {Math.round(b.totalUSD * BUSINESS_INFO.dzdExchangeRate)} DZD
                        </span>
                      </td>

                      {/* Payment Method & Proof */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-medium text-white block">
                          {b.paymentMethod === 'binance' ? 'Binance Pay' : 'USDT BEP20'}
                        </span>
                        {b.txId && (
                          <span className="text-[10px] font-mono text-neutral-400 block truncate max-w-[140px]" title={b.txId}>
                            Tx: {b.txId}
                          </span>
                        )}
                        {b.binanceSenderId && (
                          <span className="text-[10px] font-mono text-[#D4AF37] block">
                            Sender ID: {b.binanceSenderId}
                          </span>
                        )}
                        {b.receiptDataUrl && (
                          <button
                            onClick={() => setSelectedReceiptUrl(b.receiptDataUrl || null)}
                            className="mt-1 text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Receipt</span>
                          </button>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : b.status === 'verifying'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : b.status === 'processing'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setInspectingBooking(b);
                            setTempStatus(b.status);
                            setStatusNote(b.adminNote || '');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#1C1C28] hover:bg-[#252536] border border-white/10 text-neutral-200 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        {b.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateOrderStatus(b.id, 'completed', 'Verified on blockchain / Binance Pay. Gift link delivered.')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                            title="Approve and mark completed"
                          >
                            Approve
                          </button>
                        )}

                        {b.status === 'verifying' && (
                          <button
                            onClick={() => onUpdateOrderStatus(b.id, 'processing', 'Payment verified, preparing delivery.')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] transition-colors cursor-pointer"
                          >
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT PRICING */}
      {activeTab === 'pricing' && (
        <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">Live Product Pricing & Duration</h3>
              <p className="text-xs text-neutral-400">Change prices for 3M, 6M, 12M Premium and Stars in real time.</p>
            </div>
            <span className="text-xs font-mono text-[#D4AF37]">{products.length} Products Configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-2xl bg-[#08080C] border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-bold text-white text-sm">{p.name}</h5>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {p.type === 'premium' ? `${p.durationMonths} Months Duration` : `${p.starsCount} Telegram Stars`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {editingPriceId === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="w-20 px-2 py-1 rounded bg-[#151520] border border-[#D4AF37] text-white font-mono text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(tempPrice);
                          if (!isNaN(val) && val > 0) {
                            onUpdateProductPrice(p.id, val);
                          }
                          setEditingPriceId(null);
                        }}
                        className="px-2 py-1 bg-[#D4AF37] text-[#0A0A0E] font-bold text-[10px] rounded cursor-pointer"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPriceId(null)}
                        className="text-[10px] text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-[#F5E6B8] tabular-nums">
                        ${p.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingPriceId(p.id);
                          setTempPrice(p.price.toString());
                        }}
                        className="text-xs text-[#D4AF37] hover:underline font-semibold"
                      >
                        Edit Price
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROMO COUPONS */}
      {activeTab === 'coupons' && (
        <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-cinzel text-base font-bold text-white">Promotional Discount Coupons</h3>
              <p className="text-xs text-neutral-400">Add or remove coupon codes for customer checkout.</p>
            </div>
            <span className="text-xs text-neutral-400">{coupons.length} Active</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newCouponCode.trim()) return;
              onAddCoupon({
                code: newCouponCode.trim().toUpperCase(),
                discountPercent: parseFloat(newCouponPercent) || 10,
                active: true,
              });
              setNewCouponCode('');
            }}
            className="flex gap-2 max-w-md"
          >
            <input
              type="text"
              value={newCouponCode}
              onChange={(e) => setNewCouponCode(e.target.value)}
              placeholder="Coupon Code (e.g. VIP2026)"
              className="flex-1 px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-[#D4AF37]"
            />
            <input
              type="number"
              min={1}
              max={90}
              value={newCouponPercent}
              onChange={(e) => setNewCouponPercent(e.target.value)}
              placeholder="% off"
              className="w-20 px-2 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white placeholder-neutral-500 text-center font-mono focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-2 pt-2">
            {coupons.map((c) => (
              <div
                key={c.code}
                className="p-3.5 rounded-xl bg-[#08080C] border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-mono font-bold text-white tracking-wider text-sm">{c.code}</span>
                  <span className="text-emerald-400 font-mono font-semibold">-{c.discountPercent}% OFF</span>
                </div>
                <button
                  onClick={() => onDeleteCoupon(c.code)}
                  className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                  title="Delete coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN ACCOUNT SLOT & SETTINGS */}
      {activeTab === 'account' && (
        <div className="p-6 rounded-3xl bg-[#0F0F16] border border-white/10 space-y-6 max-w-2xl">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-white">Administrator Account Details</h3>
            <p className="text-xs text-neutral-400">
              Your store is protected by single-slot registration. Only this single administrator account exists.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#08080C] border border-[#D4AF37]/30 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-neutral-400">Registration Slot Status</span>
              <span className="text-emerald-400 font-bold font-mono">1/1 Occupied (Registration Closed)</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-neutral-400">Admin Username</span>
              <span className="text-white font-mono font-bold">{adminAccount.username}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-neutral-400">Contact Identifier</span>
              <span className="text-white font-mono">{adminAccount.emailOrTelegram}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Account Created At</span>
              <span className="text-neutral-300 font-mono">
                {new Date(adminAccount.createdAt).toLocaleDateString()} {new Date(adminAccount.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Change Master Password */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Change Master Password</h4>
            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {pwdUpdateMsg && (
                <p className={`text-xs ${pwdUpdateMsg.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pwdUpdateMsg}
                </p>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Full Booking Inspection & Status Change */}
      {inspectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12121A] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs text-neutral-400 font-mono">Booking Inspection</span>
                <h3 className="font-cinzel text-xl font-bold text-white">{inspectingBooking.id}</h3>
              </div>
              <button
                onClick={() => setInspectingBooking(null)}
                className="text-neutral-400 hover:text-white text-xs font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Customer & Items */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400">Target Telegram Account:</span>
                <a
                  href={`https://t.me/${inspectingBooking.telegramUsername.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#F5E6B8] hover:underline flex items-center gap-1"
                >
                  <span>{inspectingBooking.telegramUsername}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-400" />
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/5 space-y-1.5">
                <span className="text-neutral-400 block mb-1">Booked Items:</span>
                {inspectingBooking.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-neutral-200">
                    <span>
                      {it.quantity}x {it.productName} ({it.details || ''})
                    </span>
                    <span className="font-mono text-[#F5E6B8]">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-white/5 flex justify-between font-bold text-white">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-base text-[#F5E6B8]">${inspectingBooking.totalUSD.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/5 space-y-1">
                <span className="text-neutral-400 block">Payment Method & Reference:</span>
                <p className="text-white capitalize">
                  {inspectingBooking.paymentMethod === 'binance' ? 'Binance Pay Transfer' : 'USDT (BNB Smart Chain BEP20)'}
                </p>
                {inspectingBooking.binanceSenderId && (
                  <p className="font-mono text-[#D4AF37]">Binance Sender ID: {inspectingBooking.binanceSenderId}</p>
                )}
                {inspectingBooking.txId && (
                  <p className="font-mono text-neutral-300 break-all">TxID: {inspectingBooking.txId}</p>
                )}
                {inspectingBooking.receiptDataUrl && (
                  <button
                    onClick={() => setSelectedReceiptUrl(inspectingBooking.receiptDataUrl || null)}
                    className="mt-2 text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Uploaded Payment Receipt Screenshot</span>
                  </button>
                )}
              </div>

              {/* Customer Note */}
              {inspectingBooking.customerNote && (
                <div className="p-3.5 rounded-xl bg-[#08080C] border border-white/5">
                  <span className="text-neutral-400 block mb-0.5">Customer Order Note:</span>
                  <p className="text-neutral-200 italic">"{inspectingBooking.customerNote}"</p>
                </div>
              )}

              {/* Status Update Controls */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <label className="block text-xs font-bold text-white">Update Booking Status</label>
                <select
                  value={tempStatus}
                  onChange={(e) => setTempStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-[#D4AF37]/50 text-xs text-white focus:outline-none"
                >
                  <option value="verifying">Verifying (Awaiting Payment Check)</option>
                  <option value="processing">Processing (Preparing Gift Delivery)</option>
                  <option value="completed">Completed (Delivered & Verified)</option>
                  <option value="cancelled">Cancelled (Declined / Refunded)</option>
                </select>

                <div>
                  <label className="block text-neutral-400 text-[11px] mb-1">Dispatch / Staff Note</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Gift dispatched via Telegram bot, confirmed by customer."
                    className="w-full px-3 py-2 rounded-xl bg-[#08080C] border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setInspectingBooking(null)}
                    className="px-4 py-2 rounded-xl text-neutral-400 text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(inspectingBooking.id, tempStatus, statusNote);
                      setInspectingBooking(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C07B] text-[#0A0A0E] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Save & Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Receipt Full Screen Inspection */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#121218] border border-[#D4AF37]/40 rounded-3xl p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h4 className="font-bold text-sm text-white">Payment Receipt Full Preview</h4>
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="text-neutral-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-black flex justify-center">
              <img
                src={selectedReceiptUrl}
                alt="Uploaded proof"
                className="max-h-[70vh] object-contain"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReceiptUrl(null)}
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0A0A0E] text-xs font-bold cursor-pointer"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

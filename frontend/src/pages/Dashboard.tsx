import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Copy, Check, Wallet, Gift, LogOut, BookOpen } from 'lucide-react';
import {
  getCurrentUser,
  getCurrentPhone,
  submitUTR,
  requestWithdrawal,
  requestRecharge,
  type LocalUser,
} from '../lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from '@tanstack/react-router';
import ShareableLink from '../components/ShareableLink';

const COMMISSION_DISPLAY = [
  { level: 1, rate: 25 },
  { level: 2, rate: 15 },
  { level: 3, rate: 10 },
  { level: 4, rate: 5 },
  { level: 5, rate: 4 },
  { level: 6, rate: 3 },
  { level: 7, rate: 2 },
  { level: 8, rate: 1 },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrLoading, setUtrLoading] = useState(false);
  const [withdrawUpi, setWithdrawUpi] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [rechargeMobile, setRechargeMobile] = useState('');
  const [rechargeOperator, setRechargeOperator] = useState('');
  const [rechargeValidity, setRechargeValidity] = useState('');
  const [rechargeDataPack, setRechargeDataPack] = useState('');
  const [rechargeLoading, setRechargeLoading] = useState(false);

  useEffect(() => {
    const p = getCurrentPhone();
    if (!p) {
      router.navigate({ to: '/login' });
      return;
    }
    setPhone(p);
    setUser(getCurrentUser());
  }, [router]);

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUTRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      toast.error('UTR नंबर डालें।');
      return;
    }
    if (!phone) return;
    setUtrLoading(true);
    try {
      const result = submitUTR(phone, utrNumber.trim());
      if (result.success) {
        toast.success('UTR सबमिट हो गया! एडमिन अनुमोदन की प्रतीक्षा करें।');
        setUtrNumber('');
      } else {
        toast.error(result.error || 'UTR सबमिट विफल।');
      }
    } catch {
      toast.error('UTR सबमिट विफल। पुनः प्रयास करें।');
    } finally {
      setUtrLoading(false);
    }
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !user) return;
    const amount = parseFloat(withdrawAmount);
    if (!withdrawUpi.trim()) {
      toast.error('UPI ID आवश्यक है।');
      return;
    }
    if (!amount || amount < 100) {
      toast.error('न्यूनतम ₹100 निकासी।');
      return;
    }
    if (amount > user.walletBalance) {
      toast.error('अपर्याप्त बैलेंस।');
      return;
    }
    setWithdrawLoading(true);
    try {
      const result = requestWithdrawal(phone, withdrawUpi, amount);
      if (result.success) {
        toast.success('निकासी अनुरोध भेजा गया!');
        setWithdrawUpi('');
        setWithdrawAmount('');
        refreshUser();
      } else {
        toast.error(result.error || 'निकासी विफल।');
      }
    } catch {
      toast.error('निकासी अनुरोध विफल। पुनः प्रयास करें।');
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !user) return;
    if (!rechargeMobile || !/^\d{10}$/.test(rechargeMobile)) {
      toast.error('सही 10 अंकों का मोबाइल नंबर डालें।');
      return;
    }
    if (!rechargeOperator) {
      toast.error('ऑपरेटर चुनें।');
      return;
    }
    if (!rechargeValidity) {
      toast.error('वैलिडिटी चुनें।');
      return;
    }
    if (rechargeValidity === 'dataPack' && !rechargeDataPack) {
      toast.error('डेटा पैक विकल्प चुनें।');
      return;
    }
    setRechargeLoading(true);
    try {
      const result = requestRecharge(phone, rechargeMobile, rechargeOperator, rechargeValidity, rechargeDataPack);
      if (result.success) {
        toast.success('रिचार्ज अनुरोध भेजा गया!');
        setRechargeMobile('');
        setRechargeOperator('');
        setRechargeValidity('');
        setRechargeDataPack('');
        refreshUser();
      } else {
        toast.error(result.error || 'रिचार्ज अनुरोध विफल।');
      }
    } catch {
      toast.error('रिचार्ज अनुरोध विफल। पुनः प्रयास करें।');
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gita_session');
    router.navigate({ to: '/login' });
  };

  if (!user || !phone) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron border-t-transparent" />
      </div>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${user.personalReferCode}`;
  const totalCommission = user.commissions.reduce((sum, c) => sum + c.amount, 0);

  const commissionByLevel = COMMISSION_DISPLAY.map((item) => {
    const earned = user.commissions
      .filter((c) => c.level === item.level)
      .reduce((sum, c) => sum + c.amount, 0);
    return { ...item, earned };
  });

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-devanagari font-bold text-maroon">मेरा डैशबोर्ड</h1>
            <p className="text-maroon/60 font-devanagari text-sm">📱 {phone}</p>
          </div>
          <div className="flex items-center gap-3">
            {user.isActive && (
              <Link
                to="/book"
                className="flex items-center gap-1 bg-saffron text-maroon px-3 py-2 rounded-lg font-devanagari text-sm font-bold hover:bg-gold transition-all"
              >
                <BookOpen size={16} />
                पुस्तक
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-maroon/10 text-maroon px-3 py-2 rounded-lg font-devanagari text-sm hover:bg-maroon/20 transition-all"
            >
              <LogOut size={16} />
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gold/20 text-center">
            <Wallet size={24} className="text-saffron mx-auto mb-2" />
            <div className="text-2xl font-bold text-maroon">₹{user.walletBalance}</div>
            <div className="text-maroon/60 font-devanagari text-xs">वॉलेट बैलेंस</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gold/20 text-center">
            <Gift size={24} className="text-saffron mx-auto mb-2" />
            <div className="text-2xl font-bold text-maroon">₹{totalCommission}</div>
            <div className="text-maroon/60 font-devanagari text-xs">कुल कमीशन</div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-4 shadow-md border border-gold/20 text-center">
            <div className={`text-2xl font-bold ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
              {user.isActive ? '✓ सक्रिय' : '✗ निष्क्रिय'}
            </div>
            <div className="text-maroon/60 font-devanagari text-xs">खाता स्थिति</div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-gold/20 mb-6">
          <h2 className="font-devanagari font-bold text-maroon text-lg mb-3 flex items-center gap-2">
            <Gift size={20} className="text-saffron" />
            रेफरल लिंक
          </h2>

          {/* Personal Referral Link */}
          <div className="mb-4">
            <p className="text-maroon/60 font-devanagari text-xs mb-2">आपका व्यक्तिगत रेफरल लिंक:</p>
            <div className="flex items-center gap-2 bg-cream rounded-xl px-3 py-2 border border-gold/30">
              <span className="text-maroon font-sans text-sm truncate flex-1 select-all">{referralLink}</span>
              <button
                onClick={() => handleCopy(referralLink)}
                className="flex-shrink-0 flex items-center gap-1 bg-saffron text-maroon px-3 py-1.5 rounded-lg font-devanagari text-xs font-bold hover:bg-gold transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'कॉपी!' : 'कॉपी'}
              </button>
            </div>
            <p className="text-maroon/50 font-devanagari text-xs mt-1">
              कोड: <strong className="text-maroon">{user.personalReferCode}</strong>
            </p>
          </div>

          {/* Short Website Link */}
          <div className="border-t border-gold/20 pt-4">
            <ShareableLink label="वेबसाइट का छोटा लिंक — दोस्तों को शेयर करें:" className="items-start" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="payment" className="bg-white rounded-2xl shadow-md border border-gold/20 overflow-hidden">
          <TabsList className="w-full rounded-none border-b border-gold/20 bg-cream h-auto p-0">
            <TabsTrigger
              value="payment"
              className="flex-1 rounded-none py-3 font-devanagari text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              भुगतान / UTR
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="flex-1 rounded-none py-3 font-devanagari text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              निकासी
            </TabsTrigger>
            <TabsTrigger
              value="recharge"
              className="flex-1 rounded-none py-3 font-devanagari text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              रिचार्ज
            </TabsTrigger>
            <TabsTrigger
              value="commission"
              className="flex-1 rounded-none py-3 font-devanagari text-sm data-[state=active]:bg-maroon data-[state=active]:text-cream"
            >
              कमीशन
            </TabsTrigger>
          </TabsList>

          {/* Payment / UTR Tab */}
          <TabsContent value="payment" className="p-5">
            {user.isActive ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-devanagari text-green-700 font-bold text-lg">आपका खाता सक्रिय है!</p>
                <p className="font-devanagari text-maroon/60 text-sm mt-1">आप पुस्तक पढ़ सकते हैं और कमीशन कमा सकते हैं।</p>
              </div>
            ) : (
              <div>
                <div className="bg-saffron/10 border border-saffron/30 rounded-xl p-4 mb-5">
                  <h3 className="font-devanagari font-bold text-maroon mb-2">भुगतान करें</h3>
                  <p className="font-devanagari text-maroon/70 text-sm mb-3">
                    ₹100 UPI से भेजें और UTR नंबर यहाँ दर्ज करें।
                  </p>
                  <div className="bg-white rounded-lg p-3 text-center border border-gold/30">
                    <p className="font-devanagari text-xs text-maroon/60 mb-1">UPI ID:</p>
                    <p className="font-bold text-maroon text-lg">admin@upi</p>
                    <p className="font-devanagari text-xs text-maroon/60 mt-1">राशि: ₹100</p>
                  </div>
                </div>
                <form onSubmit={handleUTRSubmit} className="space-y-4">
                  <div>
                    <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">
                      UTR / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="UTR नंबर डालें"
                      className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={utrLoading}
                    className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {utrLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />}
                    UTR सबमिट करें
                  </button>
                </form>
              </div>
            )}
          </TabsContent>

          {/* Withdrawal Tab */}
          <TabsContent value="withdraw" className="p-5">
            {!user.isActive ? (
              <div className="text-center py-6">
                <p className="font-devanagari text-maroon/60">खाता सक्रिय करने के बाद निकासी उपलब्ध होगी।</p>
              </div>
            ) : (
              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div className="bg-saffron/10 border border-saffron/30 rounded-xl p-3 mb-2">
                  <p className="font-devanagari text-maroon text-sm">
                    उपलब्ध बैलेंस: <strong>₹{user.walletBalance}</strong> | न्यूनतम निकासी: ₹100
                  </p>
                </div>
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">UPI ID</label>
                  <input
                    type="text"
                    value={withdrawUpi}
                    onChange={(e) => setWithdrawUpi(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                  />
                </div>
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">राशि (₹)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="न्यूनतम ₹100"
                    min={100}
                    className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                  />
                </div>
                <button
                  type="submit"
                  disabled={withdrawLoading}
                  className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {withdrawLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />}
                  निकासी अनुरोध भेजें
                </button>
              </form>
            )}
          </TabsContent>

          {/* Recharge Tab */}
          <TabsContent value="recharge" className="p-5">
            {!user.isActive ? (
              <div className="text-center py-6">
                <p className="font-devanagari text-maroon/60">खाता सक्रिय करने के बाद रिचार्ज उपलब्ध होगा।</p>
              </div>
            ) : (
              <form onSubmit={handleRecharge} className="space-y-4">
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">मोबाइल नंबर</label>
                  <input
                    type="tel"
                    value={rechargeMobile}
                    onChange={(e) => setRechargeMobile(e.target.value)}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    maxLength={10}
                    className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-sans focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                  />
                </div>
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">ऑपरेटर</label>
                  <select
                    value={rechargeOperator}
                    onChange={(e) => setRechargeOperator(e.target.value)}
                    className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-devanagari focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                  >
                    <option value="">ऑपरेटर चुनें</option>
                    <option value="jio">Jio</option>
                    <option value="airtel">Airtel</option>
                    <option value="vi">Vi</option>
                    <option value="bsnl">BSNL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">वैलिडिटी</label>
                  <select
                    value={rechargeValidity}
                    onChange={(e) => setRechargeValidity(e.target.value)}
                    className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-devanagari focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                  >
                    <option value="">वैलिडिटी चुनें</option>
                    <option value="days28">28 दिन</option>
                    <option value="days24">24 दिन</option>
                    <option value="dataPack">डेटा पैक</option>
                  </select>
                </div>
                {rechargeValidity === 'dataPack' && (
                  <div>
                    <label className="block text-maroon font-devanagari font-semibold text-sm mb-1.5">डेटा पैक</label>
                    <select
                      value={rechargeDataPack}
                      onChange={(e) => setRechargeDataPack(e.target.value)}
                      className="w-full border border-gold/40 rounded-xl px-4 py-3 text-maroon font-devanagari focus:outline-none focus:ring-2 focus:ring-saffron bg-cream"
                    >
                      <option value="">डेटा पैक चुनें</option>
                      <option value="gb1">1 GB</option>
                      <option value="gb1_5PerDay">1.5 GB/दिन</option>
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={rechargeLoading}
                  className="w-full bg-maroon text-cream py-3 rounded-xl font-devanagari font-bold hover:bg-maroon-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {rechargeLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-cream border-t-transparent" />}
                  रिचार्ज अनुरोध भेजें
                </button>
              </form>
            )}
          </TabsContent>

          {/* Commission Tab */}
          <TabsContent value="commission" className="p-5">
            <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">कमीशन विवरण</h3>
            <div className="space-y-3">
              {commissionByLevel.map((item) => (
                <div key={item.level} className="flex items-center justify-between bg-cream rounded-xl px-4 py-3 border border-gold/20">
                  <div>
                    <span className="font-devanagari font-bold text-maroon text-sm">स्तर {item.level}</span>
                    <span className="text-maroon/50 font-devanagari text-xs ml-2">({item.rate}%)</span>
                  </div>
                  <span className={`font-bold text-sm ${item.earned > 0 ? 'text-green-600' : 'text-maroon/40'}`}>
                    ₹{item.earned}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-saffron/10 border border-saffron/30 rounded-xl p-4 text-center">
              <p className="font-devanagari text-maroon/60 text-sm">कुल कमीशन</p>
              <p className="font-bold text-maroon text-2xl">₹{totalCommission}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@tanstack/react-router";
import {
  ArrowDownCircle,
  Check,
  Clock,
  Copy,
  Gift,
  LogOut,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import InstallButton from "../components/InstallButton";
import {
  type LocalUser,
  getCurrentPhone,
  getCurrentUser,
  logout,
  requestWithdrawal,
  submitUTR,
} from "../lib/auth";

const COMMISSION_LEVELS = [
  { level: 1, amount: 25, label: "प्रत्यक्ष रेफरल" },
  { level: 2, amount: 15, label: "रेफरल का रेफरल" },
  { level: 3, amount: 10, label: "स्तर 3" },
  { level: 4, amount: 5, label: "स्तर 4" },
  { level: 5, amount: 4, label: "स्तर 5" },
  { level: 6, amount: 3, label: "स्तर 6" },
  { level: 7, amount: 2, label: "स्तर 7" },
  { level: 8, amount: 1, label: "स्तर 8" },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [utrLoading, setUtrLoading] = useState(false);
  const [withdrawUpi, setWithdrawUpi] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const refreshUser = useCallback(() => {
    const p = getCurrentPhone();
    if (!p) {
      router.navigate({ to: "/login" });
      return;
    }
    setPhone(p);
    const u = getCurrentUser();
    setUser(u);
  }, [router]);

  useEffect(() => {
    refreshUser();
    // Poll every 30 seconds for instant updates
    const interval = setInterval(refreshUser, 30000);
    return () => clearInterval(interval);
  }, [refreshUser]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleUTRSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    if (!/^\d{12}$/.test(utrNumber.trim())) {
      toast.error("UTR नंबर ठीक 12 अंकों का होना चाहिए।");
      return;
    }
    setUtrLoading(true);
    try {
      const result = submitUTR(phone, utrNumber.trim());
      if (result.success) {
        toast.success("UTR सबमिट हो गया! एडमिन अनुमोदन की प्रतीक्षा करें।");
        setUtrNumber("");
      } else {
        toast.error(result.error || "UTR सबमिट विफल।");
      }
    } catch {
      toast.error("UTR सबमिट विफल। पुनः प्रयास करें।");
    } finally {
      setUtrLoading(false);
    }
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !user) return;
    const amount = Number.parseFloat(withdrawAmount);
    if (!withdrawUpi.trim()) {
      toast.error("UPI ID आवश्यक है।");
      return;
    }
    if (!amount || amount < 100) {
      toast.error("न्यूनतम ₹100 निकासी।");
      return;
    }
    if (amount > user.walletBalance) {
      toast.error("अपर्याप्त बैलेंस।");
      return;
    }
    setWithdrawLoading(true);
    try {
      const result = requestWithdrawal(phone, withdrawUpi, amount);
      if (result.success) {
        toast.success("निकासी अनुरोध भेजा गया!");
        setWithdrawUpi("");
        setWithdrawAmount("");
        refreshUser();
      } else {
        toast.error(result.error || "निकासी विफल।");
      }
    } catch {
      toast.error("निकासी अनुरोध विफल। पुनः प्रयास करें।");
    } finally {
      setWithdrawLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.navigate({ to: "/login" });
  };

  if (!user || !phone) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p style={{ color: "oklch(0.65 0.04 65)" }}>लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/register?ref=${user.personalReferCode}`;
  const totalCommission =
    user.commissions?.reduce((sum, c) => sum + c.amount, 0) ?? 0;

  const commissionByLevel = COMMISSION_LEVELS.map((item) => {
    const earned =
      user.commissions
        ?.filter((c) => c.level === item.level)
        .reduce((sum, c) => sum + c.amount, 0) ?? 0;
    return { ...item, earned };
  });

  const cardStyle = {
    background: "oklch(0.17 0.025 55)",
    border: "1px solid oklch(0.4 0.08 65 / 0.25)",
  };

  const labelStyle = { color: "oklch(0.65 0.04 65)" };
  const valueStyle = { color: "oklch(0.92 0.03 75)" };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "oklch(0.12 0.02 55)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold gold-text">मेरा डैशबोर्ड</h1>
            <p className="text-sm mt-1" style={labelStyle}>
              📱 {phone}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <InstallButton />
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors hover:text-primary"
              style={{
                color: "oklch(0.65 0.04 65)",
                border: "1px solid oklch(0.4 0.08 65 / 0.3)",
              }}
            >
              <LogOut size={15} />
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Wallet */}
          <div className="rounded-xl p-4 text-center" style={cardStyle}>
            <Wallet size={22} className="text-primary mx-auto mb-2" />
            <div
              className="text-2xl font-bold"
              style={{ color: "oklch(0.85 0.18 70)" }}
            >
              ₹{user.walletBalance}
            </div>
            <div className="text-xs mt-1" style={labelStyle}>
              वॉलेट बैलेंस
            </div>
          </div>

          {/* Commission */}
          <div className="rounded-xl p-4 text-center" style={cardStyle}>
            <Gift size={22} className="text-primary mx-auto mb-2" />
            <div
              className="text-2xl font-bold"
              style={{ color: "oklch(0.85 0.18 70)" }}
            >
              ₹{totalCommission}
            </div>
            <div className="text-xs mt-1" style={labelStyle}>
              कुल कमीशन
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl p-4 text-center" style={cardStyle}>
            <div
              className={`text-2xl font-bold ${user.isActive ? "text-green-400" : "text-red-400"}`}
            >
              {user.isActive ? "✓" : "✗"}
            </div>
            <div
              className={`text-sm font-bold mt-1 ${user.isActive ? "text-green-400" : "text-red-400"}`}
            >
              {user.isActive ? "सक्रिय" : "निष्क्रिय"}
            </div>
            <div className="text-xs mt-0.5" style={labelStyle}>
              खाता स्थिति
            </div>
          </div>
        </div>

        {/* Active: Referral Section */}
        {user.isActive && user.personalReferCode && (
          <div className="rounded-xl p-5 mb-6" style={cardStyle}>
            <div className="om-divider mb-4">
              <span>ॐ</span>
              <span
                className="text-sm font-bold"
                style={{ color: "oklch(0.75 0.18 65)" }}
              >
                आपका रेफरल कोड
              </span>
              <span>ॐ</span>
            </div>

            {/* Big referral code display */}
            <div className="text-center mb-4">
              <div
                className="inline-block px-8 py-4 rounded-xl text-3xl font-bold tracking-widest"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.2 0.04 55), oklch(0.22 0.04 60))",
                  border: "2px solid oklch(0.75 0.18 65 / 0.4)",
                  color: "oklch(0.85 0.18 70)",
                  letterSpacing: "0.2em",
                }}
              >
                {user.personalReferCode}
              </div>
              <p className="text-xs mt-2" style={labelStyle}>
                यह कोड दूसरों को दें और कमीशन कमाएं
              </p>
            </div>

            {/* Referral Link */}
            <div>
              <p className="text-xs mb-2" style={labelStyle}>
                आपका रेफरल लिंक:
              </p>
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{
                  background: "oklch(0.14 0.02 55)",
                  border: "1px solid oklch(0.35 0.06 60 / 0.4)",
                }}
              >
                <span
                  className="text-xs truncate flex-1 select-all"
                  style={labelStyle}
                >
                  {referralLink}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(referralLink)}
                  className="flex-shrink-0 flex items-center gap-1 btn-gold px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "कॉपी!" : "कॉपी"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          defaultValue={user.isActive ? "withdraw" : "payment"}
          className="rounded-xl overflow-hidden"
          style={cardStyle}
        >
          <TabsList
            className="w-full rounded-none border-b h-auto p-0 grid"
            style={{
              borderColor: "oklch(0.4 0.08 65 / 0.2)",
              background: "oklch(0.14 0.02 55)",
              gridTemplateColumns: user.isActive
                ? "repeat(3, 1fr)"
                : "repeat(2, 1fr)",
            }}
          >
            {!user.isActive && (
              <TabsTrigger
                value="payment"
                className="rounded-none py-3.5 text-sm font-medium transition-all data-[state=active]:font-bold"
                style={{ color: "oklch(0.65 0.04 65)" }}
              >
                💳 भुगतान / UTR
              </TabsTrigger>
            )}
            {user.isActive && (
              <TabsTrigger
                value="withdraw"
                className="rounded-none py-3.5 text-sm font-medium transition-all data-[state=active]:font-bold"
                style={{ color: "oklch(0.65 0.04 65)" }}
              >
                💰 निकासी
              </TabsTrigger>
            )}
            <TabsTrigger
              value="commission"
              className="rounded-none py-3.5 text-sm font-medium transition-all data-[state=active]:font-bold"
              style={{ color: "oklch(0.65 0.04 65)" }}
            >
              📊 कमीशन
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none py-3.5 text-sm font-medium transition-all data-[state=active]:font-bold"
              style={{ color: "oklch(0.65 0.04 65)" }}
            >
              📋 इतिहास
            </TabsTrigger>
          </TabsList>

          {/* ── Payment / UTR Tab ── */}
          {!user.isActive && (
            <TabsContent value="payment" className="p-5 space-y-5">
              {/* Note */}
              <div
                className="rounded-xl p-4"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.2 0.04 60), oklch(0.18 0.035 55))",
                  border: "1px solid oklch(0.75 0.18 65 / 0.2)",
                }}
              >
                <p
                  className="text-sm leading-relaxed text-center font-bold"
                  style={{ color: "oklch(0.85 0.12 70)" }}
                >
                  🌸 फ्री की वस्तु का उपयोग नहीं होता और खरीदी गई वस्तु का उपयोग करना
                  पड़ता है इसलिए हम ₹100 चार्ज कर रहे हैं। और अगर भगवत गीता का सार फ्री
                  में किसी को देते तो कोई नहीं पढ़ता, इसलिए सभी तक पहुंचाने के लिए कमीशन
                  दिया जाता है। 🌸
                </p>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <p
                  className="text-sm font-bold mb-3"
                  style={{ color: "oklch(0.75 0.18 65)" }}
                >
                  नीचे QR कोड स्कैन करके ₹100 भेजें:
                </p>
                <div
                  className="inline-block rounded-xl overflow-hidden"
                  style={{ border: "3px solid oklch(0.75 0.18 65 / 0.6)" }}
                >
                  <img
                    src="/assets/generated/payment-qr.dim_400x450.png"
                    alt="Payment QR Code"
                    className="w-80 h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <p className="text-xs mt-2" style={labelStyle}>
                  ₹100 भुगतान के बाद UTR/Reference Number नीचे डालें
                </p>
              </div>

              {/* UTR Form */}
              <form onSubmit={handleUTRSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="utr-number"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    UTR / Reference Number (12 अंक){" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="utr-number"
                    type="text"
                    value={utrNumber}
                    onChange={(e) =>
                      setUtrNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                    placeholder="12 अंकों का UTR नंबर"
                    className="w-full input-divine rounded-xl px-4 py-3 text-sm font-mono tracking-wider"
                    maxLength={12}
                  />
                  <p className="text-xs mt-1" style={labelStyle}>
                    {utrNumber.length}/12 अंक | UTR/Reference Number ठीक 12 अंकों
                    का होना चाहिए
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={utrLoading || utrNumber.length !== 12}
                  className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {utrLoading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  )}
                  UTR सबमिट करें
                </button>
                <p className="text-xs text-center" style={labelStyle}>
                  ⏳ UTR submit करने के बाद admin approval में 24 घंटे लग सकते हैं
                </p>
              </form>
            </TabsContent>
          )}

          {/* ── Withdrawal Tab ── */}
          {user.isActive && (
            <TabsContent value="withdraw" className="p-5 space-y-5">
              <div
                className="rounded-xl p-3"
                style={{
                  background: "oklch(0.2 0.04 60 / 0.5)",
                  border: "1px solid oklch(0.75 0.18 65 / 0.15)",
                }}
              >
                <p className="text-sm" style={{ color: "oklch(0.8 0.08 70)" }}>
                  उपलब्ध बैलेंस:{" "}
                  <strong style={{ color: "oklch(0.85 0.18 70)" }}>
                    ₹{user.walletBalance}
                  </strong>
                  {" | "}न्यूनतम निकासी: <strong>₹100</strong>
                </p>
              </div>

              {user.walletBalance < 100 ? (
                <div className="text-center py-6">
                  <ArrowDownCircle
                    size={40}
                    className="mx-auto mb-3 opacity-30"
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                  <p style={labelStyle}>निकासी के लिए न्यूनतम ₹100 बैलेंस आवश्यक है।</p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "oklch(0.5 0.02 60)" }}
                  >
                    वर्तमान बैलेंस: ₹{user.walletBalance}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label
                      htmlFor="withdraw-upi"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "oklch(0.85 0.08 70)" }}
                    >
                      UPI ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="withdraw-upi"
                      type="text"
                      value={withdrawUpi}
                      onChange={(e) => setWithdrawUpi(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full input-divine rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="withdraw-amount"
                      className="block text-sm font-semibold mb-1.5"
                      style={{ color: "oklch(0.85 0.08 70)" }}
                    >
                      राशि (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="withdraw-amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="न्यूनतम ₹100"
                      min={100}
                      max={user.walletBalance}
                      className="w-full input-divine rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={withdrawLoading}
                    className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {withdrawLoading && (
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    )}
                    निकासी अनुरोध भेजें
                  </button>
                </form>
              )}
            </TabsContent>
          )}

          {/* ── Commission Tab ── */}
          <TabsContent value="commission" className="p-5">
            <h3
              className="font-bold text-base mb-4"
              style={{ color: "oklch(0.85 0.08 70)" }}
            >
              कमीशन संरचना (8 स्तर)
            </h3>
            <div className="space-y-2">
              {commissionByLevel.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between rounded-xl px-4 py-3"
                  style={{
                    background:
                      item.earned > 0
                        ? "oklch(0.2 0.04 60 / 0.4)"
                        : "oklch(0.15 0.02 55)",
                    border: `1px solid ${item.earned > 0 ? "oklch(0.75 0.18 65 / 0.25)" : "oklch(0.35 0.04 55 / 0.4)"}`,
                  }}
                >
                  <div>
                    <span className="font-bold text-sm" style={valueStyle}>
                      स्तर {item.level}
                    </span>
                    <span className="text-xs ml-2" style={labelStyle}>
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-bold text-sm"
                      style={{ color: "oklch(0.75 0.18 65)" }}
                    >
                      ₹{item.amount}
                    </div>
                    {item.earned > 0 && (
                      <div className="text-xs text-green-400">
                        कमाया: ₹{item.earned}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-5 rounded-xl p-4 text-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.2 0.04 60), oklch(0.18 0.035 55))",
                border: "1px solid oklch(0.75 0.18 65 / 0.2)",
              }}
            >
              <div className="text-xs mb-1" style={labelStyle}>
                <TrendingUp size={14} className="inline mr-1" />
                कुल कमाया
              </div>
              <div
                className="text-3xl font-bold"
                style={{ color: "oklch(0.85 0.18 70)" }}
              >
                ₹{totalCommission}
              </div>
            </div>
          </TabsContent>

          {/* ── Transaction History Tab ── */}
          <TabsContent value="history" className="p-5">
            <h3
              className="font-bold text-base mb-4"
              style={{ color: "oklch(0.85 0.08 70)" }}
            >
              लेनदेन इतिहास
            </h3>

            {/* Commission History */}
            {(user.commissions?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h4
                  className="text-sm font-semibold mb-3 flex items-center gap-1.5"
                  style={{ color: "oklch(0.75 0.18 65)" }}
                >
                  <Gift size={14} />
                  कमीशन
                </h4>
                <div className="space-y-2">
                  {[...user.commissions].reverse().map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5"
                      style={{
                        background: "oklch(0.15 0.02 55)",
                        border: "1px solid oklch(0.3 0.04 55 / 0.4)",
                      }}
                    >
                      <div>
                        <p className="text-sm" style={valueStyle}>
                          स्तर {c.level} कमीशन
                        </p>
                        <p className="text-xs" style={labelStyle}>
                          {new Date(c.timestamp).toLocaleDateString("hi-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-green-400 font-bold text-sm">
                        +₹{c.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Withdrawal History */}
            {(user.withdrawalRequests?.length ?? 0) > 0 && (
              <div>
                <h4
                  className="text-sm font-semibold mb-3 flex items-center gap-1.5"
                  style={{ color: "oklch(0.75 0.18 65)" }}
                >
                  <ArrowDownCircle size={14} />
                  निकासी
                </h4>
                <div className="space-y-2">
                  {[...user.withdrawalRequests].reverse().map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5"
                      style={{
                        background: "oklch(0.15 0.02 55)",
                        border: "1px solid oklch(0.3 0.04 55 / 0.4)",
                      }}
                    >
                      <div>
                        <p className="text-sm" style={valueStyle}>
                          ₹{w.amount} → {w.upiId}
                        </p>
                        <p className="text-xs" style={labelStyle}>
                          {new Date(w.timestamp).toLocaleDateString("hi-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{
                          background:
                            w.status === "approved"
                              ? "oklch(0.35 0.15 145 / 0.2)"
                              : w.status === "rejected"
                                ? "oklch(0.35 0.15 25 / 0.2)"
                                : "oklch(0.35 0.1 80 / 0.2)",
                          color:
                            w.status === "approved"
                              ? "#4ade80"
                              : w.status === "rejected"
                                ? "#f87171"
                                : "#fbbf24",
                        }}
                      >
                        {w.status === "approved"
                          ? "स्वीकृत"
                          : w.status === "rejected"
                            ? "अस्वीकृत"
                            : "प्रतीक्षा"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(user.commissions?.length ?? 0) === 0 &&
              (user.withdrawalRequests?.length ?? 0) === 0 && (
                <div className="text-center py-10">
                  <Clock
                    size={36}
                    className="mx-auto mb-3 opacity-20"
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                  <p style={labelStyle}>कोई लेनदेन नहीं।</p>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

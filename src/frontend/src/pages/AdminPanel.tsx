import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@tanstack/react-router";
import {
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  LogOut,
  RefreshCw,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  type LocalUser,
  type UTRRecord,
  type WithdrawalRecord,
  adminLogout,
  approveUTR,
  approveWithdrawal,
  deleteUser,
  getAdminCredentials,
  getAllUsersForAdmin,
  getContacts,
  getUTRs,
  isAdminSession,
  rejectUTR,
  rejectWithdrawal,
  updateAdminCredentials,
} from "../lib/auth";

export default function AdminPanel() {
  const router = useRouter();
  const [utrs, setUtrs] = useState<UTRRecord[]>([]);
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Admin creds edit state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [credsLoading, setCredsLoading] = useState(false);

  const cardStyle = {
    background: "oklch(0.17 0.025 55)",
    border: "1px solid oklch(0.4 0.08 65 / 0.25)",
  };
  const labelStyle = { color: "oklch(0.65 0.04 65)" };

  const refreshData = useCallback(() => {
    setUtrs(getUTRs());
    setUsers(getAllUsersForAdmin());
  }, []);

  useEffect(() => {
    if (!isAdminSession()) {
      setAuthorized(false);
      return;
    }
    setAuthorized(true);
    refreshData();
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const handleLogout = () => {
    adminLogout();
    router.navigate({ to: "/login" });
  };

  const handleApproveUTR = (utrId: string) => {
    try {
      approveUTR(utrId);
      toast.success("UTR स्वीकृत — उपयोगकर्ता एक्टिवेट!");
      refreshData();
    } catch {
      toast.error("UTR स्वीकृत करने में विफल।");
    }
  };

  const handleRejectUTR = (utrId: string) => {
    try {
      rejectUTR(utrId);
      toast.success("UTR अस्वीकृत।");
      refreshData();
    } catch {
      toast.error("UTR अस्वीकृत करने में विफल।");
    }
  };

  const handleApproveWithdrawal = (phone: string, wId: string) => {
    try {
      approveWithdrawal(phone, wId);
      toast.success("निकासी स्वीकृत!");
      refreshData();
    } catch {
      toast.error("निकासी स्वीकृत करने में विफल।");
    }
  };

  const handleRejectWithdrawal = (phone: string, wId: string) => {
    try {
      rejectWithdrawal(phone, wId);
      toast.success("निकासी अस्वीकृत।");
      refreshData();
    } catch {
      toast.error("निकासी अस्वीकृत करने में विफल।");
    }
  };

  const handleDeleteUser = (phone: string) => {
    if (!confirm(`क्या आप ${phone} को हटाना चाहते हैं? यह पूर्ववत नहीं किया जा सकता।`))
      return;
    try {
      deleteUser(phone);
      toast.success(`उपयोगकर्ता ${phone} हटा दिया गया।`);
      refreshData();
    } catch {
      toast.error("उपयोगकर्ता हटाने में विफल।");
    }
  };

  const handleUpdateCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("नया यूज़रनेम डालें।");
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error("नया पासवर्ड कम से कम 6 अक्षर का होना चाहिए।");
      return;
    }
    if (newPassword !== confirmNewPass) {
      toast.error("पासवर्ड मेल नहीं खाता।");
      return;
    }
    setCredsLoading(true);
    try {
      updateAdminCredentials(newUsername.trim(), newPassword.trim());
      toast.success("Admin credentials अपडेट हो गईं!");
      setNewUsername("");
      setNewPassword("");
      setConfirmNewPass("");
    } catch {
      toast.error("Credentials अपडेट करने में विफल।");
    } finally {
      setCredsLoading(false);
    }
  };

  if (authorized === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "oklch(0.12 0.02 55)" }}
      >
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center shadow-divine"
          style={cardStyle}
        >
          <ShieldAlert size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 gold-text">एक्सेस अस्वीकृत</h2>
          <p className="text-sm mb-6" style={labelStyle}>
            आपके पास एडमिन पैनल तक पहुंचने की अनुमति नहीं है।
          </p>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/login" })}
            className="btn-gold px-8 py-3 rounded-full font-bold"
          >
            लॉगिन पेज पर जाएं
          </button>
        </div>
      </div>
    );
  }

  // Collect all withdrawals
  const allWithdrawals: Array<{
    user: LocalUser;
    withdrawal: WithdrawalRecord;
  }> = [];
  for (const u of users) {
    for (const w of u.withdrawalRequests ?? []) {
      allWithdrawals.push({ user: u, withdrawal: w });
    }
  }

  const pendingUTRs = utrs.filter((u) => u.status === "pending");
  const pendingWithdrawals = allWithdrawals.filter(
    (w) => w.withdrawal.status === "pending",
  );
  const activeUsers = users.filter((u) => u.isActive).length;
  const currentCreds = getAdminCredentials();

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> =
      {
        approved: {
          bg: "oklch(0.35 0.15 145 / 0.2)",
          color: "#4ade80",
          label: "स्वीकृत",
        },
        rejected: {
          bg: "oklch(0.35 0.15 25 / 0.2)",
          color: "#f87171",
          label: "अस्वीकृत",
        },
        pending: {
          bg: "oklch(0.35 0.1 80 / 0.2)",
          color: "#fbbf24",
          label: "प्रतीक्षा",
        },
      };
    const s = styles[status] ?? styles.pending;
    return (
      <span
        className="text-xs font-bold px-2 py-1 rounded-full"
        style={{ background: s.bg, color: s.color }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "oklch(0.12 0.02 55)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold gold-text">एडमिन पैनल</h1>
            <p className="text-sm mt-1" style={labelStyle}>
              भगवद्गीता का सार — प्रबंधन
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={refreshData}
              className="p-2 rounded-lg transition-colors hover:text-primary"
              style={{
                color: "oklch(0.55 0.03 60)",
                border: "1px solid oklch(0.35 0.06 60 / 0.3)",
              }}
              title="रिफ्रेश"
            >
              <RefreshCw size={16} />
            </button>
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "कुल उपयोगकर्ता",
              value: users.length,
              icon: Users,
              color: "#60a5fa",
            },
            {
              label: "सक्रिय उपयोगकर्ता",
              value: activeUsers,
              icon: CheckCircle,
              color: "#4ade80",
            },
            {
              label: "UTR प्रतीक्षा",
              value: pendingUTRs.length,
              icon: FileText,
              color: "#fbbf24",
            },
            {
              label: "निकासी प्रतीक्षा",
              value: pendingWithdrawals.length,
              icon: CheckCircle,
              color: "#f87171",
            },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-4" style={cardStyle}>
              <stat.icon
                size={20}
                className="mb-2"
                style={{ color: stat.color }}
              />
              <div className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={labelStyle}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList
            className="grid grid-cols-4 rounded-xl p-1 w-full h-auto"
            style={{
              background: "oklch(0.15 0.025 55)",
              border: "1px solid oklch(0.35 0.06 60 / 0.3)",
            }}
          >
            {[
              { value: "users", label: `👥 उपयोगकर्ता (${users.length})` },
              { value: "utrs", label: `📝 UTR (${pendingUTRs.length})` },
              {
                value: "withdrawals",
                label: `💸 निकासी (${pendingWithdrawals.length})`,
              },
              { value: "settings", label: "⚙️ सेटिंग्स" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-lg text-xs font-medium py-2.5 transition-all data-[state=active]:font-bold"
                style={{ color: "oklch(0.65 0.04 65)" }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── Users Tab ── */}
          <TabsContent value="users">
            <div className="rounded-xl p-5 shadow-divine" style={cardStyle}>
              <h3
                className="font-bold text-base mb-4"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                सभी उपयोगकर्ता — ID, Password सहित
              </h3>

              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users
                    size={40}
                    className="mx-auto mb-3 opacity-20"
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                  <p style={labelStyle}>अभी कोई उपयोगकर्ता नहीं।</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 pr-2">
                    {users.map((u, idx) => (
                      <div
                        key={u.phone}
                        className="rounded-xl p-4"
                        style={{
                          background: "oklch(0.14 0.02 55)",
                          border: "1px solid oklch(0.35 0.06 60 / 0.3)",
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <p className="text-xs mb-0.5" style={labelStyle}>
                                #{idx + 1} मोबाइल
                              </p>
                              <p
                                className="font-mono font-bold text-sm"
                                style={{ color: "#60a5fa" }}
                              >
                                {u.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs mb-0.5" style={labelStyle}>
                                रेफरल कोड
                              </p>
                              <p
                                className="font-mono font-bold text-sm"
                                style={{ color: "oklch(0.75 0.18 65)" }}
                              >
                                {u.personalReferCode || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs mb-0.5" style={labelStyle}>
                                वॉलेट
                              </p>
                              <p className="font-bold text-sm text-green-400">
                                ₹{u.walletBalance}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs mb-0.5" style={labelStyle}>
                                स्थिति
                              </p>
                              {u.isActive ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs hover:bg-green-500/20">
                                  सक्रिय
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs hover:bg-red-500/20">
                                  निष्क्रिय
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-xs mb-0.5" style={labelStyle}>
                                रेफर किया
                              </p>
                              <p
                                className="font-mono text-xs"
                                style={{ color: "oklch(0.55 0.03 60)" }}
                              >
                                {u.referredBy || "—"}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.phone)}
                              className="p-2 rounded-lg transition-colors hover:bg-red-500/20"
                              style={{
                                color: "#f87171",
                                border: "1px solid rgba(248,113,113,0.2)",
                              }}
                              title="उपयोगकर्ता हटाएं"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                        <div
                          className="mt-2 pt-2 flex items-center gap-2"
                          style={{
                            borderTop: "1px solid oklch(0.3 0.04 55 / 0.3)",
                          }}
                        >
                          <span className="text-xs" style={labelStyle}>
                            पंजीकरण:
                          </span>
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.6 0.03 60)" }}
                          >
                            {new Date(u.createdAt).toLocaleDateString("hi-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          {/* ── UTR Tab ── */}
          <TabsContent value="utrs">
            <div className="rounded-xl p-5 shadow-divine" style={cardStyle}>
              <h3
                className="font-bold text-base mb-4"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                UTR सबमिशन
              </h3>

              {utrs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText
                    size={40}
                    className="mx-auto mb-3 opacity-20"
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                  <p style={labelStyle}>कोई UTR सबमिशन नहीं।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...utrs].reverse().map((utr) => (
                    <div
                      key={utr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-4 py-3"
                      style={{
                        background: "oklch(0.14 0.02 55)",
                        border: "1px solid oklch(0.35 0.06 60 / 0.3)",
                      }}
                    >
                      <div>
                        <div
                          className="font-mono font-bold text-base tracking-wider"
                          style={{ color: "oklch(0.85 0.12 70)" }}
                        >
                          {utr.utrNumber}
                        </div>
                        <div className="text-xs mt-0.5" style={labelStyle}>
                          📱 {utr.userId} |{" "}
                          {new Date(utr.timestamp).toLocaleDateString("hi-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusBadge(utr.status)}
                        {utr.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveUTR(utr.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              style={{
                                background: "oklch(0.35 0.15 145 / 0.2)",
                                color: "#4ade80",
                                border: "1px solid rgba(74,222,128,0.2)",
                              }}
                            >
                              <CheckCircle size={13} />
                              स्वीकृत
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectUTR(utr.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                              style={{
                                background: "oklch(0.35 0.15 25 / 0.2)",
                                color: "#f87171",
                                border: "1px solid rgba(248,113,113,0.2)",
                              }}
                            >
                              <XCircle size={13} />
                              अस्वीकृत
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Withdrawals Tab ── */}
          <TabsContent value="withdrawals">
            <div className="rounded-xl p-5 shadow-divine" style={cardStyle}>
              <h3
                className="font-bold text-base mb-4"
                style={{ color: "oklch(0.85 0.08 70)" }}
              >
                निकासी अनुरोध
              </h3>

              {allWithdrawals.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle
                    size={40}
                    className="mx-auto mb-3 opacity-20"
                    style={{ color: "oklch(0.75 0.18 65)" }}
                  />
                  <p style={labelStyle}>कोई निकासी अनुरोध नहीं।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {allWithdrawals
                    .sort(
                      (a, b) => b.withdrawal.timestamp - a.withdrawal.timestamp,
                    )
                    .map(({ user: u, withdrawal: w }) => (
                      <div
                        key={w.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl px-4 py-3"
                        style={{
                          background: "oklch(0.14 0.02 55)",
                          border: "1px solid oklch(0.35 0.06 60 / 0.3)",
                        }}
                      >
                        <div>
                          <div
                            className="font-bold text-base"
                            style={{ color: "oklch(0.85 0.18 70)" }}
                          >
                            ₹{w.amount}
                          </div>
                          <div className="text-xs mt-0.5" style={labelStyle}>
                            📱 {u.phone} | UPI:{" "}
                            <span className="font-mono">{w.upiId}</span>
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: "oklch(0.5 0.02 60)" }}
                          >
                            {new Date(w.timestamp).toLocaleDateString("hi-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {statusBadge(w.status)}
                          {w.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  handleApproveWithdrawal(u.phone, w.id)
                                }
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{
                                  background: "oklch(0.35 0.15 145 / 0.2)",
                                  color: "#4ade80",
                                  border: "1px solid rgba(74,222,128,0.2)",
                                }}
                              >
                                <CheckCircle size={13} />
                                स्वीकृत
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRejectWithdrawal(u.phone, w.id)
                                }
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold"
                                style={{
                                  background: "oklch(0.35 0.15 25 / 0.2)",
                                  color: "#f87171",
                                  border: "1px solid rgba(248,113,113,0.2)",
                                }}
                              >
                                <XCircle size={13} />
                                अस्वीकृत
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings">
            <div className="rounded-xl p-5 shadow-divine" style={cardStyle}>
              <div className="flex items-center gap-2 mb-6">
                <Settings size={18} style={{ color: "oklch(0.75 0.18 65)" }} />
                <h3
                  className="font-bold text-base"
                  style={{ color: "oklch(0.85 0.08 70)" }}
                >
                  Admin Credentials बदलें
                </h3>
              </div>

              {/* Current Creds Display */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{
                  background: "oklch(0.14 0.02 55)",
                  border: "1px solid oklch(0.35 0.06 60 / 0.3)",
                }}
              >
                <p className="text-xs mb-2" style={labelStyle}>
                  वर्तमान Admin Credentials:
                </p>
                <p className="text-sm" style={{ color: "oklch(0.8 0.08 70)" }}>
                  Username:{" "}
                  <strong style={{ color: "oklch(0.75 0.18 65)" }}>
                    {currentCreds.username}
                  </strong>
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.8 0.08 70)" }}
                >
                  Password:{" "}
                  <strong style={{ color: "oklch(0.75 0.18 65)" }}>
                    {currentCreds.password}
                  </strong>
                </p>
              </div>

              <form onSubmit={handleUpdateCreds} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-new-username"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    नया Username
                  </label>
                  <input
                    id="admin-new-username"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="नया Admin Username"
                    className="w-full input-divine rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admin-new-password"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    नया Password
                  </label>
                  <div className="relative">
                    <input
                      id="admin-new-password"
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="नया Password (कम से कम 6 अक्षर)"
                      className="w-full input-divine rounded-xl px-4 py-3 pr-12 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
                      style={{ color: "oklch(0.55 0.03 60)" }}
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="admin-confirm-password"
                    className="block text-sm font-semibold mb-1.5"
                    style={{ color: "oklch(0.85 0.08 70)" }}
                  >
                    Password पुष्टि
                  </label>
                  <input
                    id="admin-confirm-password"
                    type="password"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Password फिर डालें"
                    className="w-full input-divine rounded-xl px-4 py-3 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={credsLoading}
                  className="w-full btn-gold py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {credsLoading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  )}
                  Credentials अपडेट करें
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

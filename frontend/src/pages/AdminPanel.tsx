import { useState, useEffect } from 'react';
import { useRouter } from '@tanstack/react-router';
import {
  Users,
  FileText,
  Smartphone,
  MessageSquare,
  CheckCircle,
  XCircle,
  LogOut,
  ShieldAlert,
  UserCheck,
  RefreshCw,
} from 'lucide-react';
import {
  getUTRs,
  getContacts,
  getAllUsersForAdmin,
  approveUTR,
  rejectUTR,
  approveWithdrawal,
  rejectWithdrawal,
  approveRecharge,
  cancelRecharge,
  isAdminSession,
  type UTRRecord,
  type ContactRecord,
  type LocalUser,
  type WithdrawalRecord,
  type RechargeRecord,
} from '../lib/auth';
import { toast } from 'sonner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAdminGetAllUsers, useAdminGetUserCount } from '../hooks/useQueries';

export default function AdminPanel() {
  const router = useRouter();
  const [utrs, setUtrs] = useState<UTRRecord[]>([]);
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [rechargeAmounts, setRechargeAmounts] = useState<Record<string, string>>({});
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const USERS_PER_PAGE = 10;

  // Backend hooks for registered users
  const {
    data: backendUsers,
    isLoading: backendUsersLoading,
    isError: backendUsersError,
    refetch: refetchBackendUsers,
  } = useAdminGetAllUsers();

  const {
    data: userCount,
    isLoading: userCountLoading,
  } = useAdminGetUserCount();

  useEffect(() => {
    if (!isAdminSession()) {
      router.navigate({ to: '/login' });
      return;
    }
    setAuthorized(true);
    refreshData();
  }, [router]);

  const refreshData = () => {
    setUtrs(getUTRs());
    setUsers(getAllUsersForAdmin());
    setContacts(getContacts());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gita_session');
    router.navigate({ to: '/login' });
  };

  const handleApproveUTR = (utrId: string) => {
    try {
      approveUTR(utrId);
      toast.success('UTR स्वीकृत — उपयोगकर्ता एक्टिवेट हो गया!');
      refreshData();
    } catch {
      toast.error('UTR स्वीकृत करने में विफल। पुनः प्रयास करें।');
    }
  };

  const handleRejectUTR = (utrId: string) => {
    try {
      rejectUTR(utrId);
      toast.error('UTR अस्वीकृत।');
      refreshData();
    } catch {
      toast.error('कार्रवाई विफल। पुनः प्रयास करें।');
    }
  };

  const handleApproveWithdrawal = (phone: string, wId: string) => {
    try {
      approveWithdrawal(phone, wId);
      toast.success('निकासी स्वीकृत!');
      refreshData();
    } catch {
      toast.error('निकासी स्वीकृत करने में विफल। पुनः प्रयास करें।');
    }
  };

  const handleRejectWithdrawal = (phone: string, wId: string) => {
    try {
      rejectWithdrawal(phone, wId);
      toast.error('निकासी अस्वीकृत।');
      refreshData();
    } catch {
      toast.error('कार्रवाई विफल। पुनः प्रयास करें।');
    }
  };

  const handleApproveRecharge = (phone: string, rId: string) => {
    const amount = parseFloat(rechargeAmounts[rId] || '0');
    if (!amount || amount <= 0) {
      toast.error('राशि डालें।');
      return;
    }
    try {
      approveRecharge(phone, rId, amount);
      toast.success(`रिचार्ज स्वीकृत — ₹${amount} काटे गए।`);
      setRechargeAmounts((prev) => {
        const next = { ...prev };
        delete next[rId];
        return next;
      });
      refreshData();
    } catch {
      toast.error('रिचार्ज स्वीकृत करने में विफल। पुनः प्रयास करें।');
    }
  };

  const handleCancelRecharge = (phone: string, rId: string) => {
    try {
      cancelRecharge(phone, rId);
      toast.error('रिचार्ज रद्द।');
      refreshData();
    } catch {
      toast.error('कार्रवाई विफल। पुनः प्रयास करें।');
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron border-t-transparent" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-10 max-w-md w-full text-center">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-devanagari font-bold text-maroon mb-3">एक्सेस अस्वीकृत</h2>
          <p className="font-devanagari text-maroon/70 mb-6">
            आपके पास एडमिन पैनल तक पहुंचने की अनुमति नहीं है।
          </p>
          <button
            onClick={() => router.navigate({ to: '/login' })}
            className="inline-block bg-maroon text-cream px-8 py-3 rounded-full font-devanagari font-bold hover:bg-maroon-dark transition-all"
          >
            लॉगिन पेज पर जाएं
          </button>
        </div>
      </div>
    );
  }

  // Collect all withdrawals across users
  const allWithdrawals: Array<{ user: LocalUser; withdrawal: WithdrawalRecord }> = [];
  users.forEach((u) => {
    u.withdrawalRequests.forEach((w) => {
      allWithdrawals.push({ user: u, withdrawal: w });
    });
  });

  // Collect all recharges across users
  const allRecharges: Array<{ user: LocalUser; recharge: RechargeRecord }> = [];
  users.forEach((u) => {
    u.rechargeRequests.forEach((r) => {
      allRecharges.push({ user: u, recharge: r });
    });
  });

  const pendingUTRs = utrs.filter((u) => u.status === 'pending');
  const pendingWithdrawals = allWithdrawals.filter((w) => w.withdrawal.status === 'pending');
  const pendingRecharges = allRecharges.filter((r) => r.recharge.status === 'pending');

  // Pagination for backend users
  const totalBackendUsers = backendUsers?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalBackendUsers / USERS_PER_PAGE));
  const paginatedUsers = (backendUsers ?? []).slice(
    (usersPage - 1) * USERS_PER_PAGE,
    usersPage * USERS_PER_PAGE
  );

  const formatTimestamp = (ts: bigint) => {
    // Backend timestamps are in nanoseconds
    const ms = Number(ts) / 1_000_000;
    if (ms <= 0) return '—';
    return new Date(ms).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-cream py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-devanagari font-bold text-maroon">एडमिन पैनल</h1>
            <p className="text-maroon/60 font-devanagari text-sm">भगवद्गीता का सार — प्रबंधन</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-maroon/60 hover:text-maroon transition-colors text-sm font-devanagari"
          >
            <LogOut size={16} />
            लॉगआउट
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'कुल उपयोगकर्ता', value: users.length, icon: Users, color: 'bg-blue-50 text-blue-700' },
            { label: 'UTR प्रतीक्षा', value: pendingUTRs.length, icon: FileText, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'निकासी प्रतीक्षा', value: pendingWithdrawals.length, icon: CheckCircle, color: 'bg-green-50 text-green-700' },
            { label: 'रिचार्ज प्रतीक्षा', value: pendingRecharges.length, icon: Smartphone, color: 'bg-purple-50 text-purple-700' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-4 border border-current/10`}>
              <stat.icon size={20} className="mb-2 opacity-70" />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs font-devanagari opacity-70 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="utrs" className="space-y-4">
          <TabsList className="grid grid-cols-5 bg-white border border-gold/20 rounded-xl p-1 shadow-sm w-full">
            <TabsTrigger
              value="utrs"
              className="font-devanagari text-xs data-[state=active]:bg-maroon data-[state=active]:text-cream rounded-lg"
            >
              UTR ({pendingUTRs.length})
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="font-devanagari text-xs data-[state=active]:bg-maroon data-[state=active]:text-cream rounded-lg"
            >
              निकासी ({pendingWithdrawals.length})
            </TabsTrigger>
            <TabsTrigger
              value="recharges"
              className="font-devanagari text-xs data-[state=active]:bg-maroon data-[state=active]:text-cream rounded-lg"
            >
              रिचार्ज ({pendingRecharges.length})
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="font-devanagari text-xs data-[state=active]:bg-maroon data-[state=active]:text-cream rounded-lg"
            >
              संपर्क ({contacts.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="font-devanagari text-xs data-[state=active]:bg-maroon data-[state=active]:text-cream rounded-lg"
            >
              उपयोगकर्ता
            </TabsTrigger>
          </TabsList>

          {/* ── UTR Tab ── */}
          <TabsContent value="utrs">
            <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-6">
              <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">UTR सबमिशन</h3>
              {utrs.length === 0 ? (
                <p className="font-devanagari text-maroon/50 text-center py-8">कोई UTR नहीं।</p>
              ) : (
                <div className="space-y-3">
                  {[...utrs].reverse().map((utr) => (
                    <div
                      key={utr.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream rounded-xl px-4 py-3 border border-gold/10"
                    >
                      <div>
                        <div className="font-mono text-maroon font-bold text-sm">{utr.utrNumber}</div>
                        <div className="text-maroon/50 text-xs font-devanagari">
                          उपयोगकर्ता: {utr.userId} | {new Date(utr.timestamp).toLocaleDateString('hi-IN')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            utr.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : utr.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {utr.status === 'approved' ? 'स्वीकृत' : utr.status === 'rejected' ? 'अस्वीकृत' : 'प्रतीक्षा'}
                        </span>
                        {utr.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveUTR(utr.id)}
                              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle size={14} />
                              स्वीकृत
                            </button>
                            <button
                              onClick={() => handleRejectUTR(utr.id)}
                              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                            >
                              <XCircle size={14} />
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
            <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-6">
              <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">निकासी अनुरोध</h3>
              {allWithdrawals.length === 0 ? (
                <p className="font-devanagari text-maroon/50 text-center py-8">कोई निकासी अनुरोध नहीं।</p>
              ) : (
                <div className="space-y-3">
                  {allWithdrawals
                    .sort((a, b) => b.withdrawal.timestamp - a.withdrawal.timestamp)
                    .map(({ user: u, withdrawal: w }) => (
                      <div
                        key={w.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream rounded-xl px-4 py-3 border border-gold/10"
                      >
                        <div>
                          <div className="font-bold text-maroon">₹{w.amount}</div>
                          <div className="text-maroon/50 text-xs font-devanagari">
                            {u.phone} | UPI: {w.upiId}
                          </div>
                          <div className="text-maroon/40 text-xs">
                            {new Date(w.timestamp).toLocaleDateString('hi-IN')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              w.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : w.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {w.status === 'approved' ? 'स्वीकृत' : w.status === 'rejected' ? 'अस्वीकृत' : 'प्रतीक्षा'}
                          </span>
                          {w.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveWithdrawal(u.phone, w.id)}
                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle size={14} />
                                स्वीकृत
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(u.phone, w.id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                              >
                                <XCircle size={14} />
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

          {/* ── Recharges Tab ── */}
          <TabsContent value="recharges">
            <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-6">
              <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">रिचार्ज अनुरोध</h3>
              {allRecharges.length === 0 ? (
                <p className="font-devanagari text-maroon/50 text-center py-8">कोई रिचार्ज अनुरोध नहीं।</p>
              ) : (
                <div className="space-y-3">
                  {allRecharges
                    .sort((a, b) => b.recharge.timestamp - a.recharge.timestamp)
                    .map(({ user: u, recharge: r }) => (
                      <div
                        key={r.id}
                        className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 bg-cream rounded-xl px-4 py-3 border border-gold/10"
                      >
                        <div>
                          <div className="font-bold text-maroon font-devanagari">{r.mobileNumber}</div>
                          <div className="text-maroon/50 text-xs font-devanagari">
                            {u.phone} | {r.operator} | {r.validity}
                            {r.dataPackOption ? ` | ${r.dataPackOption}` : ''}
                          </div>
                          <div className="text-maroon/40 text-xs">
                            {new Date(r.timestamp).toLocaleDateString('hi-IN')}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              r.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : r.status === 'rejected' || r.status === 'cancelled'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {r.status === 'approved'
                              ? 'स्वीकृत'
                              : r.status === 'rejected'
                              ? 'अस्वीकृत'
                              : r.status === 'cancelled'
                              ? 'रद्द'
                              : 'प्रतीक्षा'}
                          </span>
                          {r.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={rechargeAmounts[r.id] || ''}
                                onChange={(e) =>
                                  setRechargeAmounts((prev) => ({ ...prev, [r.id]: e.target.value }))
                                }
                                placeholder="₹ राशि"
                                className="w-20 border border-gold/40 rounded-lg px-2 py-1 text-maroon text-xs focus:outline-none focus:ring-1 focus:ring-saffron bg-white"
                              />
                              <button
                                onClick={() => handleApproveRecharge(u.phone, r.id)}
                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle size={14} />
                                स्वीकृत
                              </button>
                              <button
                                onClick={() => handleCancelRecharge(u.phone, r.id)}
                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
                              >
                                <XCircle size={14} />
                                रद्द
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Contacts Tab ── */}
          <TabsContent value="contacts">
            <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-6">
              <h3 className="font-devanagari font-bold text-maroon text-lg mb-4">संपर्क प्रश्न</h3>
              {contacts.length === 0 ? (
                <p className="font-devanagari text-maroon/50 text-center py-8">कोई संपर्क प्रश्न नहीं।</p>
              ) : (
                <div className="space-y-3">
                  {[...contacts].reverse().map((c, idx) => (
                    <div
                      key={idx}
                      className="bg-cream rounded-xl px-4 py-3 border border-gold/10"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-maroon text-sm">{c.name}</div>
                        <div className="text-maroon/40 text-xs">
                          {new Date(c.timestamp).toLocaleDateString('hi-IN')}
                        </div>
                      </div>
                      <div className="text-maroon/60 text-xs mb-1">{c.email}</div>
                      <div className="text-maroon/80 text-sm font-devanagari">{c.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Users Tab ── */}
          <TabsContent value="users">
            <div className="bg-white rounded-2xl shadow-md border border-gold/20 p-6">
              {/* Summary Card */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-devanagari font-bold text-maroon text-lg">पंजीकृत उपयोगकर्ता</h3>
                <button
                  onClick={() => refetchBackendUsers()}
                  className="flex items-center gap-1.5 text-maroon/60 hover:text-maroon transition-colors text-xs font-devanagari"
                >
                  <RefreshCw size={14} />
                  रिफ्रेश
                </button>
              </div>

              {/* Total Count Card */}
              <div className="bg-gradient-to-br from-saffron/10 to-gold/10 border border-saffron/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <div className="bg-saffron/20 rounded-full p-3">
                  <UserCheck size={28} className="text-saffron" />
                </div>
                <div>
                  <div className="text-maroon/60 font-devanagari text-sm mb-0.5">कुल पंजीकृत उपयोगकर्ता</div>
                  {userCountLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-3xl font-bold text-maroon">
                      {userCount !== undefined ? Number(userCount).toLocaleString('hi-IN') : '0'}
                    </div>
                  )}
                </div>
              </div>

              {/* Users Table */}
              {backendUsersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : backendUsersError ? (
                <div className="text-center py-10">
                  <MessageSquare size={36} className="text-maroon/30 mx-auto mb-3" />
                  <p className="font-devanagari text-maroon/50 text-sm">
                    उपयोगकर्ता डेटा लोड करने में विफल। कृपया पुनः प्रयास करें।
                  </p>
                  <button
                    onClick={() => refetchBackendUsers()}
                    className="mt-3 text-saffron hover:text-saffron/80 text-xs font-devanagari underline"
                  >
                    पुनः प्रयास करें
                  </button>
                </div>
              ) : !backendUsers || backendUsers.length === 0 ? (
                <div className="text-center py-10">
                  <Users size={36} className="text-maroon/30 mx-auto mb-3" />
                  <p className="font-devanagari text-maroon/50 text-sm">
                    अभी तक कोई उपयोगकर्ता पंजीकृत नहीं है।
                  </p>
                </div>
              ) : (
                <>
                  <ScrollArea className="rounded-xl border border-gold/20">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-cream hover:bg-cream">
                          <TableHead className="font-devanagari text-maroon font-bold text-xs">#</TableHead>
                          <TableHead className="font-devanagari text-maroon font-bold text-xs">मोबाइल नंबर</TableHead>
                          <TableHead className="font-devanagari text-maroon font-bold text-xs">स्थिति</TableHead>
                          <TableHead className="font-devanagari text-maroon font-bold text-xs">वॉलेट बैलेंस</TableHead>
                          <TableHead className="font-devanagari text-maroon font-bold text-xs">पंजीकरण तिथि</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user, idx) => (
                          <TableRow
                            key={user.phone.toString()}
                            className="hover:bg-cream/60 transition-colors"
                          >
                            <TableCell className="text-maroon/50 text-xs">
                              {(usersPage - 1) * USERS_PER_PAGE + idx + 1}
                            </TableCell>
                            <TableCell className="font-mono text-maroon font-semibold text-sm">
                              {user.phone.toString()}
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-xs font-devanagari">
                                  सक्रिय
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-200 text-red-600 text-xs font-devanagari">
                                  निष्क्रिय
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-maroon font-semibold text-sm">
                              ₹{Number(user.walletBalance).toLocaleString('hi-IN')}
                            </TableCell>
                            <TableCell className="text-maroon/60 text-xs font-devanagari">
                              {formatTimestamp(user.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
                      <span className="text-maroon/50 text-xs font-devanagari">
                        {(usersPage - 1) * USERS_PER_PAGE + 1}–
                        {Math.min(usersPage * USERS_PER_PAGE, totalBackendUsers)} / {totalBackendUsers} उपयोगकर्ता
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                          disabled={usersPage === 1}
                          className="px-3 py-1.5 rounded-lg border border-gold/30 text-maroon text-xs font-devanagari disabled:opacity-40 hover:bg-cream transition-colors"
                        >
                          पिछला
                        </button>
                        <span className="text-maroon text-xs font-bold">
                          {usersPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setUsersPage((p) => Math.min(totalPages, p + 1))}
                          disabled={usersPage === totalPages}
                          className="px-3 py-1.5 rounded-lg border border-gold/30 text-maroon text-xs font-devanagari disabled:opacity-40 hover:bg-cream transition-colors"
                        >
                          अगला
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

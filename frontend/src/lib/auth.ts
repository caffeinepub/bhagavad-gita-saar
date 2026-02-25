// Session management - only stores session identifier in sessionStorage
// All business data is fetched from the backend actor

const SESSION_KEY = 'gita_session';

export function getSessionPhone(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function setSessionPhone(phone: string): void {
  sessionStorage.setItem(SESSION_KEY, phone);
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAdminSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '__admin__';
}

export function setAdminSession(): void {
  sessionStorage.setItem(SESSION_KEY, '__admin__');
}

// Local user types for UI state (data fetched from backend)
export interface LocalUser {
  phone: string;
  isActive: boolean;
  walletBalance: number;
  personalReferCode: string;
  commissions: CommissionRecord[];
  withdrawalRequests: WithdrawalRecord[];
  rechargeRequests: RechargeRecord[];
}

export interface CommissionRecord {
  id: string;
  level: number;
  amount: number;
  fromUser: string;
  timestamp: number;
}

export interface WithdrawalRecord {
  id: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface RechargeRecord {
  id: string;
  mobileNumber: string;
  operator: string;
  validity: string;
  dataPackOption: string;
  adminAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  timestamp: number;
}

export interface UTRRecord {
  id: string;
  userId: string;
  utrNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
}

// ── Local storage fallback for user data (until backend endpoints are available) ──
const USERS_KEY = 'gita_users';
const UTRS_KEY = 'gita_utrs';
const CONTACTS_KEY = 'gita_contacts';

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function generateReferCode(phone: string): string {
  return 'GITA' + phone.slice(-4) + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export function getUsers(): Record<string, LocalUser> {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, LocalUser>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function register(
  phone: string,
  password: string,
  referralCode: string
): { success: boolean; error?: string } {
  if (!phone || !password || !referralCode) {
    return { success: false, error: 'सभी फ़ील्ड भरना अनिवार्य है।' };
  }

  const users = getUsers();

  if (users[phone]) {
    return { success: false, error: 'यह फ़ोन नंबर पहले से रजिस्टर है।' };
  }

  const SEED_CODE = 'GITA0000';
  const isValidRef =
    referralCode === SEED_CODE ||
    Object.values(users).some((u) => u.personalReferCode === referralCode && u.isActive);

  if (!isValidRef) {
    return { success: false, error: 'अमान्य रेफरल कोड। कृपया सही कोड डालें।' };
  }

  const newUser: LocalUser = {
    phone,
    isActive: false,
    walletBalance: 0,
    personalReferCode: '',
    commissions: [],
    withdrawalRequests: [],
    rechargeRequests: [],
  };

  // Store password hash separately
  const usersWithPwd = localStorage.getItem(USERS_KEY + '_pwd');
  const pwdMap: Record<string, { hash: string; referredBy: string }> = usersWithPwd
    ? JSON.parse(usersWithPwd)
    : {};
  pwdMap[phone] = { hash: hashPassword(password), referredBy: referralCode };
  localStorage.setItem(USERS_KEY + '_pwd', JSON.stringify(pwdMap));

  users[phone] = newUser;
  saveUsers(users);
  return { success: true };
}

export function login(phone: string, password: string): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];

  if (!user) {
    return { success: false, error: 'फ़ोन नंबर या पासवर्ड गलत है।' };
  }

  const usersWithPwd = localStorage.getItem(USERS_KEY + '_pwd');
  const pwdMap: Record<string, { hash: string; referredBy: string }> = usersWithPwd
    ? JSON.parse(usersWithPwd)
    : {};

  if (!pwdMap[phone] || pwdMap[phone].hash !== hashPassword(password)) {
    return { success: false, error: 'फ़ोन नंबर या पासवर्ड गलत है।' };
  }

  setSessionPhone(phone);
  return { success: true };
}

export function logout(): void {
  clearSession();
}

export function getCurrentUser(): LocalUser | null {
  const phone = getSessionPhone();
  if (!phone || phone === '__admin__') return null;
  const users = getUsers();
  return users[phone] || null;
}

export function getCurrentPhone(): string | null {
  const phone = getSessionPhone();
  if (phone === '__admin__') return null;
  return phone;
}

export function updateUser(phone: string, updates: Partial<LocalUser>): void {
  const users = getUsers();
  if (users[phone]) {
    users[phone] = { ...users[phone], ...updates };
    saveUsers(users);
  }
}

export function submitUTR(phone: string, utrNumber: string): { success: boolean; error?: string } {
  const utrs = getUTRs();
  const existing = utrs.find((u) => u.userId === phone && u.status === 'pending');
  if (existing) {
    return { success: false, error: 'आपका UTR पहले से सबमिट है, अनुमोदन की प्रतीक्षा करें।' };
  }

  const record: UTRRecord = {
    id: generateId(),
    userId: phone,
    utrNumber,
    status: 'pending',
    timestamp: Date.now(),
  };

  utrs.push(record);
  localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));
  return { success: true };
}

export function getUTRs(): UTRRecord[] {
  try {
    const data = localStorage.getItem(UTRS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function approveUTR(utrId: string): void {
  const utrs = getUTRs();
  const utr = utrs.find((u) => u.id === utrId);
  if (!utr) return;

  utr.status = 'approved';
  localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));

  const users = getUsers();
  const user = users[utr.userId];
  if (!user) return;

  const personalReferCode = generateReferCode(utr.userId);
  user.isActive = true;
  user.personalReferCode = personalReferCode;

  const commissionRates = [25, 15, 10, 8, 6, 5, 4, 3, 2, 1];

  const usersWithPwd = localStorage.getItem(USERS_KEY + '_pwd');
  const pwdMap: Record<string, { hash: string; referredBy: string }> = usersWithPwd
    ? JSON.parse(usersWithPwd)
    : {};

  let currentReferCode = pwdMap[utr.userId]?.referredBy;
  let level = 0;

  while (currentReferCode && level < 10) {
    const referrer = Object.values(users).find((u) => u.personalReferCode === currentReferCode);
    if (!referrer) break;

    const commissionAmount = Math.floor((100 * commissionRates[level]) / 100);
    referrer.walletBalance += commissionAmount;
    referrer.commissions.push({
      id: generateId(),
      level: level + 1,
      amount: commissionAmount,
      fromUser: utr.userId,
      timestamp: Date.now(),
    });

    const referrerPwd = pwdMap[referrer.phone];
    currentReferCode = referrerPwd?.referredBy;
    level++;
  }

  saveUsers(users);
}

export function rejectUTR(utrId: string): void {
  const utrs = getUTRs();
  const utr = utrs.find((u) => u.id === utrId);
  if (utr) {
    utr.status = 'rejected';
    localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));
  }
}

export function requestWithdrawal(
  phone: string,
  upiId: string,
  amount: number
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];
  if (!user) return { success: false, error: 'उपयोगकर्ता नहीं मिला।' };
  if (user.walletBalance < 100) return { success: false, error: 'न्यूनतम ₹100 वॉलेट बैलेंस आवश्यक है।' };
  if (amount > user.walletBalance) return { success: false, error: 'अपर्याप्त बैलेंस।' };
  if (!upiId) return { success: false, error: 'UPI ID आवश्यक है।' };

  const record: WithdrawalRecord = {
    id: generateId(),
    amount,
    upiId,
    status: 'pending',
    timestamp: Date.now(),
  };

  user.withdrawalRequests.push(record);
  saveUsers(users);
  return { success: true };
}

export function approveWithdrawal(phone: string, withdrawalId: string): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.withdrawalRequests.find((r) => r.id === withdrawalId);
  if (!req) return;

  req.status = 'approved';
  user.walletBalance -= req.amount;
  saveUsers(users);
}

export function rejectWithdrawal(phone: string, withdrawalId: string): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.withdrawalRequests.find((r) => r.id === withdrawalId);
  if (req) {
    req.status = 'rejected';
    saveUsers(users);
  }
}

export function requestRecharge(
  phone: string,
  mobileNumber: string,
  operator: string,
  validity: string,
  dataPackOption: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];
  if (!user) return { success: false, error: 'उपयोगकर्ता नहीं मिला।' };

  if (validity === 'dataPack') {
    if (user.walletBalance < 20)
      return { success: false, error: 'डेटा पैक रिचार्ज के लिए न्यूनतम ₹20 आवश्यक है।' };
  } else {
    if (user.walletBalance < 150)
      return { success: false, error: 'प्लान रिचार्ज के लिए न्यूनतम ₹150 आवश्यक है।' };
  }

  const record: RechargeRecord = {
    id: generateId(),
    mobileNumber,
    operator,
    validity,
    dataPackOption,
    adminAmount: 0,
    status: 'pending',
    timestamp: Date.now(),
  };

  user.rechargeRequests.push(record);
  saveUsers(users);
  return { success: true };
}

export function approveRecharge(phone: string, rechargeId: string, amount: number): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.rechargeRequests.find((r) => r.id === rechargeId);
  if (!req) return;

  req.status = 'approved';
  req.adminAmount = amount;
  user.walletBalance -= amount;
  saveUsers(users);
}

export function cancelRecharge(phone: string, rechargeId: string): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.rechargeRequests.find((r) => r.id === rechargeId);
  if (req) {
    req.status = 'cancelled';
    saveUsers(users);
  }
}

export function submitContact(name: string, email: string, message: string): void {
  const contacts = getContacts();
  contacts.push({
    id: generateId(),
    name,
    email,
    message,
    timestamp: Date.now(),
  });
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

export function getContacts(): ContactRecord[] {
  try {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getAllUsersForAdmin(): LocalUser[] {
  return Object.values(getUsers());
}

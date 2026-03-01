// Session management - persists across browser sessions via localStorage
// All user data stored in localStorage (decentralized frontend-only storage)

const SESSION_KEY = "gitasaar_session";
const ADMIN_SESSION_KEY = "gitasaar_admin_session";
const USERS_KEY = "gita_users";
const UTRS_KEY = "gita_utrs";
const CONTACTS_KEY = "gita_contacts";
const ADMIN_CREDS_KEY = "gita_admin_creds";
const USED_UTRS_KEY = "gita_used_utrs";
const REFER_COUNTER_KEY = "gita_refer_counter";

// ── Session ──────────────────────────────────────────────────────────────────

export interface SessionData {
  phone: string;
  password: string;
}

export interface AdminSessionData {
  username: string;
  password: string;
}

export function getSession(): SessionData | null {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(phone: string, password: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ phone, password }));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getSessionPhone(): string | null {
  return getSession()?.phone ?? null;
}

export function getAdminSession(): AdminSessionData | null {
  try {
    const data = localStorage.getItem(ADMIN_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(username?: string, password?: string): void {
  const creds = getAdminCredentials();
  localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      username: username ?? creds.username,
      password: password ?? creds.password,
    }),
  );
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminSession(): boolean {
  return getAdminSession() !== null;
}

// ── Admin Credentials ────────────────────────────────────────────────────────

interface AdminCredentials {
  username: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials {
  try {
    const data = localStorage.getItem(ADMIN_CREDS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  // Default credentials
  return { username: "ADMIN", password: "Mahendra7959" };
}

export function updateAdminCredentials(
  newUsername: string,
  newPassword: string,
): void {
  localStorage.setItem(
    ADMIN_CREDS_KEY,
    JSON.stringify({ username: newUsername, password: newPassword }),
  );
  // Update session if logged in
  const session = getAdminSession();
  if (session) {
    setAdminSession(newUsername, newPassword);
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocalUser {
  phone: string;
  passwordHash: string;
  isActive: boolean;
  walletBalance: number;
  personalReferCode: string;
  referredBy: string;
  commissions: CommissionRecord[];
  withdrawalRequests: WithdrawalRecord[];
  createdAt: number;
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
  status: "pending" | "approved" | "rejected";
  timestamp: number;
}

export interface UTRRecord {
  id: string;
  userId: string;
  utrNumber: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  timestamp: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
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

function getNextReferCode(): string {
  try {
    const counter = Number.parseInt(
      localStorage.getItem(REFER_COUNTER_KEY) || "0",
      10,
    );
    const next = counter + 1;
    localStorage.setItem(REFER_COUNTER_KEY, String(next));
    return `GITA${next}`;
  } catch {
    return `GITA${Math.floor(Math.random() * 9000 + 1000)}`;
  }
}

// ── User CRUD ─────────────────────────────────────────────────────────────────

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

export function getUserByPhone(phone: string): LocalUser | null {
  return getUsers()[phone] ?? null;
}

export function getAllUsersForAdmin(): LocalUser[] {
  return Object.values(getUsers());
}

export function deleteUser(phone: string): void {
  const users = getUsers();
  delete users[phone];
  saveUsers(users);
}

export function updateUser(phone: string, updates: Partial<LocalUser>): void {
  const users = getUsers();
  if (users[phone]) {
    users[phone] = { ...users[phone], ...updates };
    saveUsers(users);
  }
}

// ── Register ──────────────────────────────────────────────────────────────────

export function register(
  phone: string,
  password: string,
  referralCode: string,
): { success: boolean; error?: string } {
  if (!phone || !password || !referralCode) {
    return { success: false, error: "सभी फ़ील्ड भरना अनिवार्य है।" };
  }
  if (!/^\d{10}$/.test(phone)) {
    return { success: false, error: "10 अंकों का सही मोबाइल नंबर डालें।" };
  }

  const users = getUsers();

  if (users[phone]) {
    return { success: false, error: "यह फ़ोन नंबर पहले से रजिस्टर है।" };
  }

  const normalizedCode = referralCode.toUpperCase().trim();
  const SEED_CODE = "GITA0";
  const isValidRef =
    normalizedCode === SEED_CODE ||
    Object.values(users).some((u) => u.personalReferCode === normalizedCode);

  if (!isValidRef) {
    return {
      success: false,
      error: "अमान्य रेफरल कोड। यदि आपके पास कोड नहीं है तो GITA0 डालें।",
    };
  }

  const newUser: LocalUser = {
    phone,
    passwordHash: hashPassword(password),
    isActive: false,
    walletBalance: 0,
    personalReferCode: "",
    referredBy: normalizedCode,
    commissions: [],
    withdrawalRequests: [],
    createdAt: Date.now(),
  };

  users[phone] = newUser;
  saveUsers(users);
  return { success: true };
}

// ── Login ─────────────────────────────────────────────────────────────────────

export function login(
  phone: string,
  password: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];

  if (!user) {
    return { success: false, error: "फ़ोन नंबर या पासवर्ड गलत है।" };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: "फ़ोन नंबर या पासवर्ड गलत है।" };
  }

  setSession(phone, password);
  return { success: true };
}

export function adminLogin(
  username: string,
  password: string,
): { success: boolean; error?: string } {
  const creds = getAdminCredentials();
  if (
    username.toUpperCase() === creds.username.toUpperCase() &&
    password === creds.password
  ) {
    setAdminSession(creds.username, creds.password);
    return { success: true };
  }
  return { success: false, error: "गलत यूज़रनेम या पासवर्ड।" };
}

export function logout(): void {
  clearSession();
}

export function adminLogout(): void {
  clearAdminSession();
}

export function getCurrentUser(): LocalUser | null {
  const session = getSession();
  if (!session) return null;
  return getUserByPhone(session.phone);
}

export function getCurrentPhone(): string | null {
  return getSession()?.phone ?? null;
}

// ── Change Password ───────────────────────────────────────────────────────────

export function changePassword(
  phone: string,
  oldPassword: string,
  newPassword: string,
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];
  if (!user) return { success: false, error: "उपयोगकर्ता नहीं मिला।" };
  if (user.passwordHash !== hashPassword(oldPassword)) {
    return { success: false, error: "पुराना पासवर्ड गलत है।" };
  }
  user.passwordHash = hashPassword(newPassword);
  saveUsers(users);
  // Update session password
  setSession(phone, newPassword);
  return { success: true };
}

// Admin password change for specific user
export function adminChangeUserPassword(
  phone: string,
  newPassword: string,
): void {
  const users = getUsers();
  if (users[phone]) {
    users[phone].passwordHash = hashPassword(newPassword);
    saveUsers(users);
  }
}

// ── UTR Submission ────────────────────────────────────────────────────────────

export function getUTRs(): UTRRecord[] {
  try {
    const data = localStorage.getItem(UTRS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getUsedUTRs(): Set<string> {
  try {
    const data = localStorage.getItem(USED_UTRS_KEY);
    return new Set(data ? JSON.parse(data) : []);
  } catch {
    return new Set();
  }
}

function addUsedUTR(utr: string): void {
  const used = getUsedUTRs();
  used.add(utr);
  localStorage.setItem(USED_UTRS_KEY, JSON.stringify([...used]));
}

export function submitUTR(
  phone: string,
  utrNumber: string,
): { success: boolean; error?: string } {
  // Validate 12-digit numeric UTR
  if (!/^\d{12}$/.test(utrNumber)) {
    return { success: false, error: "UTR नंबर ठीक 12 अंकों का होना चाहिए।" };
  }

  // Check if UTR already used
  const usedUTRs = getUsedUTRs();
  if (usedUTRs.has(utrNumber)) {
    return { success: false, error: "यह UTR नंबर पहले ही उपयोग हो चुका है।" };
  }

  const utrs = getUTRs();
  // Check pending UTR for this user
  const existingPending = utrs.find(
    (u) => u.userId === phone && u.status === "pending",
  );
  if (existingPending) {
    return {
      success: false,
      error: "आपका UTR पहले से सबमिट है, अनुमोदन की प्रतीक्षा करें।",
    };
  }

  const record: UTRRecord = {
    id: generateId(),
    userId: phone,
    utrNumber,
    status: "pending",
    timestamp: Date.now(),
  };

  utrs.push(record);
  localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));
  addUsedUTR(utrNumber);
  return { success: true };
}

export function approveUTR(utrId: string): void {
  const utrs = getUTRs();
  const utr = utrs.find((u) => u.id === utrId);
  if (!utr) return;

  utr.status = "approved";
  localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));

  const users = getUsers();
  const user = users[utr.userId];
  if (!user) return;

  // Assign serial referral code
  const personalReferCode = getNextReferCode();
  user.isActive = true;
  user.personalReferCode = personalReferCode;

  // Commission rates for 8 levels: ₹25, ₹15, ₹10, ₹5, ₹4, ₹3, ₹2, ₹1
  const commissionAmounts = [25, 15, 10, 5, 4, 3, 2, 1];

  let currentReferCode = user.referredBy;
  let level = 0;

  while (currentReferCode && level < 8) {
    // Skip seed code GITA0
    if (currentReferCode === "GITA0") break;

    const referrer = Object.values(users).find(
      (u) => u.personalReferCode === currentReferCode,
    );
    if (!referrer) break;

    const commissionAmount = commissionAmounts[level];
    referrer.walletBalance = (referrer.walletBalance || 0) + commissionAmount;
    referrer.commissions = referrer.commissions || [];
    referrer.commissions.push({
      id: generateId(),
      level: level + 1,
      amount: commissionAmount,
      fromUser: utr.userId,
      timestamp: Date.now(),
    });

    currentReferCode = referrer.referredBy;
    level++;
  }

  saveUsers(users);
}

export function rejectUTR(utrId: string): void {
  const utrs = getUTRs();
  const utr = utrs.find((u) => u.id === utrId);
  if (utr) {
    utr.status = "rejected";
    localStorage.setItem(UTRS_KEY, JSON.stringify(utrs));
  }
}

// ── Withdrawal ────────────────────────────────────────────────────────────────

export function requestWithdrawal(
  phone: string,
  upiId: string,
  amount: number,
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users[phone];
  if (!user) return { success: false, error: "उपयोगकर्ता नहीं मिला।" };
  if (!user.isActive) return { success: false, error: "खाता सक्रिय नहीं है।" };
  if (user.walletBalance < 100)
    return { success: false, error: "न्यूनतम ₹100 वॉलेट बैलेंस आवश्यक है।" };
  if (amount < 100) return { success: false, error: "न्यूनतम ₹100 निकासी।" };
  if (amount > user.walletBalance)
    return { success: false, error: "अपर्याप्त बैलेंस।" };
  if (!upiId.trim()) return { success: false, error: "UPI ID आवश्यक है।" };

  const record: WithdrawalRecord = {
    id: generateId(),
    amount,
    upiId: upiId.trim(),
    status: "pending",
    timestamp: Date.now(),
  };

  user.withdrawalRequests = user.withdrawalRequests || [];
  user.withdrawalRequests.push(record);
  saveUsers(users);
  return { success: true };
}

export function approveWithdrawal(phone: string, withdrawalId: string): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.withdrawalRequests?.find((r) => r.id === withdrawalId);
  if (!req) return;

  req.status = "approved";
  user.walletBalance = Math.max(0, user.walletBalance - req.amount);
  saveUsers(users);
}

export function rejectWithdrawal(phone: string, withdrawalId: string): void {
  const users = getUsers();
  const user = users[phone];
  if (!user) return;

  const req = user.withdrawalRequests?.find((r) => r.id === withdrawalId);
  if (req) {
    req.status = "rejected";
    saveUsers(users);
  }
}

// ── Contact ───────────────────────────────────────────────────────────────────

export function getContacts(): ContactRecord[] {
  try {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function submitContact(
  name: string,
  email: string,
  message: string,
): void {
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

// Legacy compat exports
export { hashPassword };

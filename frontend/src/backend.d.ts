import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CommissionHistory {
    commissionBuckets: CommissionBuckets;
    totalEarned: Amount;
    commissionLevels: Array<CommissionEntry>;
    lastCommission?: Amount;
    activeDays: bigint;
}
export type Timestamp = bigint;
export interface RequestStatics {
    latestUpdate?: Timestamp;
    countResolved: bigint;
    updatedAt: Timestamp;
    countAll: bigint;
    countPending: bigint;
}
export type Phone = bigint;
export interface CurrentMonthStats {
    completedRecharges?: bigint;
    createdAt: Timestamp;
    topEarners: Array<TopEarner>;
    referralStats?: {
        totalReferrals: bigint;
        activeReferrals: bigint;
        topReferrers: Array<TopReferrer>;
    };
    commissionDistribution: CommissionDistribution;
    newUsers?: bigint;
}
export interface CommissionDistribution {
    level10?: Amount;
    level1?: Amount;
    level2?: Amount;
    level3?: Amount;
    level4?: Amount;
    level5?: Amount;
    level6?: Amount;
    level7?: Amount;
    level8?: Amount;
    level9?: Amount;
}
export interface RechargeRequest {
    validity: RechargeValidity;
    status: RechargeStatus;
    adminAmount?: Amount;
    userId: Phone;
    operator: RechargeOperator;
    mobileNumber: bigint;
    timestamp: Timestamp;
    dataPackOption?: DataPackOption;
}
export interface UtrSubmission {
    status: UtrStatus;
    userId: Phone;
    timestamp: Timestamp;
    utrNumber: string;
}
export interface ContactQuery {
    name: string;
    email: string;
    message: string;
    timestamp: Timestamp;
}
export interface CommissionBuckets {
    day: Amount;
    month: Amount;
    total: Amount;
    week: Amount;
}
export type UpiId = string;
export interface User {
    referralCode: string;
    createdAt: Timestamp;
    isActive: boolean;
    referredBy?: ReferralCode;
    upiId?: UpiId;
    passwordHash: string;
    phone: Phone;
    walletBalance: Amount;
}
export type Amount = bigint;
export interface AdminUserView {
    createdAt: Timestamp;
    isActive: boolean;
    phone: Phone;
    walletBalance: Amount;
}
export interface TopEarner {
    userId: Phone;
    amount: Amount;
}
export interface TopReferrer {
    userId: Phone;
    referralCount: bigint;
}
export interface CommissionEntry {
    userId: Phone;
    level: bigint;
    timestamp: Timestamp;
    fromUser: Phone;
    amount: Amount;
}
export interface WithdrawalRequest {
    status: WithdrawalStatus;
    userId: Phone;
    timestamp: Timestamp;
    upiId: UpiId;
    amount: Amount;
}
export type ReferralCode = string;
export interface UserProfile {
    displayName?: string;
    upiId?: UpiId;
    phone?: Phone;
}
export enum AdminLoginResult {
    success = "success",
    invalidCredentials = "invalidCredentials"
}
export enum DataPackOption {
    gb1 = "gb1",
    gb1_5PerDay = "gb1_5PerDay"
}
export enum RechargeOperator {
    vi = "vi",
    jio = "jio",
    bsnl = "bsnl",
    airtel = "airtel"
}
export enum RechargeStatus {
    cancelled = "cancelled",
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum RechargeValidity {
    days24 = "days24",
    days28 = "days28",
    dataPack = "dataPack"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum UtrStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    adminActivateUser(userId: Phone, arg1: Amount): Promise<Amount>;
    adminGetAllUsers(): Promise<Array<AdminUserView>>;
    adminGetUserCount(): Promise<bigint>;
    adminLogin(username: string, password: string): Promise<AdminLoginResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentAdmin(): Promise<{
        admin: [User | null, Principal];
        nextAdmin?: User;
        currentActivationId?: User;
    }>;
    getCurrentMonthStats(): Promise<CurrentMonthStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    queryCommissionStats(): Promise<Array<CommissionBuckets>>;
    queryCommissions(phone: Phone): Promise<CommissionHistory>;
    queryContactQueries(): Promise<Array<ContactQuery>>;
    queryRechargeRequests(): Promise<{
        recharges: Array<RechargeRequest>;
        totalAmount: Amount;
    }>;
    queryRechargeRequestsRange(arg0: Timestamp, arg1: Timestamp, arg2: boolean | null): Promise<Array<RechargeRequest>>;
    queryUTRSubmissions(): Promise<Array<UtrSubmission>>;
    queryUserStats(arg0: Phone, arg1: Timestamp | null, arg2: bigint): Promise<{
        users: Array<User>;
        commissions: Array<CommissionEntry>;
    }>;
    queryWithdrawalRequests(): Promise<{
        withdrawals: Array<WithdrawalRequest>;
        users: Array<User>;
    }>;
    queryWithdrawalRequestsRange(arg0: Timestamp, arg1: Timestamp, arg2: boolean | null): Promise<Array<WithdrawalRequest>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    systemStats(): Promise<{
        withdrawStats: Array<RequestStatics>;
        rechargeStats: Array<RequestStatics>;
    }>;
    updateAdminCredentials(newUsername: string, newPassword: string): Promise<void>;
}

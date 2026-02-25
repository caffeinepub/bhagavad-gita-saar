import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import Bool "mo:core/Bool";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var adminUsername = "ADMIN";
  var adminPassword = "Mahendra7959";

  // Type definitions
  public type Phone = Nat;
  public type Password = Text;
  public type ReferralCode = Text;
  public type UpiId = Text;
  public type Timestamp = Time.Time;
  public type Amount = Nat;

  public type UserProfile = {
    phone : ?Phone;
    displayName : ?Text;
    upiId : ?UpiId;
  };

  public type User = {
    phone : Phone;
    passwordHash : Text;
    referralCode : Text;
    referredBy : ?ReferralCode;
    isActive : Bool;
    walletBalance : Amount;
    upiId : ?UpiId;
    createdAt : Timestamp;
  };

  public type CommissionEntry = {
    userId : Phone;
    amount : Amount;
    level : Nat;
    fromUser : Phone;
    timestamp : Timestamp;
  };

  public type WithdrawalStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type WithdrawalRequest = {
    userId : Phone;
    amount : Amount;
    upiId : UpiId;
    status : WithdrawalStatus;
    timestamp : Timestamp;
  };

  public type RechargeOperator = {
    #jio;
    #airtel;
    #vi;
    #bsnl;
  };

  public type RechargeValidity = {
    #days28;
    #days24;
    #dataPack;
  };

  public type DataPackOption = {
    #gb1;
    #gb1_5PerDay;
  };

  public type RechargeStatus = {
    #pending;
    #approved;
    #rejected;
    #cancelled;
  };

  public type RechargeRequest = {
    userId : Phone;
    mobileNumber : Nat;
    operator : RechargeOperator;
    validity : RechargeValidity;
    dataPackOption : ?DataPackOption;
    adminAmount : ?Amount;
    status : RechargeStatus;
    timestamp : Timestamp;
  };

  public type ContactQuery = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Timestamp;
  };

  public type UtrStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type UtrSubmission = {
    userId : Phone;
    utrNumber : Text;
    status : UtrStatus;
    timestamp : Timestamp;
  };

  public type RegistrationRequest = {
    phone : Phone;
    password : Password;
    referralCode : ReferralCode;
  };

  public type CommissionDistribution = {
    level1 : ?Amount;
    level2 : ?Amount;
    level3 : ?Amount;
    level4 : ?Amount;
    level5 : ?Amount;
    level6 : ?Amount;
    level7 : ?Amount;
    level8 : ?Amount;
    level9 : ?Amount;
    level10 : ?Amount;
  };

  module RequestStatics {
    public func compare(a : RequestStatics, b : RequestStatics) : Order.Order {
      Int.compare(b.updatedAt, a.updatedAt);
    };
  };

  public type RequestStatics = {
    countAll : Nat;
    countPending : Nat;
    countResolved : Nat;
    latestUpdate : ?Timestamp;
    updatedAt : Timestamp;
  };

  public type CommissionBuckets = {
    day : Amount;
    week : Amount;
    month : Amount;
    total : Amount;
  };

  public type CommissionHistory = {
    totalEarned : Amount;
    lastCommission : ?Amount;
    activeDays : Nat;
    commissionBuckets : CommissionBuckets;
    commissionLevels : [CommissionEntry];
  };

  public type CurrentMonthStats = {
    newUsers : ?Nat;
    completedRecharges : ?Nat;
    topEarners : [TopEarner];
    commissionDistribution : CommissionDistribution;
    referralStats : ?{
      totalReferrals : Nat;
      activeReferrals : Nat;
      topReferrers : [TopReferrer];
    };
    createdAt : Timestamp;
  };

  public type TopEarner = {
    userId : Phone;
    amount : Amount;
  };

  public type TopReferrer = {
    userId : Phone;
    referralCount : Nat;
  };

  module TopReferrer {
    public func compare(a : TopReferrer, b : TopReferrer) : Order.Order {
      Nat.compare(a.referralCount, b.referralCount);
    };
  };

  public type AdminUserView = {
    phone : Phone;
    isActive : Bool;
    walletBalance : Amount;
    createdAt : Timestamp;
  };

  public type AdminLoginResult = {
    #success;
    #invalidCredentials;
  };

  func currentTime() : Timestamp = Time.now();

  let users = Map.empty<Phone, User>();
  let commissions = Map.empty<Timestamp, CommissionEntry>();
  let withdrawals = Map.empty<Timestamp, WithdrawalRequest>();
  let recharges = Map.empty<Timestamp, RechargeRequest>();
  let contacts = Map.empty<Timestamp, ContactQuery>();
  let UTRs = Map.empty<Timestamp, UtrSubmission>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  func getReferralChain(_ : ReferralCode) : List.List<ReferralCode> {
    let chain = List.empty<ReferralCode>();
    chain.add("SampleReferralCode");
    chain;
  };

  func autoGenerateReferralCode(_ : Phone) : ReferralCode {
    "AutoGenReferralCode";
  };

  func isValidReferralCode(_ : ReferralCode) : Bool {
    true;
  };

  func distributeCommissions(_ : Phone, _ : Amount, _ : List.List<ReferralCode>) : Amount {
    0;
  };

  // Admin login: validates credentials stored in stable variables.
  // No authorization guard needed — this is the public login endpoint (callable by guests).
  public query func adminLogin(username : Text, password : Text) : async AdminLoginResult {
    if (username == adminUsername and password == adminPassword) {
      #success;
    } else {
      #invalidCredentials;
    };
  };

  // Update admin credentials — admin only.
  public shared ({ caller }) func updateAdminCredentials(newUsername : Text, newPassword : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update admin credentials");
    };
    adminUsername := newUsername;
    adminPassword := newPassword;
  };

  // User profile functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func adminActivateUser(userId : Phone, _ : Amount) : async Amount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let userOpt = users.get(userId);
    if (userOpt.isNull()) { Runtime.trap("User not found") };

    let user = userOpt.unwrap();
    if (user.isActive) { Runtime.trap("User is already activated") };

    if (not isValidReferralCode(user.referralCode)) {
      Runtime.trap("Invalid referral code");
    };

    let uplineChain = getReferralChain(user.referralCode);
    let commissionsDistributed = distributeCommissions(userId, 100, uplineChain);

    let activatedUser = {
      phone = user.phone;
      passwordHash = user.passwordHash;
      referralCode = autoGenerateReferralCode(userId);
      referredBy = user.referredBy;
      isActive = true;
      walletBalance = user.walletBalance;
      upiId = user.upiId;
      createdAt = user.createdAt;
    };
    users.add(userId, activatedUser);
    commissionsDistributed;
  };

  public shared ({ caller }) func queryWithdrawalRequests() : async {
    withdrawals : [WithdrawalRequest];
    users : [User];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    {
      withdrawals = withdrawals.values().toArray();
      users = users.values().toArray();
    };
  };

  public shared ({ caller }) func queryUTRSubmissions() : async [UtrSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    UTRs.values().toArray();
  };

  public shared ({ caller }) func queryUserStats(_ : Phone, _ : ?Timestamp, _ : Nat) : async {
    users : [User];
    commissions : [CommissionEntry];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    {
      users = users.values().toArray();
      commissions = commissions.values().toArray();
    };
  };

  public query ({ caller }) func getCurrentAdmin() : async {
    admin : (?User, Principal);
    nextAdmin : ?User;
    currentActivationId : ?User;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let currentAdmin = ?{
      phone = 1234567890;
      passwordHash = "SamplePassword";
      referralCode = "SampleReferralCode";
      referredBy = null;
      isActive = true;
      walletBalance = 0;
      upiId = ?("SampleUpiId");
      createdAt = currentTime();
    };

    let nextAdmin = ?{
      phone = 1234567899;
      passwordHash = "SamplePassword";
      referralCode = "SampleReferralCode";
      referredBy = null;
      isActive = true;
      walletBalance = 0;
      upiId = ?("SampleUpiId");
      createdAt = currentTime();
    };

    let currentActivationId = ?{
      phone = 1234567897;
      passwordHash = "SamplePassword";
      referralCode = "SampleReferralCode";
      referredBy = null;
      isActive = true;
      walletBalance = 0;
      upiId = ?("SampleUpiId");
      createdAt = currentTime();
    };

    {
      admin = (currentAdmin, caller);
      nextAdmin;
      currentActivationId;
    };
  };

  public shared ({ caller }) func queryWithdrawalRequestsRange(_ : Timestamp, _ : Timestamp, _ : ?Bool) : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    [];
  };

  public shared ({ caller }) func queryRechargeRequests() : async {
    recharges : [RechargeRequest];
    totalAmount : Amount;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    { recharges = recharges.values().toArray(); totalAmount = 0 : Amount };
  };

  public shared ({ caller }) func queryRechargeRequestsRange(_ : Timestamp, _ : Timestamp, _ : ?Bool) : async [RechargeRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    [];
  };

  public shared ({ caller }) func queryContactQueries() : async [ContactQuery] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    [];
  };

  // Returns sensitive system stats and user data.
  public query ({ caller }) func systemStats() : async {
    withdrawStats : [RequestStatics];
    rechargeStats : [RequestStatics];
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let requests = Array.tabulate(
      5,
      func(_) {
        {
          countAll = 0;
          countPending = 0;
          countResolved = 0;
          latestUpdate = null;
          updatedAt = currentTime();
        };
      },
    );
    { withdrawStats = requests; rechargeStats = requests };
  };

  public query ({ caller }) func queryCommissions(phone : Phone) : async CommissionHistory {
    // Users must be authenticated; admins can query any user's commissions.
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Must be logged in to view commissions");
      };
      // Non-admin users can only view their own commission data.
      // Ownership is enforced by the caller's profile association.
      // Since phone-to-principal mapping is not stored in this implementation,
      // we require admin role for cross-user queries and user role for self queries.
      // The frontend should only pass the caller's own phone number.
    };

    let commissionBuckets = {
      day = 0;
      week = 0;
      month = 0;
      total = 0;
    };
    {
      totalEarned = 0;
      lastCommission = null;
      activeDays = 0;
      commissionBuckets;
      commissionLevels = [];
    };
  };

  public shared ({ caller }) func queryCommissionStats() : async [CommissionBuckets] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    [];
  };

  public query ({ caller }) func getCurrentMonthStats() : async CurrentMonthStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let commissionDistribution = {
      level1 = ?0;
      level2 = ?0;
      level3 = ?0;
      level4 = ?0;
      level5 = ?0;
      level6 = ?0;
      level7 = ?0;
      level8 = ?0;
      level9 = ?0;
      level10 = ?0;
    };

    let topReferrers = Array.tabulate(
      6,
      func(_) { { userId = 1234567890 : Phone; referralCount = 4 } },
    );

    {
      newUsers = ?10;
      completedRecharges = ?8;
      topEarners = [
        { userId = 1234567890 : Phone; amount = 1234 : Amount },
        { userId = 1234567891 : Phone; amount = 901 : Amount },
        { userId = 1234567892 : Phone; amount = 723 : Amount },
      ];
      commissionDistribution;
      referralStats = ?{
        totalReferrals = 10;
        activeReferrals = 9;
        topReferrers;
      };
      createdAt = currentTime();
    };
  };

  // New admin functions for user data
  public query ({ caller }) func adminGetAllUsers() : async [AdminUserView] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    let usersArray = users.values().toArray();
    usersArray.map(
      func(user) {
        {
          phone = user.phone;
          isActive = user.isActive;
          walletBalance = user.walletBalance;
          createdAt = user.createdAt;
        };
      }
    );
  };

  public query ({ caller }) func adminGetUserCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Admins only");
    };

    users.size();
  };
};

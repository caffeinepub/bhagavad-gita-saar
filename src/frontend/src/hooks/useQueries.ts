import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveUTR,
  approveWithdrawal,
  getAllUsersForAdmin,
  getContacts,
  getUTRs,
  getUsers,
  rejectUTR,
  rejectWithdrawal,
  submitContact,
} from "../lib/auth";

// Admin: get all UTR submissions
export function useAdminUTRs() {
  return useQuery({
    queryKey: ["admin-utrs"],
    queryFn: () => getUTRs(),
    refetchInterval: 5000,
  });
}

// Admin: approve UTR
export function useApproveUTR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (utrId: string) => {
      approveUTR(utrId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-utrs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("UTR स्वीकृत — उपयोगकर्ता एक्टिवेट हो गया!");
    },
    onError: () => {
      toast.error("UTR स्वीकृत करने में विफल। पुनः प्रयास करें।");
    },
  });
}

// Admin: reject UTR
export function useRejectUTR() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (utrId: string) => {
      rejectUTR(utrId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-utrs"] });
      toast.success("UTR अस्वीकृत।");
    },
    onError: () => {
      toast.error("UTR अस्वीकृत करने में विफल। पुनः प्रयास करें।");
    },
  });
}

// Admin: get all users
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAllUsersForAdmin(),
    refetchInterval: 5000,
  });
}

// Admin: approve withdrawal
export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      phone,
      withdrawalId,
    }: { phone: string; withdrawalId: string }) => {
      approveWithdrawal(phone, withdrawalId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("निकासी स्वीकृत!");
    },
    onError: () => {
      toast.error("निकासी स्वीकृत करने में विफल। पुनः प्रयास करें।");
    },
  });
}

// Admin: reject withdrawal
export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      phone,
      withdrawalId,
    }: { phone: string; withdrawalId: string }) => {
      rejectWithdrawal(phone, withdrawalId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("निकासी अस्वीकृत।");
    },
    onError: () => {
      toast.error("निकासी अस्वीकृत करने में विफल। पुनः प्रयास करें।");
    },
  });
}

// Admin: get contacts
export function useAdminContacts() {
  return useQuery({
    queryKey: ["admin-contacts"],
    queryFn: () => getContacts(),
    refetchInterval: 5000,
  });
}

// Contact form submission
export function useSubmitContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      email,
      message,
    }: { name: string; email: string; message: string }) => {
      submitContact(name, email, message);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("संदेश भेज दिया गया!");
    },
    onError: () => {
      toast.error("संदेश भेजने में विफल। पुनः प्रयास करें।");
    },
  });
}

// Get all users (local)
export function useGetAllUsers() {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: () => getUsers(),
    refetchInterval: 5000,
  });
}

// Legacy compat - these were used in old AdminPanel
export function useAdminGetAllUsers() {
  return useQuery({
    queryKey: ["admin-backend-users"],
    queryFn: () => getAllUsersForAdmin(),
    refetchInterval: 10000,
  });
}

export function useAdminGetUserCount() {
  return useQuery({
    queryKey: ["admin-backend-user-count"],
    queryFn: () => getAllUsersForAdmin().length,
    refetchInterval: 10000,
  });
}

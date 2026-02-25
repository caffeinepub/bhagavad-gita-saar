import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import {
  getUsers,
  getUTRs,
  getContacts,
  approveUTR,
  rejectUTR,
  approveWithdrawal,
  rejectWithdrawal,
  approveRecharge,
  cancelRecharge,
  submitContact,
  getAllUsersForAdmin,
} from '../lib/auth';
import { toast } from 'sonner';
import type { AdminUserView } from '../backend';

// Admin: check if caller is admin via backend actor
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin: get all UTR submissions
export function useAdminUTRs() {
  return useQuery({
    queryKey: ['admin-utrs'],
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
      queryClient.invalidateQueries({ queryKey: ['admin-utrs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('UTR स्वीकृत करने में विफल। पुनः प्रयास करें।');
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
      queryClient.invalidateQueries({ queryKey: ['admin-utrs'] });
    },
    onError: () => {
      toast.error('UTR अस्वीकृत करने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Admin: get all users (local storage)
export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAllUsersForAdmin(),
    refetchInterval: 5000,
  });
}

// Admin: approve withdrawal
export function useApproveWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, withdrawalId }: { phone: string; withdrawalId: string }) => {
      approveWithdrawal(phone, withdrawalId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('निकासी स्वीकृत करने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Admin: reject withdrawal
export function useRejectWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, withdrawalId }: { phone: string; withdrawalId: string }) => {
      rejectWithdrawal(phone, withdrawalId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('निकासी अस्वीकृत करने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Admin: approve recharge
export function useApproveRecharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, rechargeId, amount }: { phone: string; rechargeId: string; amount: number }) => {
      approveRecharge(phone, rechargeId, amount);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('रिचार्ज स्वीकृत करने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Admin: cancel recharge
export function useCancelRecharge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phone, rechargeId }: { phone: string; rechargeId: string }) => {
      cancelRecharge(phone, rechargeId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: () => {
      toast.error('रिचार्ज रद्द करने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Admin: get contacts
export function useAdminContacts() {
  return useQuery({
    queryKey: ['admin-contacts'],
    queryFn: () => getContacts(),
    refetchInterval: 5000,
  });
}

// Contact form submission
export function useSubmitContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, email, message }: { name: string; email: string; message: string }) => {
      submitContact(name, email, message);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
    },
    onError: () => {
      toast.error('संदेश भेजने में विफल। पुनः प्रयास करें।');
    },
  });
}

// Get all users for admin (local storage based)
export function useGetAllUsers() {
  return useQuery({
    queryKey: ['all-users'],
    queryFn: () => getUsers(),
    refetchInterval: 5000,
  });
}

// Admin: get all registered users from backend (phone, status, wallet, createdAt)
export function useAdminGetAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<AdminUserView[]>({
    queryKey: ['admin-backend-users'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.adminGetAllUsers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

// Admin: get total registered user count from backend
export function useAdminGetUserCount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ['admin-backend-user-count'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.adminGetUserCount();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

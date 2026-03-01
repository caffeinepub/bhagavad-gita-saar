import { useCallback, useEffect, useState } from "react";
import {
  type LocalUser,
  adminLogout as authAdminLogout,
  logout as authLogout,
  getCurrentPhone,
  getCurrentUser,
  isAdminSession,
} from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const currentPhone = getCurrentPhone();
    const currentUser = getCurrentUser();
    setPhone(currentPhone);
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setPhone(null);
  }, []);

  const adminLogout = useCallback(() => {
    authAdminLogout();
  }, []);

  const adminLoggedIn = isAdminSession();

  return {
    user,
    phone,
    isAuthenticated: !!phone || adminLoggedIn,
    isAdminSession: adminLoggedIn,
    isLoading,
    logout,
    adminLogout,
    refresh,
  };
}

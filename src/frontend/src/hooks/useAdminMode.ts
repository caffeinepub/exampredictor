import { useEffect, useState } from "react";

const ADMIN_PIN = "jairam";
const STORAGE_KEY = "exampredictorr_admin";

export function useAdminMode() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const login = (pin: string): boolean => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}

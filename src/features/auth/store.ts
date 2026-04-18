import { create } from "zustand";
import type { User } from "@/types/user";

const KEY = "telohive_user";

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

interface AuthState {
  user: User | null;
  login: (user: User, remember: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: loadUser(),
  login(user, remember) {
    const raw = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(KEY, raw);
    } else {
      sessionStorage.setItem(KEY, raw);
    }
    set({ user });
  },
  logout() {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    set({ user: null });
  },
}));

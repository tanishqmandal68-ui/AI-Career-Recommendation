import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = "cn-users";
const SESSION_KEY = "cn-session";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse users from localStorage", err);
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users to localStorage", err);
    throw new Error("Could not save user data. Storage may be full.");
  }
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to parse session from localStorage", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const login = useCallback((email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!found) return { ok: false, error: "No account found with this email." };
    if (found.password !== password) return { ok: false, error: "Incorrect password." };
    const session: User = { id: found.id, name: found.name, email: found.email };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
      console.error("Failed to save session", err);
      return { ok: false, error: "Could not save session. Storage may be full." };
    }
    setUser(session);
    return { ok: true };
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!name.trim()) return { ok: false, error: "Name is required." };
    if (!email.trim()) return { ok: false, error: "Email is required." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };
    try {
      saveUsers([...users, newUser]);
    } catch {
      return { ok: false, error: "Could not create account. Storage may be full." };
    }
    const session: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (err) {
      console.error("Failed to save session", err);
      return { ok: false, error: "Account created but could not save session. Please log in." };
    }
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, signup, logout }),
    [user, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

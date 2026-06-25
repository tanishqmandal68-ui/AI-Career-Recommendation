import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SALT_BYTES = 16;
const ITERATIONS = 100_000;

async function derivePBKDF2(password: string, salt: Uint8Array): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function encodeSalt(salt: Uint8Array): string {
  return Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function decodeSalt(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derivePBKDF2(password, salt);
  return { hash, salt: encodeSalt(salt) };
}

async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const salt = decodeSalt(storedSalt);
  const hash = await derivePBKDF2(password, salt);
  return hash === storedHash;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
  salt: string;
}

const USERS_KEY = "cn-users";
const SESSION_KEY = "cn-session";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSession);

  const login = useCallback(async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!found) return { ok: false, error: "No account found with this email." };
    const valid = await verifyPassword(password, found.password, found.salt);
    if (!valid) return { ok: false, error: "Incorrect password." };
    const session: User = { id: found.id, name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    if (!name.trim()) return { ok: false, error: "Name is required." };
    if (!email.trim()) return { ok: false, error: "Email is required." };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const { hash, salt } = await hashPassword(password);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hash,
      salt,
    };
    saveUsers([...users, newUser]);
    const session: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
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

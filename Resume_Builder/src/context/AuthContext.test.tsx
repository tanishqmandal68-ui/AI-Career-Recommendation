import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext";

const USERS_KEY = "cn-users";
const SESSION_KEY = "cn-session";

function TestConsumer() {
  const { user, login, signup, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : "none"}</span>
      <button
        data-testid="signup"
        onClick={() => {
          const res = signup("Alice", "alice@test.com", "password123");
          document.querySelector("[data-testid='result']")!.textContent = JSON.stringify(res);
        }}
      />
      <button
        data-testid="login"
        onClick={() => {
          const res = login("alice@test.com", "password123");
          document.querySelector("[data-testid='result']")!.textContent = JSON.stringify(res);
        }}
      />
      <button
        data-testid="login-bad"
        onClick={() => {
          const res = login("alice@test.com", "wrong");
          document.querySelector("[data-testid='result']")!.textContent = JSON.stringify(res);
        }}
      />
      <button
        data-testid="login-unknown"
        onClick={() => {
          const res = login("unknown@test.com", "pass");
          document.querySelector("[data-testid='result']")!.textContent = JSON.stringify(res);
        }}
      />
      <button data-testid="logout" onClick={logout} />
      <span data-testid="result" />
    </div>
  );
}

function renderWithAuth() {
  return render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user", () => {
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  it("restores session from localStorage", () => {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ id: "1", name: "Bob", email: "bob@test.com" })
    );
    renderWithAuth();
    expect(screen.getByTestId("user").textContent).toBe("Bob");
  });

  describe("signup", () => {
    it("creates account and sets user", async () => {
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("signup"));
      expect(screen.getByTestId("user").textContent).toBe("Alice");
      expect(screen.getByTestId("result").textContent).toContain('"ok":true');
    });

    it("stores user in localStorage", async () => {
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("signup"));
      const stored = JSON.parse(localStorage.getItem(USERS_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].email).toBe("alice@test.com");
    });

    it("rejects empty name", async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestSignupCustom name="" email="a@b.com" password="123456" />
        </AuthProvider>
      );
      const user = userEvent.setup();
      await user.click(getByTestId("action"));
      expect(getByTestId("result").textContent).toContain("Name is required");
    });

    it("rejects empty email", async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestSignupCustom name="Alice" email="" password="123456" />
        </AuthProvider>
      );
      const user = userEvent.setup();
      await user.click(getByTestId("action"));
      expect(getByTestId("result").textContent).toContain("Email is required");
    });

    it("rejects short password", async () => {
      const { getByTestId } = render(
        <AuthProvider>
          <TestSignupCustom name="Alice" email="a@b.com" password="123" />
        </AuthProvider>
      );
      const user = userEvent.setup();
      await user.click(getByTestId("action"));
      expect(getByTestId("result").textContent).toContain("at least 6");
    });

    it("rejects duplicate email", async () => {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([{ id: "1", name: "Alice", email: "alice@test.com", password: "pass" }])
      );
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("signup"));
      expect(screen.getByTestId("result").textContent).toContain("already exists");
    });
  });

  describe("login", () => {
    beforeEach(() => {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([
          { id: "1", name: "Alice", email: "alice@test.com", password: "password123" },
        ])
      );
    });

    it("logs in with correct credentials", async () => {
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("login"));
      expect(screen.getByTestId("user").textContent).toBe("Alice");
      expect(screen.getByTestId("result").textContent).toContain('"ok":true');
    });

    it("rejects wrong password", async () => {
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("login-bad"));
      expect(screen.getByTestId("user").textContent).toBe("none");
      expect(screen.getByTestId("result").textContent).toContain("Incorrect password");
    });

    it("rejects unknown email", async () => {
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("login-unknown"));
      expect(screen.getByTestId("result").textContent).toContain("No account found");
    });
  });

  describe("logout", () => {
    it("clears the user and session", async () => {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([
          { id: "1", name: "Alice", email: "alice@test.com", password: "password123" },
        ])
      );
      const user = userEvent.setup();
      renderWithAuth();
      await user.click(screen.getByTestId("login"));
      expect(screen.getByTestId("user").textContent).toBe("Alice");

      await user.click(screen.getByTestId("logout"));
      expect(screen.getByTestId("user").textContent).toBe("none");
      expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    });
  });

  it("useAuth throws outside AuthProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuth must be used within AuthProvider"
    );
  });
});

function TestSignupCustom({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const { signup } = useAuth();
  return (
    <div>
      <button
        data-testid="action"
        onClick={() => {
          const res = signup(name, email, password);
          document.querySelector("[data-testid='result']")!.textContent = JSON.stringify(res);
        }}
      />
      <span data-testid="result" />
    </div>
  );
}

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePuterStore } from "./puter";

function mockPuter() {
  const mock = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ username: "test", uuid: "u1" }),
      isSignedIn: vi.fn().mockResolvedValue(true),
      signIn: vi.fn().mockResolvedValue(undefined),
      signOut: vi.fn().mockResolvedValue(undefined),
    },
    fs: {
      write: vi.fn().mockResolvedValue(undefined),
      read: vi.fn().mockResolvedValue(new Blob()),
      upload: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(undefined),
      readdir: vi.fn().mockResolvedValue([]),
    },
    ai: {
      chat: vi.fn().mockResolvedValue({ message: { content: "ok" } }),
      img2txt: vi.fn().mockResolvedValue("text"),
    },
    kv: {
      get: vi.fn().mockResolvedValue("value"),
      set: vi.fn().mockResolvedValue(true),
      del: vi.fn().mockResolvedValue(true),
      list: vi.fn().mockResolvedValue(["key1"]),
      flush: vi.fn().mockResolvedValue(true),
    },
  };
  (window as any).puter = mock;
  return mock;
}

describe("usePuterStore", () => {
  beforeEach(() => {
    delete (window as any).puter;
    usePuterStore.setState(usePuterStore.getInitialState());
  });

  afterEach(() => {
    delete (window as any).puter;
  });

  describe("initial state", () => {
    it("starts with isLoading true", () => {
      expect(usePuterStore.getState().isLoading).toBe(true);
    });

    it("starts with no error", () => {
      expect(usePuterStore.getState().error).toBeNull();
    });

    it("starts with puterReady false", () => {
      expect(usePuterStore.getState().puterReady).toBe(false);
    });

    it("starts with user null", () => {
      expect(usePuterStore.getState().auth.user).toBeNull();
    });
  });

  describe("clearError", () => {
    it("clears the error state", () => {
      usePuterStore.setState({ error: "some error" });
      usePuterStore.getState().clearError();
      expect(usePuterStore.getState().error).toBeNull();
    });
  });

  describe("auth operations without puter", () => {
    it("signIn sets error when puter not available", async () => {
      await usePuterStore.getState().auth.signIn();
      expect(usePuterStore.getState().error).toBe("Puter.js not available");
    });

    it("signOut sets error when puter not available", async () => {
      await usePuterStore.getState().auth.signOut();
      expect(usePuterStore.getState().error).toBe("Puter.js not available");
    });

    it("checkAuthStatus sets error when puter not available", async () => {
      const result = await usePuterStore.getState().auth.checkAuthStatus();
      expect(result).toBe(false);
      expect(usePuterStore.getState().error).toBe("Puter.js not available");
    });

    it("refreshUser sets error when puter not available", async () => {
      await usePuterStore.getState().auth.refreshUser();
      expect(usePuterStore.getState().error).toBe("Puter.js not available");
    });
  });

  describe("auth operations with puter", () => {
    it("checkAuthStatus returns true when signed in", async () => {
      mockPuter();
      const result = await usePuterStore.getState().auth.checkAuthStatus();
      expect(result).toBe(true);
      expect(usePuterStore.getState().auth.isAuthenticated).toBe(true);
    });

    it("checkAuthStatus returns false when not signed in", async () => {
      const mock = mockPuter();
      mock.auth.isSignedIn.mockResolvedValue(false);
      const result = await usePuterStore.getState().auth.checkAuthStatus();
      expect(result).toBe(false);
      expect(usePuterStore.getState().auth.isAuthenticated).toBe(false);
    });

    it("signIn calls puter.auth.signIn", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().auth.signIn();
      expect(mock.auth.signIn).toHaveBeenCalled();
    });

    it("signOut resets authentication", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().auth.signOut();
      expect(mock.auth.signOut).toHaveBeenCalled();
      expect(usePuterStore.getState().auth.isAuthenticated).toBe(false);
    });

    it("refreshUser updates the user", async () => {
      mockPuter();
      await usePuterStore.getState().auth.refreshUser();
      expect(usePuterStore.getState().auth.isAuthenticated).toBe(true);
    });
  });

  describe("fs operations", () => {
    it("write delegates to puter.fs.write", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().fs.write("/test.txt", "data");
      expect(mock.fs.write).toHaveBeenCalledWith("/test.txt", "data");
    });

    it("read delegates to puter.fs.read", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().fs.read("/test.txt");
      expect(mock.fs.read).toHaveBeenCalledWith("/test.txt");
    });

    it("readDir delegates to puter.fs.readdir", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().fs.readDir("/mydir");
      expect(mock.fs.readdir).toHaveBeenCalledWith("/mydir");
    });

    it("delete delegates to puter.fs.delete", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().fs.delete("/test.txt");
      expect(mock.fs.delete).toHaveBeenCalledWith("/test.txt");
    });

    it("returns undefined when puter not available", async () => {
      const result = await usePuterStore.getState().fs.write("/x", "y");
      expect(result).toBeUndefined();
    });
  });

  describe("ai operations", () => {
    it("chat delegates to puter.ai.chat", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().ai.chat("hello");
      expect(mock.ai.chat).toHaveBeenCalledWith("hello", undefined, undefined, undefined);
    });

    it("feedback calls puter.ai.chat with file content", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().ai.feedback("/path/file", "analyze this");
      expect(mock.ai.chat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            role: "user",
            content: expect.arrayContaining([
              expect.objectContaining({ type: "file", puter_path: "/path/file" }),
              expect.objectContaining({ type: "text", text: "analyze this" }),
            ]),
          }),
        ]),
        { model: "gpt-4o" }
      );
    });

    it("img2txt delegates to puter.ai.img2txt", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().ai.img2txt("image-data");
      expect(mock.ai.img2txt).toHaveBeenCalledWith("image-data", undefined);
    });
  });

  describe("kv operations", () => {
    it("get delegates to puter.kv.get", async () => {
      const mock = mockPuter();
      const result = await usePuterStore.getState().kv.get("key1");
      expect(mock.kv.get).toHaveBeenCalledWith("key1");
      expect(result).toBe("value");
    });

    it("set delegates to puter.kv.set", async () => {
      const mock = mockPuter();
      const result = await usePuterStore.getState().kv.set("k", "v");
      expect(mock.kv.set).toHaveBeenCalledWith("k", "v");
      expect(result).toBe(true);
    });

    it("delete delegates to puter.kv.del", async () => {
      const mock = mockPuter();
      const result = await usePuterStore.getState().kv.delete("k");
      expect(mock.kv.del).toHaveBeenCalledWith("k");
      expect(result).toBe(true);
    });

    it("list delegates to puter.kv.list", async () => {
      const mock = mockPuter();
      const result = await usePuterStore.getState().kv.list("*");
      expect(mock.kv.list).toHaveBeenCalledWith("*", false);
      expect(result).toEqual(["key1"]);
    });

    it("list passes returnValues flag", async () => {
      const mock = mockPuter();
      await usePuterStore.getState().kv.list("*", true);
      expect(mock.kv.list).toHaveBeenCalledWith("*", true);
    });

    it("flush delegates to puter.kv.flush", async () => {
      const mock = mockPuter();
      const result = await usePuterStore.getState().kv.flush();
      expect(mock.kv.flush).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("returns undefined when puter not available", async () => {
      const result = await usePuterStore.getState().kv.get("key");
      expect(result).toBeUndefined();
    });
  });
});

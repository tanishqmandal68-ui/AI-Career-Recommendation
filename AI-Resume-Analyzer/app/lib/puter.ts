import { create } from "zustand";

declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (
                    path: string,
                    data: string | File | Blob
                ) => Promise<File | undefined>;
                read: (path: string) => Promise<Blob>;
                upload: (file: File[] | Blob[]) => Promise<FSItem>;
                delete: (path: string) => Promise<void>;
                readdir: (path: string) => Promise<FSItem[] | undefined>;
            };
            ai: {
                chat: (
                    prompt: string | ChatMessage[],
                    imageURL?: string | PuterChatOptions,
                    testMode?: boolean,
                    options?: PuterChatOptions
                ) => Promise<Object>;
                img2txt: (
                    image: string | File | Blob,
                    testMode?: boolean
                ) => Promise<string>;
            };
            kv: {
                get: (key: string) => Promise<string | null>;
                set: (key: string, value: string) => Promise<boolean>;
                del: (key: string) => Promise<boolean>;
                list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
                flush: () => Promise<boolean>;
            };
        };
    }
}

interface PuterStore {
    isLoading: boolean;
    error: string | null;
    puterReady: boolean;
    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => PuterUser | null;
    };
    fs: {
        write: (
            path: string,
            data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob | undefined>;
        upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
        delete: (path: string) => Promise<void>;
        readDir: (path: string) => Promise<FSItem[] | undefined>;
    };
    ai: {
        chat: (
            prompt: string | ChatMessage[],
            imageURL?: string | PuterChatOptions,
            testMode?: boolean,
            options?: PuterChatOptions
        ) => Promise<AIResponse | undefined>;
        feedback: (
            path: string,
            message: string
        ) => Promise<AIResponse | undefined>;
        img2txt: (
            image: string | File | Blob,
            testMode?: boolean
        ) => Promise<string | undefined>;
    };
    kv: {
        get: (key: string) => Promise<string | null | undefined>;
        set: (key: string, value: string) => Promise<boolean | undefined>;
        delete: (key: string) => Promise<boolean | undefined>;
        list: (
            pattern: string,
            returnValues?: boolean
        ) => Promise<string[] | KVItem[] | undefined>;
        flush: () => Promise<boolean | undefined>;
    };

    init: () => void;
    clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get) => {
    const mergeAuthState = (patch: Partial<PuterStore["auth"]> & Pick<PuterStore, "isLoading">) => {
        const prev = get().auth;
        set({
            auth: {
                signIn: prev.signIn,
                signOut: prev.signOut,
                refreshUser: prev.refreshUser,
                checkAuthStatus: prev.checkAuthStatus,
                getUser: prev.getUser,
                user: prev.user,
                isAuthenticated: prev.isAuthenticated,
                ...patch,
            },
            isLoading: patch.isLoading,
        });
    };

    const setError = (msg: string) => {
        set({ error: msg });
        mergeAuthState({ user: null, isAuthenticated: false, isLoading: false });
    };

    const withPuter = <T>(fn: (puter: typeof window.puter) => T): T | undefined => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return undefined;
        }
        return fn(puter);
    };

    const extractErrorMessage = (err: unknown, fallback: string): string =>
        err instanceof Error ? err.message : fallback;

    const checkAuthStatus = async (): Promise<boolean> => {
        return await withPuter(async (puter) => {
            set({ isLoading: true, error: null });
            try {
                const isSignedIn = await puter.auth.isSignedIn();
                if (isSignedIn) {
                    const user = await puter.auth.getUser();
                    mergeAuthState({ user, isAuthenticated: true, getUser: () => user, isLoading: false });
                    return true;
                } else {
                    mergeAuthState({ user: null, isAuthenticated: false, getUser: () => null, isLoading: false });
                    return false;
                }
            } catch (err) {
                setError(extractErrorMessage(err, "Failed to check auth status"));
                return false;
            }
        }) ?? false;
    };

    const signIn = async (): Promise<void> => {
        await withPuter(async (puter) => {
            set({ isLoading: true, error: null });
            try {
                await puter.auth.signIn();
                await checkAuthStatus();
            } catch (err) {
                setError(extractErrorMessage(err, "Sign in failed"));
            }
        });
    };

    const signOut = async (): Promise<void> => {
        await withPuter(async (puter) => {
            set({ isLoading: true, error: null });
            try {
                await puter.auth.signOut();
                mergeAuthState({ user: null, isAuthenticated: false, getUser: () => null, isLoading: false });
            } catch (err) {
                setError(extractErrorMessage(err, "Sign out failed"));
            }
        });
    };

    const refreshUser = async (): Promise<void> => {
        await withPuter(async (puter) => {
            set({ isLoading: true, error: null });
            try {
                const user = await puter.auth.getUser();
                mergeAuthState({ user, isAuthenticated: true, getUser: () => user, isLoading: false });
            } catch (err) {
                setError(extractErrorMessage(err, "Failed to refresh user"));
            }
        });
    };

    const init = (): void => {
        const puter = getPuter();
        if (puter) {
            set({ puterReady: true });
            checkAuthStatus();
            return;
        }

        const interval = setInterval(() => {
            if (getPuter()) {
                clearInterval(interval);
                set({ puterReady: true });
                checkAuthStatus();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            if (!getPuter()) {
                setError("Puter.js failed to load within 10 seconds");
            }
        }, 10000);
    };

    const write = async (path: string, data: string | File | Blob) =>
        withPuter((puter) => puter.fs.write(path, data));

    const readDir = async (path: string) =>
        withPuter((puter) => puter.fs.readdir(path));

    const readFile = async (path: string) =>
        withPuter((puter) => puter.fs.read(path));

    const upload = async (files: File[] | Blob[]) =>
        withPuter((puter) => puter.fs.upload(files));

    const deleteFile = async (path: string) =>
        withPuter((puter) => puter.fs.delete(path));

    const chat = async (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
    ) =>
        withPuter((puter) =>
            puter.ai.chat(prompt, imageURL, testMode, options) as Promise<AIResponse | undefined>
        );

    const feedback = async (path: string, message: string) =>
        withPuter((puter) =>
            puter.ai.chat(
                [
                    {
                        role: "user",
                        content: [
                            { type: "file", puter_path: path },
                            { type: "text", text: message },
                        ],
                    },
                ],
                { model: "gpt-4o" }
            ) as Promise<AIResponse | undefined>
        );

    const img2txt = async (image: string | File | Blob, testMode?: boolean) =>
        withPuter((puter) => puter.ai.img2txt(image, testMode));

    const getKV = async (key: string) =>
        withPuter((puter) => puter.kv.get(key));

    const setKV = async (key: string, value: string) =>
        withPuter((puter) => puter.kv.set(key, value));

    const deleteKV = async (key: string) =>
        withPuter((puter) => puter.kv.del(key));

    const listKV = async (pattern: string, returnValues?: boolean) =>
        withPuter((puter) => puter.kv.list(pattern, returnValues ?? false));

    const flushKV = async () =>
        withPuter((puter) => puter.kv.flush());

    return {
        isLoading: true,
        error: null,
        puterReady: false,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path: string, data: string | File | Blob) => write(path, data),
            read: (path: string) => readFile(path),
            readDir: (path: string) => readDir(path),
            upload: (files: File[] | Blob[]) => upload(files),
            delete: (path: string) => deleteFile(path),
        },
        ai: {
            chat: (
                prompt: string | ChatMessage[],
                imageURL?: string | PuterChatOptions,
                testMode?: boolean,
                options?: PuterChatOptions
            ) => chat(prompt, imageURL, testMode, options),
            feedback: (path: string, message: string) => feedback(path, message),
            img2txt: (image: string | File | Blob, testMode?: boolean) =>
                img2txt(image, testMode),
        },
        kv: {
            get: (key: string) => getKV(key),
            set: (key: string, value: string) => setKV(key, value),
            delete: (key: string) => deleteKV(key),
            list: (pattern: string, returnValues?: boolean) =>
                listKV(pattern, returnValues),
            flush: () => flushKV(),
        },
        init,
        clearError: () => set({ error: null }),
    };
});
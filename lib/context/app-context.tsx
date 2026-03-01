"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type DreamMood = "peaceful" | "vivid" | "anxious" | "lucid" | "neutral";

type AppState = {
  /** Whether the left sidebar is open */
  sidebarOpen: boolean;
  /** Mood tag to associate with the current dream log session */
  sessionMood: DreamMood;
  /** Whether the user has dismissed the welcome banner */
  welcomeDismissed: boolean;
};

type AppActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSessionMood: (mood: DreamMood) => void;
  dismissWelcome: () => void;
};

type AppContextValue = AppState & AppActions;

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = "dreamlog:app-state";

const DEFAULT_STATE: AppState = {
  sidebarOpen: true,
  sessionMood: "neutral",
  welcomeDismissed: false,
};

function loadPersistedState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);

  // Hydrate from localStorage after mount
  useEffect(() => {
    setState(loadPersistedState());
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore write errors (e.g. private browsing with storage disabled)
    }
  }, [state]);

  const toggleSidebar = useCallback(
    () => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen })),
    []
  );

  const setSidebarOpen = useCallback(
    (open: boolean) => setState((s) => ({ ...s, sidebarOpen: open })),
    []
  );

  const setSessionMood = useCallback(
    (mood: DreamMood) => setState((s) => ({ ...s, sessionMood: mood })),
    []
  );

  const dismissWelcome = useCallback(
    () => setState((s) => ({ ...s, welcomeDismissed: true })),
    []
  );

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      toggleSidebar,
      setSidebarOpen,
      setSessionMood,
      dismissWelcome,
    }),
    [state, toggleSidebar, setSidebarOpen, setSessionMood, dismissWelcome]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Hook to consume the global app context. Must be called inside AppProvider. */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
}

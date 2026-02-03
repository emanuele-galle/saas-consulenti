"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface SidebarContextValue {
  /** Mobile drawer open state */
  open: boolean;
  toggle: () => void;
  close: () => void;
  /** Desktop collapsed state (icons only) */
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  open: false,
  toggle: () => {},
  close: () => {},
  collapsed: false,
  toggleCollapsed: () => {},
});

const COLLAPSED_KEY = "sidebar-collapsed";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restore collapsed state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {
      // SSR or localStorage unavailable
    }
  }, []);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ open, toggle, close, collapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

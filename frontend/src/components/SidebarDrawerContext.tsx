"use client";

import React, { createContext, useContext, useState } from "react";

interface SidebarDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarDrawerContext = createContext<SidebarDrawerContextValue | null>(null);

export function SidebarDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <SidebarDrawerContext.Provider value={{ open, setOpen }}>{children}</SidebarDrawerContext.Provider>;
}

export function useSidebarDrawer() {
  const context = useContext(SidebarDrawerContext);
  if (!context) throw new Error("useSidebarDrawer must be used within SidebarDrawerProvider");
  return context;
}

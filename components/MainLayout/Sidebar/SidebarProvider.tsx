"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type Ctx = { collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void };
const SidebarCtx = createContext<Ctx | null>(null);
export const useSidebar = () => {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("SidebarCtx missing");
  return ctx;
};
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <SidebarCtx.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarCtx.Provider>
  );
}
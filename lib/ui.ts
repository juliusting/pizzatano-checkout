"use client";
import { create } from "zustand";

/** Tiny UI store: is the cart drawer open. */
interface UiStore { drawerOpen: boolean; openDrawer: () => void; closeDrawer: () => void; }
export const useUi = create<UiStore>((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));

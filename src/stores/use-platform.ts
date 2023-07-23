import { create } from "zustand";
import { type Platform } from "~/types/server";

interface PlatformState {
  platforms: Platform[];
  addPlatform: (platform: Platform) => void;
  removePlatform: (platform: Platform) => void;
  clearPlatforms: () => void;
}

export const usePlatformStore = create<PlatformState>()((set) => ({
  platforms: [],
  addPlatform: (platform) =>
    set((state) => ({ platforms: [...state.platforms, platform] })),
  removePlatform: (platform) =>
    set((state) => ({
      platforms: state.platforms.filter(
        (filteredPlatform) => platform !== filteredPlatform
      ),
    })),
  clearPlatforms: () => set({ platforms: [] }),
}));

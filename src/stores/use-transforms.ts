import { create } from "zustand";
import { type TTransformsStore } from "~/types/client";

export const useTransformsStore = create<TTransformsStore>()((set) => ({
  currentTransformId: "",
  setTransformId: (transformId) => set({ currentTransformId: transformId }),
}));

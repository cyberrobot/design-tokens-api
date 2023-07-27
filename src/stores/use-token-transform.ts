import { create } from "zustand";
import { type ITokenTransformStore } from "~/types/client";

export const useTokenTransformStore = create<ITokenTransformStore>()((set) => ({
  id: "",
  tokens: [],
  updateState: (state) => set({ ...state }),
}));

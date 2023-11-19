import { create } from "zustand";
import { type ITokenImportStore } from "~/types/client";

export const useTokenImportStore = create<ITokenImportStore>()((set) => ({
  name: "",
  description: "",
  file: "",
  gitHubPath: "",
  updateToken: (token) => set({ ...token }),
}));

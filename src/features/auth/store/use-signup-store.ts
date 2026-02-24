import { create } from "zustand";
import { SignUpStore } from "@/features/auth/types/auth";

export const useSignUpStore = create<SignUpStore>((set) => ({
  step: 1,
  accountDatas: {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  },
  storeDatas: {
    storeName: "",
  },
  setStep: (value) => set({ step: value }),
  setAccountDatas: (datas) =>
    set((state) => ({
      accountDatas: { ...state.accountDatas, ...datas },
    })),
  setStoreDatas: (datas) =>
    set((state) => ({
      storeDatas: { ...state.storeDatas, ...datas },
    })),
}));

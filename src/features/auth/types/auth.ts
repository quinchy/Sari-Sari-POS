import { z } from "zod";
import {
  signInSchema,
  accountFormSchema,
  storeFormSchema,
  signUpSchema,
} from "@/features/auth/validations/auth";

export type SignInData = z.infer<typeof signInSchema>;

export interface SignInResponse {
  message: string;
  user: {
    id: string;
    email: string;
    accessToken: string;
  };
}

export type AccountFormData = z.infer<typeof accountFormSchema>;
export type StoreFormData = z.infer<typeof storeFormSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;

export type SignUpStore = {
  step: 1 | 2;
  accountDatas: AccountFormData;
  storeDatas: StoreFormData;
  setStep: (value: 1 | 2) => void;
  setAccountDatas: (datas: Partial<AccountFormData>) => void;
  setStoreDatas: (datas: Partial<StoreFormData>) => void;
};

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

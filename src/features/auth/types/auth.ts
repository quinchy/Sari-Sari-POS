import { z } from "zod";
import { signInSchema, signUpSchema } from "@/features/auth/validations/auth";

export type SignInData = z.infer<typeof signInSchema>;

export interface SignInResponse {
  message: string;
  user: {
    id: string;
    email: string;
    accessToken: string;
  };
}

export type SignUpData = z.infer<typeof signUpSchema>;

export interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
}

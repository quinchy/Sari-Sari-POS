export type CreateStoreMemberInput = {
  userId: string;
  storeId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};

export type UpdateStoreMemberInput = Partial<{
  role: "OWNER" | "ADMIN" | "MEMBER";
}>;

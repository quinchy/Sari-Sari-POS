export type CreateGCashEarningInput = {
  storeId: string;
  amount: number;
  date?: Date;
};

export type UpdateGCashEarningInput = Partial<{
  amount: number;
  date: Date;
}>;

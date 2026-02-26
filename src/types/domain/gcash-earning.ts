export type CreateGCashEarningInput = {
  amount: number;
  date?: Date;
};

export type UpdateGCashEarningInput = Partial<{
  amount: number;
  date: Date;
}>;

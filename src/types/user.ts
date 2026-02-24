export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
};

export type UpdateUserInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
}>;

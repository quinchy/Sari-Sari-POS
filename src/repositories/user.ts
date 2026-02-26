import { prisma } from "@/lib/prisma/client";
import { User } from "@/../prisma/generated/client";
import { CreateUserInput, UpdateUserInput } from "@/types/domain/user";

export class UserRepository {
  async getById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserInput & { id: string }): Promise<User> {
    return prisma.user.create({
      data: {
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        currentStoreId: data.currentStoreId,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();

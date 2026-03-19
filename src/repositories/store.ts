import type { Store } from "@/../prisma/generated/client";
import { prisma } from "@/lib/prisma/client";
import type { CreateStoreInput, UpdateStoreInput } from "@/types/domain/store";

export class StoreRepository {
  async getById(id: string): Promise<Store | null> {
    return prisma.store.findUnique({
      where: { id },
    });
  }

  async create(data: CreateStoreInput): Promise<Store> {
    return prisma.store.create({
      data: {
        name: data.name,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateStoreInput): Promise<Store> {
    return prisma.store.update({
      where: { id },
      data: {
        name: data.name,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<Store> {
    return prisma.store.delete({
      where: { id },
    });
  }
}

export const storeRepository = new StoreRepository();

import { prisma } from "@/lib/prisma/client";
import { Store } from "@/../prisma/generated/client";
import { CreateStoreInput, UpdateStoreInput } from "@/types/domain/store";

export class StoreRepository {
  async create(data: CreateStoreInput & { id: string }): Promise<Store> {
    return prisma.store.create({
      data: {
        id: data.id,
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

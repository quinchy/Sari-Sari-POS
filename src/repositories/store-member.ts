import { prisma } from "@/lib/prisma/client";
import { StoreMember } from "@/../prisma/generated/client";
import {
  CreateStoreMemberInput,
  UpdateStoreMemberInput,
} from "@/types/domain/store-member";

export class StoreMemberRepository {
  async create(data: CreateStoreMemberInput): Promise<StoreMember> {
    return prisma.storeMember.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        role: data.role,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async update(id: string, data: UpdateStoreMemberInput): Promise<StoreMember> {
    return prisma.storeMember.update({
      where: { id },
      data: {
        role: data.role ?? undefined,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<StoreMember> {
    return prisma.storeMember.delete({
      where: { id },
    });
  }
}

export const storeMemberRepository = new StoreMemberRepository();

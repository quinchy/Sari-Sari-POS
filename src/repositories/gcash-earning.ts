import { prisma } from "@/lib/prisma/client";
import { GCashEarning } from "@/../prisma/generated/client";
import {
  CreateGCashEarning as CreateGCashEarningInput,
  UpdateGCashEarning as UpdateGCashEarningInput,
} from "@/features/gcash/types/gcash";

export class GCashEarningRepository {
  async create(
    data: CreateGCashEarningInput & { storeId: string },
  ): Promise<GCashEarning> {
    const targetDate = data.date ? new Date(data.date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Check if a record already exists for this store on this day
    const existingRecord = await prisma.gCashEarning.findFirst({
      where: {
        storeId: data.storeId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingRecord) {
      throw new Error(
        "A GCash earning record already exists for this store on this day",
      );
    }

    return prisma.gCashEarning.create({
      data: {
        storeId: data.storeId,
        amount: data.amount,
        created_at: targetDate,
        updated_at: new Date(),
      },
    });
  }

  async update(data: UpdateGCashEarningInput): Promise<GCashEarning> {
    // If updating with a new date, check for conflicts with other records
    if (data.date) {
      const targetDate = new Date(data.date);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      // Get the current record to get its storeId
      const currentRecord = await prisma.gCashEarning.findUnique({
        where: { id: data.id },
      });

      if (!currentRecord) {
        throw new Error("GCash earning record not found");
      }

      // Check if another record exists for this store on the target day
      const existingRecord = await prisma.gCashEarning.findFirst({
        where: {
          storeId: currentRecord.storeId,
          created_at: {
            gte: startOfDay,
            lte: endOfDay,
          },
          id: {
            not: data.id, // Exclude the current record
          },
        },
      });

      if (existingRecord) {
        throw new Error(
          "Another GCash earning record already exists for this store on the target day",
        );
      }
    }

    return prisma.gCashEarning.update({
      where: { id: data.id },
      data: {
        amount: data.amount ?? undefined,
        created_at: data.date ? new Date(data.date) : undefined,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: string): Promise<GCashEarning> {
    return prisma.gCashEarning.delete({
      where: { id },
    });
  }

  async getByStoreId(storeId: string): Promise<GCashEarning[]> {
    return prisma.gCashEarning.findMany({
      where: { storeId },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: string): Promise<GCashEarning | null> {
    return prisma.gCashEarning.findUnique({
      where: { id },
    });
  }

  async getByStoreIdPaginated(
    storeId: string,
    cursor?: string,
    limit: number = 15,
  ): Promise<{
    data: GCashEarning[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const items = await prisma.gCashEarning.findMany({
      where: { storeId },
      orderBy: { created_at: "desc" },
      take: limit + 1, // Fetch one extra to determine if there's more data
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor item if cursor is provided
    });

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, -1) : items;
    const nextCursor = hasMore ? (data[data.length - 1]?.id ?? null) : null;

    return { data, nextCursor, hasMore };
  }
  async getByStoreIdPageable(
    storeId: string,
    page: number = 1,
    limit: number = 15,
  ): Promise<{
    data: GCashEarning[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.gCashEarning.findMany({
        where: { storeId },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.gCashEarning.count({
        where: { storeId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
    };
  }
}

export const gCashEarningRepository = new GCashEarningRepository();

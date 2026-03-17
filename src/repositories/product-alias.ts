import type { ProductAlias } from "@/../prisma/generated/client";
import { prisma } from "@/lib/prisma/client";

export class ProductAliasRepository {
  async create(data: {
    productId: string;
    name: string;
  }): Promise<ProductAlias> {
    return prisma.productAlias.create({
      data: {
        productId: data.productId,
        name: data.name,
      },
    });
  }

  async getByProductId(productId: string): Promise<ProductAlias[]> {
    return prisma.productAlias.findMany({
      where: { productId },
      orderBy: { created_at: "desc" },
    });
  }

  async getById(id: string): Promise<ProductAlias | null> {
    return prisma.productAlias.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<ProductAlias> {
    return prisma.productAlias.delete({
      where: { id },
    });
  }

  async deleteByProductId(productId: string): Promise<void> {
    await prisma.productAlias.deleteMany({
      where: { productId },
    });
  }
}

export const productAliasRepository = new ProductAliasRepository();

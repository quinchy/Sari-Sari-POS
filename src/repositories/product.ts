import { prisma } from "@/lib/prisma/client";
import { Product } from "@/../prisma/generated/client";
import { CreateProduct } from "@/features/products/types/products";

export class ProductRepository {
  async create(
    data: CreateProduct & { storeId: string; createdById: string },
  ): Promise<Product> {
    const { aliases, ...productData } = data;

    return prisma.product.create({
      data: {
        storeId: data.storeId,
        createdById: data.createdById,
        name: productData.name,
        description: productData.description,
        thumbnail: productData.thumbnail,
        sku: productData.sku,
        barcode: productData.barcode,
        brand: productData.brand,
        category: productData.category,
        unit: productData.unit,
        size: productData.size,
        cost_price: productData.cost_price,
        selling_price: productData.selling_price,
        stock: productData.stock ?? 0,
        min_stock: productData.min_stock ?? 0,
        is_active: productData.is_active ?? true,
        aliases: aliases && aliases.length > 0
          ? {
              create: aliases.map((alias) => ({
                name: alias.name,
              })),
            }
          : undefined,
      },
      include: {
        aliases: true,
      },
    });
  }

  async getById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        aliases: true,
      },
    });
  }

  async getByStoreId(storeId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { storeId },
      orderBy: { created_at: "desc" },
      include: {
        aliases: true,
      },
    });
  }

  async getByStoreIdPageable(
    storeId: string,
    page: number = 1,
    limit: number = 15,
  ): Promise<{
    data: Product[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where: { storeId },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          aliases: true,
        },
      }),
      prisma.product.count({
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

  async update(
    data: Partial<CreateProduct & { id: string }>,
  ): Promise<Product> {
    const { aliases, ...productData } = data;

    // If aliases are being updated, handle them separately
    if (aliases !== undefined) {
      // Delete existing aliases
      await prisma.productAlias.deleteMany({
        where: { productId: data.id },
      });

      // Create new aliases if any
      if (aliases.length > 0) {
        await prisma.productAlias.createMany({
          data: aliases.map((alias) => ({
            productId: data.id!,
            name: alias.name,
          })),
        });
      }
    }

    return prisma.product.update({
      where: { id: data.id },
      data: {
        name: productData.name,
        description: productData.description,
        sku: productData.sku,
        barcode: productData.barcode,
        brand: productData.brand,
        category: productData.category,
        unit: productData.unit,
        size: productData.size,
        cost_price: productData.cost_price,
        selling_price: productData.selling_price,
        stock: productData.stock,
        min_stock: productData.min_stock,
        is_active: productData.is_active,
      },
      include: {
        aliases: true,
      },
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export const productRepository = new ProductRepository();

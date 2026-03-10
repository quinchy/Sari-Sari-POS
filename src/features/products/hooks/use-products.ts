"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductsTotal,
  getProductsLowStock,
} from "@/features/products/apis/products";
import { keepPreviousData } from "@tanstack/react-query";
import {
  ProductColumn,
  UseGetProductsParams,
} from "@/features/products/types/products";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-low-stock"],
      });
    },
  });

  return {
    isCreateProductPending: isPending,
    createProduct: mutate,
  };
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-low-stock"],
      });
    },
  });

  return {
    isUpdateProductPending: isPending,
    updateProduct: mutate,
  };
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["products-low-stock"],
      });
    },
  });

  return {
    isDeleteProductPending: isPending,
    deleteProduct: mutate,
  };
};

export const useGetProducts = (params: UseGetProductsParams = {}) => {
  const { page, limit } = params;
  const isPaginated = page && limit;

  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: isPaginated ? keepPreviousData : undefined,
  });

  const products = (data?.data ?? []) as ProductColumn[];

  return {
    products,
    isProductsLoading: isPending,
    isProductsError: isError,
    isProductsEmpty: isSuccess && products.length === 0,
    productsError: error,
    refetchProducts: refetch,
    pagination: data?.pagination ?? {
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
    },
  };
};

export const useGetProductsTotal = () => {
  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["products-total"],
    queryFn: () => getProductsTotal(),
  });

  return {
    total: data ?? 0,
    isTotalLoading: isPending,
    isTotalError: isError,
    totalError: error,
    refetchTotal: refetch,
    isTotalEmpty: isSuccess && data === 0,
  };
};

export const useGetProductsLowStock = () => {
  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["products-low-stock"],
    queryFn: () => getProductsLowStock(),
  });

  return {
    lowStock: data ?? 0,
    isLowStockLoading: isPending,
    isLowStockError: isError,
    lowStockError: error,
    refetchLowStock: refetch,
    isLowStockEmpty: isSuccess && data === 0,
  };
};

"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGCashEarning,
  deleteGCashEarning,
  updateGCashEarning,
  getGCashEarning,
} from "@/features/gcash/apis/gcash";
import { keepPreviousData } from "@tanstack/react-query";

export const useCreateGCashEarning = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createGCashEarning,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
  });

  return {
    isCreateGCashEarningPending: isPending,
    createGCashEarning: mutate,
  };
};

export const useUpdateGCashEarning = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: updateGCashEarning,
    onSuccess: () => {
      toast.success("GCash earning updated successfully");
    },
    onError: () => {
      toast.error("Failed to update GCash earning");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
  });

  return {
    isUpdateGCashEarningPending: isPending,
    updateGCashEarning: mutate,
  };
};

export const useDeleteGCashEarning = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteGCashEarning,
    onSuccess: () => {
      toast.success("GCash earning deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete GCash earning");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
  });

  return {
    isDeleteGCashEarningPending: isPending,
    deleteGCashEarning: mutate,
  };
};

export const useGetGCashEarning = (page: number = 1) => {
  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["gcash-earnings", page],
    queryFn: () => getGCashEarning(page, 15),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: keepPreviousData,
  });

  const gcashEarnings = data?.data ?? [];
  const pagination = data?.pagination;
  const isGCashEarningsLoading = isPending;
  const isGCashEarningsEmpty = isSuccess && gcashEarnings.length === 0;

  return {
    gcashEarnings,
    isGCashEarningsLoading,
    isGCashEarningsError: isError,
    isGCashEarningsEmpty,
    gcashEarningsError: error,
    refetchGCashEarnings: refetch,
    pagination: pagination ?? {
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
    },
  };
};

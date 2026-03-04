"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGCashEarning,
  deleteGCashEarning,
  updateGCashEarning,
  getGCashEarning,
  getGCashEarningTotal,
  getGCashEarningExtreme,
} from "@/features/gcash/apis/gcash";
import { keepPreviousData } from "@tanstack/react-query";
import {
  GCashEarningResponse,
  GCashEarningChartData,
  UseGetGCashEarningParams,
} from "@/features/gcash/types/gcash";

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
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-by-month"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-extreme"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-by-month"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-extreme"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-by-month"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-total"],
      });
      queryClient.invalidateQueries({
        queryKey: ["gcash-earnings-extreme"],
      });
    },
  });

  return {
    isDeleteGCashEarningPending: isPending,
    deleteGCashEarning: mutate,
  };
};

export type { UseGetGCashEarningParams };

export const useGetGCashEarning = (params: UseGetGCashEarningParams = {}) => {
  const { page = 1, limit = 15, year, month } = params;

  const isChartQuery = year !== undefined && month !== undefined;

  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: isChartQuery
      ? ["gcash-earnings-by-month", year, month]
      : ["gcash-earnings", page],
    queryFn: () => getGCashEarning(params),
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    placeholderData: isChartQuery ? undefined : keepPreviousData,
  });

  // For chart query (monthly data)
  if (isChartQuery) {
    const chartData = (data?.data as GCashEarningChartData[]) ?? [];
    return {
      gcashEarnings: [],
      chartData,
      isGCashEarningsLoading: isPending,
      isChartLoading: isPending,
      isGCashEarningsError: isError,
      isChartError: isError,
      isGCashEarningsEmpty: false,
      isChartEmpty: isSuccess && chartData.length === 0,
      gcashEarningsError: error,
      refetchGCashEarnings: refetch,
      refetchChartData: refetch,
      pagination: {
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // For paginated query
  const gcashEarnings = (data?.data as GCashEarningResponse[]) ?? [];
  const pagination = data?.pagination;

  return {
    gcashEarnings,
    chartData: [],
    isGCashEarningsLoading: isPending,
    isChartLoading: false,
    isGCashEarningsError: isError,
    isChartError: false,
    isGCashEarningsEmpty: isSuccess && gcashEarnings.length === 0,
    isChartEmpty: false,
    gcashEarningsError: error,
    refetchGCashEarnings: refetch,
    refetchChartData: refetch,
    pagination: pagination ?? {
      page: 1,
      limit: 15,
      total: 0,
      totalPages: 0,
    },
  };
};

export const useGetGCashEarningTotal = () => {
  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["gcash-earnings-total"],
    queryFn: () => getGCashEarningTotal(),
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

export const useGetGCashEarningExtreme = (type: "highest" | "lowest") => {
  const { data, isPending, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["gcash-earnings-extreme", type],
    queryFn: () => getGCashEarningExtreme(type),
  });

  const extremeData = data?.id ? data : { id: "", amount: 0, created_at: "" };

  return {
    extreme: extremeData,
    isExtremeLoading: isPending,
    isExtremeError: isError,
    extremeError: error,
    refetchExtreme: refetch,
    isExtremeEmpty: isSuccess && !data?.id,
  };
};

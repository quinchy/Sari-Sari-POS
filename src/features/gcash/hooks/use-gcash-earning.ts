import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGCashEarning,
  deleteGCashEarning,
  updateGCashEarning,
  getGCashEarning,
} from "@/features/gcash/apis/gcash";

export const useCreateGCashEarning = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: createGCashEarning,
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate the gcash-earnings query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
      // Invalidate the gcash-earnings query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
    onError: () => {
      toast.error("Failed to update GCash earning");
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
      // Invalidate the gcash-earnings query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["gcash-earnings"] });
    },
    onError: () => {
      toast.error("Failed to delete GCash earning");
    },
  });

  return {
    isDeleteGCashEarningPending: isPending,
    deleteGCashEarning: mutate,
  };
};

export const useGetGCashEarning = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["gcash-earnings"],
    queryFn: getGCashEarning,
    select: (data) => data.data ?? [],
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    gcashEarnings: data,
    isGetGCashEarningPending: isPending,
    isGetGCashEarningError: isError,
    getGCashEarningError: error,
  };
};

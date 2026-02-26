import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createGCashEarning,
  deleteGCashEarning,
  updateGCashEarning,
} from "@/features/gcash/apis/gcash";

export const useCreateGCashEarning = () => {
  const { isPending, mutate } = useMutation({
    mutationFn: createGCashEarning,
    onSuccess: () => {
      toast.success("GCash earning created successfully");
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
  const { isPending, mutate } = useMutation({
    mutationFn: updateGCashEarning,
    onSuccess: () => {
      toast.success("GCash earning updated successfully");
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
  const { isPending, mutate } = useMutation({
    mutationFn: deleteGCashEarning,
    onSuccess: () => {
      toast.success("GCash earning deleted successfully");
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

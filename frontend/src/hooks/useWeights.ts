'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weightService } from '@/services/weights';
import { CreateWeightRequest } from '@fitsloth/shared';
import toast from 'react-hot-toast';

export function useWeights(params?: { startDate?: string; endDate?: string; limit?: number }) {
  return useQuery({
    queryKey: ['weights', params],
    queryFn: () => weightService.getWeights(params),
  });
}

export function useWeightStats() {
  return useQuery({
    queryKey: ['weight-stats'],
    queryFn: () => weightService.getWeightStats(),
  });
}

export function useCreateWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWeightRequest) => weightService.createWeight(data),
    onSuccess: () => {
      // ISSUE-007: Invalidate queries to refresh the weight list
      queryClient.invalidateQueries({ queryKey: ['weights'] });
      queryClient.invalidateQueries({ queryKey: ['weight-stats'] });
      toast.success('Weight logged successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to log weight');
    },
  });
}

export function useUpdateWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateWeightRequest> }) =>
      weightService.updateWeight(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weights'] });
      queryClient.invalidateQueries({ queryKey: ['weight-stats'] });
      toast.success('Weight updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update weight');
    },
  });
}

export function useDeleteWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => weightService.deleteWeight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weights'] });
      queryClient.invalidateQueries({ queryKey: ['weight-stats'] });
      toast.success('Weight deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete weight');
    },
  });
}

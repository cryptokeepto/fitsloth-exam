'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@/services/meals';
import { CreateMealLogRequest, UpdateMealLogRequest } from '@fitsloth/shared';
import toast from 'react-hot-toast';

export function useMeals(params?: { date?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['meals', params],
    queryFn: () => mealService.getMeals(params),
  });
}

export function useMealSummary(date?: string) {
  return useQuery({
    queryKey: ['meal-summary', date],
    queryFn: () => mealService.getMealSummary(date),
  });
}

export function useFoods(search?: string) {
  return useQuery({
    queryKey: ['foods', search],
    queryFn: () => mealService.getFoods(search),
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealLogRequest) => mealService.createMeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal-summary'] });
      toast.success('Meal logged successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to log meal');
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMealLogRequest }) =>
      mealService.updateMeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal-summary'] });
      toast.success('Meal updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update meal');
    },
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mealService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['meal-summary'] });
      toast.success('Meal deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete meal');
    },
  });
}

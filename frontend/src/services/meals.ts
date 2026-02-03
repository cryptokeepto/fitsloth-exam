import api from './api';
import { MealLogWithFood, CreateMealLogRequest, UpdateMealLogRequest, MealSummaryResponse, FoodItem } from '@fitsloth/shared';

interface MealsResponse {
  success: boolean;
  data: MealLogWithFood[];
}

interface MealResponse {
  success: boolean;
  data: MealLogWithFood;
}

interface FoodsResponse {
  success: boolean;
  data: FoodItem[];
}

export const mealService = {
  async getMeals(params?: { date?: string; startDate?: string; endDate?: string }): Promise<MealLogWithFood[]> {
    const response = await api.get<MealsResponse>('/meals', { params });
    return response.data.data;
  },

  async getMealById(id: number): Promise<MealLogWithFood> {
    const response = await api.get<MealResponse>(`/meals/${id}`);
    return response.data.data;
  },

  async createMeal(data: CreateMealLogRequest): Promise<MealLogWithFood> {
    const response = await api.post<MealResponse>('/meals', data);
    return response.data.data;
  },

  async updateMeal(id: number, data: UpdateMealLogRequest): Promise<MealLogWithFood> {
    const response = await api.put<MealResponse>(`/meals/${id}`, data);
    return response.data.data;
  },

  async deleteMeal(id: number): Promise<void> {
    await api.delete(`/meals/${id}`);
  },

  async getMealSummary(date?: string): Promise<MealSummaryResponse['data']> {
    const params = date ? { date } : {};
    const response = await api.get<MealSummaryResponse>('/meals/summary', { params });
    return response.data.data;
  },

  async getFoods(search?: string): Promise<FoodItem[]> {
    const params = search ? { search } : {};
    const response = await api.get<FoodsResponse>('/foods', { params });
    return response.data.data;
  },
};

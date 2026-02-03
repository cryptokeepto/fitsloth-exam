import api from './api';
import { Weight, CreateWeightRequest, WeightListResponse, WeightResponse } from '@fitsloth/shared';

interface WeightStatsResponse {
  success: boolean;
  data: {
    latestWeight: number | null;
    weightChange: number | null;
    recordCount: number;
    weights: Weight[];
  };
}

export const weightService = {
  async getWeights(params?: { startDate?: string; endDate?: string; limit?: number }): Promise<Weight[]> {
    const response = await api.get<WeightListResponse>('/weights', { params });
    return response.data.data;
  },

  async getWeightById(id: number): Promise<Weight> {
    const response = await api.get<WeightResponse>(`/weights/${id}`);
    return response.data.data;
  },

  async createWeight(data: CreateWeightRequest): Promise<Weight> {
    const response = await api.post<WeightResponse>('/weights', data);
    return response.data.data;
  },

  async updateWeight(id: number, data: Partial<CreateWeightRequest>): Promise<Weight> {
    const response = await api.put<WeightResponse>(`/weights/${id}`, data);
    return response.data.data;
  },

  async deleteWeight(id: number): Promise<void> {
    await api.delete(`/weights/${id}`);
  },

  async getWeightStats(): Promise<WeightStatsResponse['data']> {
    const response = await api.get<WeightStatsResponse>('/weights/stats');
    return response.data.data;
  },
};

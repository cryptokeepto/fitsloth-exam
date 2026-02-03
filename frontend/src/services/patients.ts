import api from './api';
import { WeeklySummaryResponse } from '@fitsloth/shared';

export const patientService = {
  async getWeeklySummary(startDate: string): Promise<WeeklySummaryResponse['data']> {
    const response = await api.get<WeeklySummaryResponse>('/patients/weekly-summary', {
      params: { startDate },
    });
    return response.data.data;
  },
};

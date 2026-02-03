import api from './api';
import {
  PatientSummary,
  PatientDetail,
  CoachPatientsResponse,
  CoachPatientDetailResponse,
  PatientMealsResponse,
  PatientWeightsResponse,
} from '@fitsloth/shared';

export const coachService = {
  async getPatients(): Promise<PatientSummary[]> {
    const response = await api.get<CoachPatientsResponse>('/coach/patients');
    return response.data.data;
  },

  async getPatientDetail(patientId: number): Promise<PatientDetail> {
    const response = await api.get<CoachPatientDetailResponse>(`/coach/patients/${patientId}`);
    return response.data.data;
  },

  async getPatientMeals(
    patientId: number,
    params?: { startDate?: string; endDate?: string }
  ): Promise<PatientMealsResponse['data']> {
    const response = await api.get<PatientMealsResponse>(`/coach/patients/${patientId}/meals`, {
      params,
    });
    return response.data.data;
  },

  async getPatientWeights(patientId: number): Promise<PatientWeightsResponse['data']> {
    const response = await api.get<PatientWeightsResponse>(`/coach/patients/${patientId}/weights`);
    return response.data.data;
  },
};

'use client';

import { useQuery } from '@tanstack/react-query';
import { coachService } from '@/services/coach';

export function usePatients() {
  return useQuery({
    queryKey: ['coach-patients'],
    queryFn: () => coachService.getPatients(),
  });
}

export function usePatientDetail(patientId: number) {
  return useQuery({
    queryKey: ['coach-patient', patientId],
    queryFn: () => coachService.getPatientDetail(patientId),
    enabled: !!patientId,
  });
}

export function usePatientMeals(
  patientId: number,
  params?: { startDate?: string; endDate?: string }
) {
  return useQuery({
    queryKey: ['coach-patient-meals', patientId, params],
    queryFn: () => coachService.getPatientMeals(patientId, params),
    enabled: !!patientId,
  });
}

export function usePatientWeights(patientId: number) {
  return useQuery({
    queryKey: ['coach-patient-weights', patientId],
    queryFn: () => coachService.getPatientWeights(patientId),
    enabled: !!patientId,
  });
}

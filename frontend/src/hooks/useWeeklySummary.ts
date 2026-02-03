'use client';

import { useQuery } from '@tanstack/react-query';
import { patientService } from '@/services/patients';

export function useWeeklySummary(startDate: string) {
  return useQuery({
    queryKey: ['weekly-summary', startDate],
    queryFn: () => patientService.getWeeklySummary(startDate),
    enabled: !!startDate,
  });
}

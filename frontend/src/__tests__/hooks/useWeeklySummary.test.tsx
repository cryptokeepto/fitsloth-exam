/**
 * useWeeklySummary Hook Tests
 * Tests for Weekly Summary feature data fetching
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useWeeklySummary } from '../../hooks/useWeeklySummary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { patientService } from '../../services/patients';

// Mock dependencies
jest.mock('../../services/patients');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('useWeeklySummary hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch weekly summary data', async () => {
    const mockData = {
      period: { startDate: '2024-01-01', endDate: '2024-01-07' },
      calories: { total: 2000, average: 500, daily: [] },
    };
    (patientService.getWeeklySummary as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useWeeklySummary('2024-01-01'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockData);
    });

    expect(patientService.getWeeklySummary).toHaveBeenCalledWith('2024-01-01');
  });

  it('should not fetch if start date is not provided', () => {
    const { result } = renderHook(() => useWeeklySummary(''), { wrapper });
    
    expect(result.current.isPending).toBe(true);
    // When enabled is false, status stays 'pending' but fetch doesn't fire
    expect(patientService.getWeeklySummary).not.toHaveBeenCalled();
  });
});

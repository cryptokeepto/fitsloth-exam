/**
 * useWeights Hook Tests
 * Tests for ISSUE-007 (Query invalidation logic)
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useCreateWeight } from '../../hooks/useWeights';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { weightService } from '../../services/weights';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('../../services/weights');
jest.mock('react-hot-toast');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('useWeights hook', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe('useCreateWeight', () => {
    /**
     * ISSUE-007: Should invalidate queries after successful mutation
     */
    it('should invalidate weights and weight-stats queries on success', async () => {
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      (weightService.createWeight as jest.Mock).mockResolvedValue({ success: true });

      const { result } = renderHook(() => useCreateWeight(), { wrapper });
      
      await result.current.mutateAsync({
        weight: 70,
        recordedDate: '2024-01-01',
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['weights'] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['weight-stats'] });
        expect(toast.success).toHaveBeenCalledWith('Weight logged successfully');
      });
    });

    it('should show error toast on failure', async () => {
      const errorMessage = 'Failed to create weight';
      (weightService.createWeight as jest.Mock).mockRejectedValue({
        response: { data: { error: errorMessage } },
      });

      const { result } = renderHook(() => useCreateWeight(), { wrapper });

      try {
        await result.current.mutateAsync({
          weight: 70,
          recordedDate: '2024-01-01',
        });
      } catch (e) {
        // Ignored
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });
});

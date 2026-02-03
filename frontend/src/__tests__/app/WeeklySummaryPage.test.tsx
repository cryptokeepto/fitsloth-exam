/**
 * Weekly Summary Page Tests
 * Tests for the Weekly Summary feature page rendering and interactions
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WeeklySummaryPage from '../../app/weekly-summary/page';
import { useWeeklySummary } from '../../hooks/useWeeklySummary';

// Mock the hook
jest.mock('../../hooks/useWeeklySummary');
jest.mock('../../components/Layout/PatientLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('../../components/UI/Card', () => ({ children, title }: any) => <div data-testid="card"><h2>{title}</h2>{children}</div>);
jest.mock('../../components/UI/Loading', () => () => <div>Loading...</div>);

describe('WeeklySummaryPage', () => {
  const mockRefetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    (useWeeklySummary as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    render(<WeeklySummaryPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state with retry button', () => {
    (useWeeklySummary as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Failed to load'),
      refetch: mockRefetch,
    });

    render(<WeeklySummaryPage />);
    expect(screen.getByText(/Failed to load sum/i)).toBeInTheDocument();
    
    const retryBtn = screen.getByText('Retry');
    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should render summary data when loaded', () => {
    const mockData = {
      period: { startDate: '2024-01-01', endDate: '2024-01-07' },
      calories: {
        daily: [
          { date: '2024-01-01', total: 2000 },
          { date: '2024-01-02', total: 1800 },
        ],
        average: 1900,
        total: 3800,
      },
      weight: {
        start: 70,
        end: 69.5,
        change: -0.5,
      },
      logging: {
        streak: '2/7 days',
        totalMeals: 6,
        daysLogged: 2,
      },
    };

    (useWeeklySummary as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<WeeklySummaryPage />);
    
    // Check key elements
    expect(screen.getByText('Weekly Summary')).toBeInTheDocument();
    // Start/End dates
    expect(screen.getByText(/Jan 1/)).toBeInTheDocument();
    
    // Weight Stats
    expect(screen.getByText('Weight Change')).toBeInTheDocument();
    expect(screen.getByText('-0.5 kg')).toBeInTheDocument();
    expect(screen.getByText('↓')).toBeInTheDocument();
    
    // Logging Stats
    expect(screen.getByText('Logging Streak')).toBeInTheDocument();
    expect(screen.getByText('2/7 days')).toBeInTheDocument();
    
    // Calories
    expect(screen.getByText('Daily Calories')).toBeInTheDocument();
    expect(screen.getByText('3,800 cal')).toBeInTheDocument(); // Total
  });

  it('should render empty state when no data exists', () => {
    const mockEmptyData = {
      period: { startDate: '2024-01-01', endDate: '2024-01-07' },
      calories: { daily: [], total: 0, average: 0 },
      weight: { start: null, end: null, change: null },
      logging: { streak: '0/7 days', totalMeals: 0, daysLogged: 0 },
    };

    (useWeeklySummary as jest.Mock).mockReturnValue({
      data: mockEmptyData,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<WeeklySummaryPage />);
    
    expect(screen.getByText(/No data logged for this week/i)).toBeInTheDocument();
  });
});

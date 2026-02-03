export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  details?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Weekly Summary types (for feature implementation)
export interface WeeklySummaryRequest {
  startDate: string; // YYYY-MM-DD
}

export interface DailyCalories {
  date: string;
  total: number;
}

export interface WeeklySummaryData {
  period: {
    startDate: string;
    endDate: string;
  };
  calories: {
    daily: DailyCalories[];
    average: number;
    total: number;
  };
  weight: {
    start: number | null;
    end: number | null;
    change: number | null;
  };
  logging: {
    daysLogged: number;
    totalMeals: number;
    streak: string;
  };
}

export interface WeeklySummaryResponse {
  success: boolean;
  data: WeeklySummaryData;
}

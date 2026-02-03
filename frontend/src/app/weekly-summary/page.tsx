'use client';

import { useState, useMemo } from 'react';
import PatientLayout from '@/components/Layout/PatientLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import Button from '@/components/UI/Button';
import { useWeeklySummary } from '@/hooks/useWeeklySummary';
import { DailyCalories } from '@fitsloth/shared';

/**
 * Weekly Summary Page
 * Displays weekly progress including calorie breakdown, weight change, and logging streak.
 */

// Get Monday of the current week
const getWeekStart = (date: Date = new Date()): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust if Sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

// Format date for display
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get day abbreviation
const getDayAbbr = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export default function WeeklySummaryPage() {
  const [startDate, setStartDate] = useState<string>(getWeekStart());
  
  const { data: summary, isLoading, error, refetch } = useWeeklySummary(startDate);

  // Calculate max calories for chart scaling
  const maxCalories = useMemo(() => {
    if (!summary?.calories?.daily) return 2500;
    const max = Math.max(...summary.calories.daily.map((d: DailyCalories) => d.total));
    return max > 0 ? max : 2500;
  }, [summary]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    // Adjust to Monday of that week
    const adjustedDate = getWeekStart(new Date(newDate));
    setStartDate(adjustedDate);
  };

  // Download JSON
  const handleDownload = () => {
    if (!summary) return;
    
    const dataStr = JSON.stringify(summary, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `weekly-summary-${startDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Navigate weeks
  const navigateWeek = (direction: 'prev' | 'next') => {
    const current = new Date(startDate);
    current.setDate(current.getDate() + (direction === 'next' ? 7 : -7));
    setStartDate(current.toISOString().split('T')[0]);
  };

  return (
    <PatientLayout>
      <h1 className="page-title">Weekly Summary</h1>

      {/* Date Selection */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Previous week"
            >
              ←
            </button>
            <div className="text-center">
              <label className="block text-sm text-gray-500 mb-1">Week of</label>
              <input
                type="date"
                className="input"
                value={startDate}
                onChange={handleDateChange}
                max={getWeekStart()}
              />
            </div>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              disabled={startDate >= getWeekStart()}
              title="Next week"
            >
              →
            </button>
          </div>
          {summary && (
            <span className="text-sm text-gray-500">
              {formatDate(summary.period.startDate)} - {formatDate(summary.period.endDate)}
            </span>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Failed to load summary. Please try again.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </Card>
      )}

      {/* Summary Content */}
      {summary && !isLoading && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Weight Change Card */}
            <Card title="Weight Change">
              <div className="text-center py-4">
                {summary.weight.start !== null && summary.weight.end !== null ? (
                  <>
                    <div className={`text-4xl font-bold ${
                      summary.weight.change !== null && summary.weight.change < 0
                        ? 'text-green-600'
                        : summary.weight.change !== null && summary.weight.change > 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {summary.weight.change !== null && summary.weight.change > 0 ? '+' : ''}
                      {summary.weight.change?.toFixed(1) ?? '--'} kg
                    </div>
                    <div className="text-3xl mt-2">
                      {summary.weight.change !== null && summary.weight.change < 0
                        ? '↓'
                        : summary.weight.change !== null && summary.weight.change > 0
                        ? '↑'
                        : '−'}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      {summary.weight.start?.toFixed(1)} kg → {summary.weight.end?.toFixed(1)} kg
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">−</div>
                    <p>No weight data for this week</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Logging Streak Card */}
            <Card title="Logging Streak">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary-600">
                  {summary.logging.streak}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {summary.logging.totalMeals} meals logged
                </div>
                {/* Visual streak indicator */}
                <div className="flex justify-center gap-1 mt-4">
                  {summary.calories.daily.map((day: DailyCalories, i: number) => (
                    <div
                      key={day.date}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        day.total > 0
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                      title={`${getDayAbbr(day.date)}: ${day.total} cal`}
                    >
                      {getDayAbbr(day.date).charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Daily Calories Chart */}
          <Card title="Daily Calories" className="mb-6">
            <div className="py-4">
              {/* Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-48 mb-4">
                {summary.calories.daily.map((day: DailyCalories) => {
                  const height = maxCalories > 0 ? (day.total / maxCalories) * 100 : 0;
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="text-xs text-gray-600 mb-1">
                        {day.total > 0 ? day.total : '0'}
                      </div>
                      <div
                        className={`w-full rounded-t ${
                          day.total > 0 ? 'bg-primary-500' : 'bg-gray-200'
                        }`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-2 font-medium">
                        {getDayAbbr(day.date)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <div className="flex justify-center gap-8 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Average</div>
                  <div className="text-lg font-semibold">
                    {Math.round(summary.calories.average).toLocaleString()} cal/day
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold">
                    {summary.calories.total.toLocaleString()} cal
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Download Button */}
          <div className="flex justify-center">
            <Button onClick={handleDownload} variant="secondary">
              Download JSON
            </Button>
          </div>
        </>
      )}

      {/* Empty State (no data for this week) */}
      {summary && !isLoading && summary.calories.total === 0 && summary.weight.start === null && (
        <Card className="mt-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-500">No data logged for this week.</p>
            <p className="text-sm text-gray-400 mt-2">
              Try selecting a different week or start logging your meals and weight!
            </p>
          </div>
        </Card>
      )}
    </PatientLayout>
  );
}

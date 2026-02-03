'use client';

import { useState } from 'react';
import PatientLayout from '@/components/Layout/PatientLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import MealList from '@/components/MealList';
import { useMeals } from '@/hooks/useMeals';
import { getTodayDate, formatDate } from '@/utils/calculations';

export default function HistoryPage() {
  const today = getTodayDate();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);

  const { data: meals = [], isLoading } = useMeals({ startDate, endDate });

  // Group meals by date
  const mealsByDate = meals.reduce((acc, meal) => {
    const date = meal.consumptionDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(meal);
    return acc;
  }, {} as Record<string, typeof meals>);

  const sortedDates = Object.keys(mealsByDate).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <PatientLayout>
      <h1 className="page-title">Meal History</h1>

      {/* Date Range Selector */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </div>
          <div className="flex-1">
            <label className="label">End Date</label>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={today}
            />
          </div>
        </div>
      </Card>

      {/* Meals by Date */}
      {isLoading ? (
        <Loading className="py-12" />
      ) : sortedDates.length > 0 ? (
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayMeals = mealsByDate[date];
            const totalCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);

            return (
              <Card key={date}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{formatDate(date)}</h3>
                  <span className="text-gray-500">
                    {totalCalories.toLocaleString()} calories
                  </span>
                </div>
                <MealList meals={dayMeals} showDelete={false} />
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <p className="text-gray-500 text-center py-8">
            No meals found for the selected date range.
          </p>
        </Card>
      )}
    </PatientLayout>
  );
}

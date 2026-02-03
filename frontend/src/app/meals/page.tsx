'use client';

import { useState } from 'react';
import PatientLayout from '@/components/Layout/PatientLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import MealForm from '@/components/MealForm';
import MealList from '@/components/MealList';
import { useMeals, useMealSummary } from '@/hooks/useMeals';
import { getTodayDate, formatCalories } from '@/utils/calculations';

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const { data: meals = [], isLoading } = useMeals({ date: selectedDate });
  const { data: summary } = useMealSummary(selectedDate);

  return (
    <PatientLayout>
      <h1 className="page-title">Meal Logging</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal Form */}
        <div className="lg:col-span-1">
          <Card title="Log a Meal">
            <MealForm />
          </Card>
        </div>

        {/* Meals List */}
        <div className="lg:col-span-2">
          {/* Date Selector and Summary */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <label className="label">Select Date</label>
                <input
                  type="date"
                  className="input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={getTodayDate()}
                />
              </div>
              {summary && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Calories</p>
                  <p className="text-2xl font-bold">{formatCalories(summary.totalCalories)}</p>
                  {summary.calorieGoal && (
                    <p className="text-sm text-gray-500">
                      {summary.remaining && summary.remaining > 0
                        ? `${formatCalories(summary.remaining)} remaining`
                        : `${formatCalories(Math.abs(summary.remaining || 0))} over goal`}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Meals by Type */}
            {isLoading ? (
              <Loading />
            ) : (
              <div className="space-y-6">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
                  const typeMeals = meals.filter((m) => m.mealType === mealType);
                  const typeCalories = typeMeals.reduce((sum, m) => sum + m.calories, 0);

                  return (
                    <div key={mealType}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold capitalize">{mealType}</h3>
                        <span className="text-sm text-gray-500">{formatCalories(typeCalories)} cal</span>
                      </div>
                      {typeMeals.length > 0 ? (
                        <MealList meals={typeMeals} />
                      ) : (
                        <p className="text-gray-400 text-sm py-2">No {mealType} logged</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}

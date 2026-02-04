'use client';

import { useAuth } from '@/contexts/AuthContext';
import PatientLayout from '@/components/Layout/PatientLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import { useMealSummary } from '@/hooks/useMeals';
import { useWeightStats } from '@/hooks/useWeights';
import {
  getBMICategoryColor,
  formatCalories,
  calculateCaloriePercentage,
  getCalorieProgressColor,
  calculateWeightChange,
} from '@/utils/calculations';

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: mealSummary, isLoading: mealLoading } = useMealSummary();
  const { data: weightStats, isLoading: weightLoading } = useWeightStats();

  if (authLoading) {
    return <Loading className="min-h-screen" size="lg" />;
  }

  if (!user) {
    return null;
  }

  const caloriePercentage = mealSummary && user.calPerDay
    ? calculateCaloriePercentage(mealSummary.totalCalories, user.calPerDay)
    : 0;

  return (
    <PatientLayout>
      <h1 className="page-title">Dashboard</h1>

      {/* Welcome Section */}
      <div className="mb-8">
        <p className="text-lg text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* BMI Card */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">BMI</p>
            <p className="text-3xl font-bold">{user.bmi?.toFixed(1) || '--'}</p>
            {user.bmiCategory && (
              <p className={`text-sm font-medium ${getBMICategoryColor(user.bmiCategory)}`}>
                {user.bmiCategory}
              </p>
            )}
          </div>
        </Card>

        {/* Current Weight Card */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Current Weight</p>
            <p className="text-3xl font-bold">
              {weightStats?.latestWeight?.toFixed(1) || user.currentWeight || '--'} kg
            </p>
            {user.targetWeight && (
              <p className="text-sm text-gray-500">Target: {user.targetWeight} kg</p>
            )}
          </div>
        </Card>

        {/* Weight Change Card */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Weight Change (7 days)</p>
            {weightLoading ? (
              <Loading size="sm" />
            ) : weightStats?.weightChange !== null && weightStats?.weightChange !== undefined ? (
              <>
                <p className={`text-3xl font-bold ${
                  weightStats.weightChange < 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {weightStats.weightChange > 0 ? '+' : ''}{Math.abs(weightStats.weightChange).toFixed(1)} kg
                </p>
                <p className="text-sm text-gray-500">
                  {weightStats.weightChange < 0 ? 'Lost' : weightStats.weightChange > 0 ? 'Gained' : 'No change'}
                </p>
              </>
            ) : (
              <p className="text-3xl font-bold text-gray-400">--</p>
            )}
          </div>
        </Card>

        {/* Today's Calories Card */}
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Today&apos;s Calories</p>
            {mealLoading ? (
              <Loading size="sm" />
            ) : (
              <>
                <p className="text-3xl font-bold">
                  {formatCalories(mealSummary?.totalCalories || 0)}
                </p>
                {user.calPerDay && (
                  <>
                    <p className="text-sm text-gray-500">
                      of {formatCalories(user.calPerDay)} goal
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCalorieProgressColor(caloriePercentage)}`}
                        style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Today's Meals Summary */}
      <div className="mt-8">
        <Card title="Today's Meals">
          {mealLoading ? (
            <Loading />
          ) : mealSummary ? (
            <div className="space-y-4">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((mealType) => {
                const meals = mealSummary.meals[mealType];
                const totalCal = meals.reduce((sum, m) => sum + (m.calories * (m.quantity || 1)), 0);
                return (
                  <div key={mealType} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium capitalize">{mealType}</p>
                      <p className="text-sm text-gray-500">{meals.length} item(s)</p>
                    </div>
                    <p className="font-semibold">{formatCalories(totalCal)} cal</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No meals logged today</p>
          )}
        </Card>
      </div>
    </PatientLayout>
  );
}

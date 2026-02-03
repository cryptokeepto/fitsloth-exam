'use client';

import { useParams } from 'next/navigation';
import CoachLayout from '@/components/Layout/CoachLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import MealList from '@/components/MealList';
import WeightList from '@/components/WeightList';
import { usePatientDetail, usePatientMeals, usePatientWeights } from '@/hooks/useCoach';
import { getBMICategoryColor, formatCalories } from '@/utils/calculations';
import Link from 'next/link';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Number(params.id);

  const { data: patient, isLoading: patientLoading, error } = usePatientDetail(patientId);
  const { data: mealsData, isLoading: mealsLoading } = usePatientMeals(patientId);
  const { data: weightsData, isLoading: weightsLoading } = usePatientWeights(patientId);

  if (patientLoading) {
    return (
      <CoachLayout>
        <Loading className="py-12" />
      </CoachLayout>
    );
  }

  if (error) {
    return (
      <CoachLayout>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">
              {(error as any)?.response?.data?.error || 'Failed to load patient details'}
            </p>
            <Link href="/coach/patients" className="text-primary-600 hover:underline">
              Back to Patients
            </Link>
          </div>
        </Card>
      </CoachLayout>
    );
  }

  if (!patient) {
    return (
      <CoachLayout>
        <Card>
          <p className="text-gray-500 text-center py-8">Patient not found.</p>
        </Card>
      </CoachLayout>
    );
  }

  return (
    <CoachLayout>
      {/* Header */}
      <div className="mb-6">
        <Link href="/coach/patients" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Patients
        </Link>
        <h1 className="page-title mt-2">{patient.name}</h1>
        <p className="text-gray-500">{patient.email}</p>
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Height</p>
            <p className="text-xl font-bold">{patient.height || '--'} cm</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Current Weight</p>
            <p className="text-xl font-bold">{patient.currentWeight?.toFixed(1) || '--'} kg</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Target Weight</p>
            <p className="text-xl font-bold">{patient.targetWeight?.toFixed(1) || '--'} kg</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">BMI</p>
            <p className="text-xl font-bold">{patient.bmi?.toFixed(1) || '--'}</p>
            {patient.bmiCategory && (
              <p className={`text-sm ${getBMICategoryColor(patient.bmiCategory as any)}`}>
                {patient.bmiCategory}
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Meals */}
        <Card title="Recent Meals (7 days)">
          {mealsLoading ? (
            <Loading />
          ) : mealsData && mealsData.meals.length > 0 ? (
            <>
              <MealList meals={mealsData.meals} showDelete={false} />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Total:{' '}
                  {formatCalories(mealsData.meals.reduce((sum, m) => sum + m.calories, 0))} calories
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">No meals logged recently.</p>
          )}
        </Card>

        {/* Weight History */}
        <Card title="Weight History">
          {weightsLoading ? (
            <Loading />
          ) : weightsData && weightsData.weights.length > 0 ? (
            <>
              <WeightList weights={weightsData.weights} showDelete={false} />
              {weightsData.weightChange !== null && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Change (30 days):{' '}
                    <span
                      className={`font-semibold ${
                        weightsData.weightChange < 0
                          ? 'text-green-600'
                          : weightsData.weightChange > 0
                          ? 'text-red-600'
                          : ''
                      }`}
                    >
                      {weightsData.weightChange > 0 ? '+' : ''}
                      {weightsData.weightChange.toFixed(1)} kg
                    </span>
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">No weight records.</p>
          )}
        </Card>
      </div>
    </CoachLayout>
  );
}

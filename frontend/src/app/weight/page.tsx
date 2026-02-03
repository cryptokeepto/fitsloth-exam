'use client';

import PatientLayout from '@/components/Layout/PatientLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import WeightForm from '@/components/WeightForm';
import WeightList from '@/components/WeightList';
import { useWeights, useWeightStats } from '@/hooks/useWeights';

export default function WeightPage() {
  const { data: weights = [], isLoading } = useWeights({ limit: 30 });
  const { data: stats } = useWeightStats();

  return (
    <PatientLayout>
      <h1 className="page-title">Weight Tracking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Form */}
        <div className="lg:col-span-1">
          <Card title="Log Weight">
            <WeightForm />
          </Card>

          {/* Stats Card */}
          {stats && (
            <Card className="mt-6" title="Statistics">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Latest Weight</span>
                  <span className="font-semibold">
                    {stats.latestWeight?.toFixed(1) || '--'} kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Change (30 days)</span>
                  <span
                    className={`font-semibold ${
                      stats.weightChange && stats.weightChange < 0
                        ? 'text-green-600'
                        : stats.weightChange && stats.weightChange > 0
                        ? 'text-red-600'
                        : ''
                    }`}
                  >
                    {stats.weightChange !== null
                      ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg`
                      : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Records</span>
                  <span className="font-semibold">{stats.recordCount}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Weight History */}
        <div className="lg:col-span-2">
          <Card title="Weight History">
            {isLoading ? (
              <Loading />
            ) : (
              <WeightList weights={weights} />
            )}
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}

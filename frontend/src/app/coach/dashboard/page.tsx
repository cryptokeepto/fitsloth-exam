'use client';

import { useAuth } from '@/contexts/AuthContext';
import CoachLayout from '@/components/Layout/CoachLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import { usePatients } from '@/hooks/useCoach';
import Link from 'next/link';
import { getBMICategoryColor } from '@/utils/calculations';

export default function CoachDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: patients = [], isLoading: patientsLoading } = usePatients();

  if (authLoading) {
    return <Loading className="min-h-screen" size="lg" />;
  }

  if (!user || user.role !== 'coach') {
    return null;
  }

  return (
    <CoachLayout>
      <h1 className="page-title">Coach Dashboard</h1>

      {/* Welcome Section */}
      <div className="mb-8">
        <p className="text-lg text-gray-600">Welcome back, {user.name}!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Patients</p>
            <p className="text-3xl font-bold">{patients.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Active Today</p>
            <p className="text-3xl font-bold">
              {patients.filter((p) => {
                if (!p.lastActivity) return false;
                const lastActive = new Date(p.lastActivity);
                const today = new Date();
                return lastActive.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Avg. BMI</p>
            <p className="text-3xl font-bold">
              {patients.length > 0
                ? (
                    patients.reduce((sum, p) => sum + (p.bmi || 0), 0) / patients.length
                  ).toFixed(1)
                : '--'}
            </p>
          </div>
        </Card>
      </div>

      {/* Patients Overview */}
      <Card title="Your Patients">
        {patientsLoading ? (
          <Loading />
        ) : patients.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {patients.map((patient) => (
              <Link
                key={patient.id}
                href={`/coach/patients/${patient.id}`}
                className="block py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      BMI: {patient.bmi?.toFixed(1) || '--'}
                    </p>
                    {patient.bmiCategory && (
                      <p className={`text-sm ${getBMICategoryColor(patient.bmiCategory as any)}`}>
                        {patient.bmiCategory}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No patients assigned to you yet.
          </p>
        )}
      </Card>
    </CoachLayout>
  );
}

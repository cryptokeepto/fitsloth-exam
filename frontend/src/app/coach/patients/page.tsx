'use client';

import CoachLayout from '@/components/Layout/CoachLayout';
import Card from '@/components/UI/Card';
import Loading from '@/components/UI/Loading';
import { usePatients } from '@/hooks/useCoach';
import Link from 'next/link';
import { getBMICategoryColor, formatDate } from '@/utils/calculations';

export default function CoachPatientsPage() {
  const { data: patients = [], isLoading } = usePatients();

  return (
    <CoachLayout>
      <h1 className="page-title">Patients</h1>

      {isLoading ? (
        <Loading className="py-12" />
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <Link key={patient.id} href={`/coach/patients/${patient.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Current Weight</span>
                      <span className="font-medium">
                        {patient.currentWeight?.toFixed(1) || '--'} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Target Weight</span>
                      <span className="font-medium">
                        {patient.targetWeight?.toFixed(1) || '--'} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">BMI</span>
                      <span className="font-medium">
                        {patient.bmi?.toFixed(1) || '--'}
                        {patient.bmiCategory && (
                          <span
                            className={`ml-1 ${getBMICategoryColor(patient.bmiCategory as any)}`}
                          >
                            ({patient.bmiCategory})
                          </span>
                        )}
                      </span>
                    </div>
                    {patient.lastActivity && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Active</span>
                        <span className="text-sm text-gray-600">
                          {formatDate(patient.lastActivity)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-gray-500 text-center py-8">
            No patients assigned to you yet.
          </p>
        </Card>
      )}
    </CoachLayout>
  );
}

import { User, UserProfile } from './user';
import { MealLogWithFood } from './meal';
import { Weight } from './weight';

export interface Coach {
  id: number;
  userId: number;
  specialization: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CoachPatient {
  coachId: number;
  patientId: number;
  assignedAt: string;
  patient?: PatientSummary;
}

export interface PatientSummary {
  id: number;
  name: string;
  email: string;
  currentWeight: number | null;
  targetWeight: number | null;
  bmi: number | null;
  bmiCategory: string | null;
  lastActivity: string | null;
}

export interface PatientDetail extends PatientSummary {
  height: number | null;
  calPerDay: number | null;
  createdAt: string;
}

export interface PatientMealsResponse {
  success: boolean;
  data: {
    patient: PatientSummary;
    meals: MealLogWithFood[];
    dateRange: {
      start: string;
      end: string;
    };
  };
}

export interface PatientWeightsResponse {
  success: boolean;
  data: {
    patient: PatientSummary;
    weights: Weight[];
    weightChange: number | null;
  };
}

export interface CoachPatientsResponse {
  success: boolean;
  data: PatientSummary[];
}

export interface CoachPatientDetailResponse {
  success: boolean;
  data: PatientDetail;
}

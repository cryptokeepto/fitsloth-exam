export interface Weight {
  id: number;
  userId: number;
  weight: number; // in kg
  recordedDate: string; // YYYY-MM-DD
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeightRequest {
  weight: number;
  recordedDate: string;
  notes?: string;
}

export interface WeightHistory {
  weights: Weight[];
  latestWeight: number | null;
  initialWeight: number | null;
  weightChange: number | null;
}

export interface WeightListResponse {
  success: boolean;
  data: Weight[];
}

export interface WeightResponse {
  success: boolean;
  data: Weight;
}

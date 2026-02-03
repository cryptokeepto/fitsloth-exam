export type UserRole = 'patient' | 'coach' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  height: number | null; // in cm
  currentWeight: number | null; // in kg
  targetWeight: number | null; // in kg
  calPerDay: number | null; // daily calorie goal
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bmi: number | null;
  bmiCategory: BmiCategory | null;
}

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  calPerDay?: number;
}

export interface UpdateUserRequest {
  name?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  calPerDay?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: UserProfile;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

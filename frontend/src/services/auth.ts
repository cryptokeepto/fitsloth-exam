import api from './api';
import { UserProfile, User, AuthResponse, RegisterResponse } from '@fitsloth/shared';

interface LoginResponse {
  user: UserProfile;
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'patient' | 'coach';
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  calPerDay?: number;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data.data;
  },

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data.data;
  },

  async getProfile(token?: string): Promise<UserProfile> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ success: boolean; data: UserProfile }>('/auth/profile', config);
    return response.data.data;
  },

  async updateProfile(data: Partial<User>): Promise<UserProfile> {
    const response = await api.put<{ success: boolean; data: UserProfile }>('/auth/profile', data);
    return response.data.data;
  },
};

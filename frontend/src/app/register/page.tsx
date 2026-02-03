'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/UI/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient' as 'patient' | 'coach',
    height: '',
    currentWeight: '',
    targetWeight: '',
    calPerDay: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        height: formData.height ? Number(formData.height) : undefined,
        currentWeight: formData.currentWeight ? Number(formData.currentWeight) : undefined,
        targetWeight: formData.targetWeight ? Number(formData.targetWeight) : undefined,
        calPerDay: formData.calPerDay ? Number(formData.calPerDay) : undefined,
      });
      toast.success('Registration successful');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary-600">FitSloth</h1>
          <h2 className="mt-2 text-center text-xl text-gray-600">Create your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="name" className="label">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="label">
                Role *
              </label>
              <select
                id="role"
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="coach">Coach</option>
              </select>
            </div>

            {formData.role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="height" className="label">
                      Height (cm)
                    </label>
                    <input
                      id="height"
                      name="height"
                      type="number"
                      min="50"
                      max="300"
                      className="input"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="currentWeight" className="label">
                      Current Weight (kg)
                    </label>
                    <input
                      id="currentWeight"
                      name="currentWeight"
                      type="number"
                      min="20"
                      max="500"
                      step="0.1"
                      className="input"
                      value={formData.currentWeight}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="targetWeight" className="label">
                      Target Weight (kg)
                    </label>
                    <input
                      id="targetWeight"
                      name="targetWeight"
                      type="number"
                      min="20"
                      max="500"
                      step="0.1"
                      className="input"
                      value={formData.targetWeight}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="calPerDay" className="label">
                      Daily Calorie Goal
                    </label>
                    <input
                      id="calPerDay"
                      name="calPerDay"
                      type="number"
                      min="500"
                      max="10000"
                      className="input"
                      value={formData.calPerDay}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Register
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-primary-600 hover:text-primary-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useCreateWeight } from '@/hooks/useWeights';
import Button from './UI/Button';
import { getTodayDate } from '@/utils/calculations';

interface WeightFormProps {
  onSuccess?: () => void;
}

export default function WeightForm({ onSuccess }: WeightFormProps) {
  const [weight, setWeight] = useState<number | ''>('');
  const [recordedDate, setRecordedDate] = useState<string>(getTodayDate());
  const [notes, setNotes] = useState<string>('');

  const createWeight = useCreateWeight();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weight) {
      return;
    }

    await createWeight.mutateAsync({
      weight: weight as number,
      recordedDate,
      notes: notes || undefined,
    });

    // Clear form after successful submission
    setWeight('');
    setRecordedDate(getTodayDate());
    setNotes('');

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Weight */}
      <div>
        <label className="label">Weight (kg) *</label>
        <input
          type="number"
          className="input"
          min="20"
          max="500"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
          placeholder="Enter your weight"
          required
        />
      </div>

      {/* Date */}
      <div>
        <label className="label">Date *</label>
        <input
          type="date"
          className="input"
          value={recordedDate}
          onChange={(e) => setRecordedDate(e.target.value)}
          max={getTodayDate()}
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="label">Notes (optional)</label>
        <textarea
          className="input"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        isLoading={createWeight.isPending}
        className="w-full"
      >
        Log Weight
      </Button>
    </form>
  );
}

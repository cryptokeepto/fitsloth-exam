'use client';

import { Weight } from '@fitsloth/shared';
import { useDeleteWeight } from '@/hooks/useWeights';
import Button from './UI/Button';
import { formatDate } from '@/utils/calculations';

interface WeightListProps {
  weights: Weight[];
  showDelete?: boolean;
}

export default function WeightList({ weights, showDelete = true }: WeightListProps) {
  const deleteWeight = useDeleteWeight();

  if (weights.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No weight records yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {weights.map((weight) => (
        <div
          key={weight.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">{Number(weight.weight).toFixed(1)} kg</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {formatDate(weight.recordedDate)}
              {weight.notes && <span className="ml-2 italic">"{weight.notes}"</span>}
            </div>
          </div>
          {showDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteWeight.mutate(weight.id)}
              isLoading={deleteWeight.isPending}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

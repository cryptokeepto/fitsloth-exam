'use client';

import { MealLogWithFood } from '@fitsloth/shared';
import { useDeleteMeal } from '@/hooks/useMeals';
import Button from './UI/Button';

interface MealListProps {
  meals: MealLogWithFood[];
  showDelete?: boolean;
}

export default function MealList({ meals, showDelete = true }: MealListProps) {
  const deleteMeal = useDeleteMeal();

  if (meals.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">No meals logged yet.</p>
    );
  }

  const mealTypeColors: Record<string, string> = {
    breakfast: 'bg-yellow-100 text-yellow-800',
    lunch: 'bg-blue-100 text-blue-800',
    dinner: 'bg-purple-100 text-purple-800',
    snack: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{meal.foodItem?.nameEn}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${mealTypeColors[meal.mealType]}`}>
                {meal.mealType}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {meal.quantity} serving(s) • {meal.calories} cal
              {meal.notes && <span className="ml-2 italic">"{meal.notes}"</span>}
            </div>
          </div>
          {showDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteMeal.mutate(meal.id)}
              isLoading={deleteMeal.isPending}
            >
              Delete
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

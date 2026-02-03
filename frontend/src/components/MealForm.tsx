'use client';

import { useState, useCallback } from 'react';
import { useFoods, useCreateMeal } from '@/hooks/useMeals';
import { MealType } from '@fitsloth/shared';
import Button from './UI/Button';
import SearchableSelect from './UI/SearchableSelect';
import { getTodayDate } from '@/utils/calculations';

interface MealFormProps {
  onSuccess?: () => void;
}

export default function MealForm({ onSuccess }: MealFormProps) {
  const [foodItemId, setFoodItemId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [consumptionDate, setConsumptionDate] = useState<string>(getTodayDate());
  const [notes, setNotes] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: foods = [], isLoading: foodsLoading } = useFoods(searchTerm);
  const createMeal = useCreateMeal();

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foodItemId) {
      return;
    }

    await createMeal.mutateAsync({
      foodItemId: foodItemId as number,
      quantity,
      mealType,
      consumptionDate,
      notes: notes || undefined,
    });

    // ISSUE-008: Clear form after successful submission
    setFoodItemId('');
    setQuantity(1);
    setMealType('breakfast');
    setConsumptionDate(getTodayDate());
    setNotes('');
    setSearchTerm('');

    onSuccess?.();
  };

  // Convert foods to searchable select options
  const foodOptions = foods.map((food) => ({
    id: food.id,
    label: food.nameEn,
    subLabel: food.nameTh,
    extra: `${food.calories} cal / ${food.servingSize}`,
  }));

  const selectedFood = foods.find((f) => f.id === foodItemId);
  const estimatedCalories = selectedFood
    ? Math.round(selectedFood.calories * quantity)
    : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Food Selection with Search */}
      <div>
        <label className="label">Select Food *</label>
        <SearchableSelect
          options={foodOptions}
          value={foodItemId}
          onChange={setFoodItemId}
          placeholder="Select a food item"
          searchPlaceholder="Search for food..."
          isLoading={foodsLoading}
          onSearch={handleSearch}
          required
        />
      </div>

      {/* Quantity and Meal Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            type="number"
            className="input"
            min="0.1"
            max="100"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="mealType">Meal Type *</label>
          <select
            id="mealType"
            className="input"
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            required
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="label" htmlFor="date">Date *</label>
        <input
          id="date"
          type="date"
          className="input"
          value={consumptionDate}
          onChange={(e) => setConsumptionDate(e.target.value)}
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="label" htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          className="input"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
        />
      </div>

      {/* Estimated Calories */}
      {estimatedCalories > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">
            Estimated calories: <span className="font-semibold">{estimatedCalories}</span>
          </p>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        isLoading={createMeal.isPending}
        className="w-full"
      >
        Log Meal
      </Button>
    </form>
  );
}

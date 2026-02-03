export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: number;
  nameTh: string;
  nameEn: string;
  calories: number; // per serving
  protein: number; // grams per serving
  carbs: number; // grams per serving
  fat: number; // grams per serving
  servingSize: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealLog {
  id: number;
  userId: number;
  foodItemId: number;
  quantity: number;
  mealType: MealType;
  consumptionDate: string; // YYYY-MM-DD
  calories: number; // total calories for this entry
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  foodItem?: FoodItem;
}

export interface CreateMealLogRequest {
  foodItemId: number;
  quantity: number;
  mealType: MealType;
  consumptionDate: string;
  notes?: string;
}

export interface UpdateMealLogRequest {
  foodItemId?: number;
  quantity?: number;
  mealType?: MealType;
  consumptionDate?: string;
  notes?: string;
}

export interface MealLogWithFood extends MealLog {
  foodItem: FoodItem;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  meals: MealLogWithFood[];
}

export interface MealSummaryResponse {
  success: boolean;
  data: {
    date: string;
    totalCalories: number;
    calorieGoal: number | null;
    remaining: number | null;
    meals: {
      breakfast: MealLogWithFood[];
      lunch: MealLogWithFood[];
      dinner: MealLogWithFood[];
      snack: MealLogWithFood[];
    };
  };
}

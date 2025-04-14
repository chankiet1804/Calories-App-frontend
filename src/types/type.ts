interface Food {
    _id: string;
    name: string;
    description: string;
    image: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    category: [string];
    unit: string;
    weight: number;
}

interface Meal {
    userID: string;
    mealType: string;
    foods: Food[];
    totalCalories: number;
    totalProtein: number; 
    totalFat: number;
    totalCarbs: number;
    date: string | Date; 
}

export type { Food, Meal };
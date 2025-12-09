import { Briefcase, Moon, Dumbbell, BookOpen, Gamepad2, Users, UtensilsCrossed, Heart } from "lucide-react";

export const CATEGORIES = [
  { id: "work", name: "Work", icon: Briefcase, color: "hsl(243, 75%, 59%)" },
  { id: "sleep", name: "Sleep", icon: Moon, color: "hsl(270, 76%, 60%)" },
  { id: "exercise", name: "Exercise", icon: Dumbbell, color: "hsl(142, 71%, 45%)" },
  { id: "study", name: "Study", icon: BookOpen, color: "hsl(38, 92%, 50%)" },
  { id: "entertainment", name: "Entertainment", icon: Gamepad2, color: "hsl(340, 82%, 52%)" },
  { id: "social", name: "Social", icon: Users, color: "hsl(199, 89%, 48%)" },
  { id: "meal", name: "Meal", icon: UtensilsCrossed, color: "hsl(25, 95%, 53%)" },
  { id: "personal", name: "Personal", icon: Heart, color: "hsl(280, 68%, 60%)" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export const getCategoryById = (id: string) => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[0];
};

export const MAX_MINUTES_PER_DAY = 1440;

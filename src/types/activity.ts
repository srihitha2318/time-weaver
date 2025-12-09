import { CategoryId } from "@/lib/categories";

export interface Activity {
  id: string;
  title: string;
  category: CategoryId;
  duration: number; // in minutes
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface DayStats {
  totalMinutes: number;
  totalActivities: number;
  categoryBreakdown: {
    category: CategoryId;
    minutes: number;
    percentage: number;
  }[];
}

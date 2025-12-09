import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Activity, DayStats } from "@/types/activity";
import { CategoryId, MAX_MINUTES_PER_DAY, CATEGORIES } from "@/lib/categories";
import { format } from "date-fns";

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => boolean;
  updateActivity: (id: string, activity: Partial<Activity>) => boolean;
  deleteActivity: (id: string) => void;
  getActivitiesForDate: (date: string) => Activity[];
  getDayStats: (date: string) => DayStats;
  getRemainingMinutes: (date: string, excludeId?: string) => number;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
};

const STORAGE_KEY = "timetrack_activities";

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  const getActivitiesForDate = (date: string): Activity[] => {
    return activities.filter(a => a.date === date);
  };

  const getRemainingMinutes = (date: string, excludeId?: string): number => {
    const dayActivities = getActivitiesForDate(date);
    const totalUsed = dayActivities
      .filter(a => a.id !== excludeId)
      .reduce((sum, a) => sum + a.duration, 0);
    return MAX_MINUTES_PER_DAY - totalUsed;
  };

  const addActivity = (activity: Omit<Activity, "id" | "createdAt">): boolean => {
    const remaining = getRemainingMinutes(activity.date);
    if (activity.duration > remaining) {
      return false;
    }
    
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setActivities(prev => [...prev, newActivity]);
    return true;
  };

  const updateActivity = (id: string, updates: Partial<Activity>): boolean => {
    const existing = activities.find(a => a.id === id);
    if (!existing) return false;

    const date = updates.date || existing.date;
    const duration = updates.duration ?? existing.duration;
    const remaining = getRemainingMinutes(date, id);
    
    if (duration > remaining) {
      return false;
    }

    setActivities(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
    return true;
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const getDayStats = (date: string): DayStats => {
    const dayActivities = getActivitiesForDate(date);
    const totalMinutes = dayActivities.reduce((sum, a) => sum + a.duration, 0);
    
    const categoryMap = new Map<CategoryId, number>();
    dayActivities.forEach(a => {
      categoryMap.set(a.category, (categoryMap.get(a.category) || 0) + a.duration);
    });

    const categoryBreakdown = CATEGORIES
      .filter(cat => categoryMap.has(cat.id))
      .map(cat => ({
        category: cat.id,
        minutes: categoryMap.get(cat.id) || 0,
        percentage: totalMinutes > 0 ? ((categoryMap.get(cat.id) || 0) / totalMinutes) * 100 : 0,
      }));

    return {
      totalMinutes,
      totalActivities: dayActivities.length,
      categoryBreakdown,
    };
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        updateActivity,
        deleteActivity,
        getActivitiesForDate,
        getDayStats,
        getRemainingMinutes,
        selectedDate,
        setSelectedDate,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

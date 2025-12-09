import { useActivities } from "@/contexts/ActivityContext";
import { MAX_MINUTES_PER_DAY } from "@/lib/categories";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

export const TimeProgress = () => {
  const { selectedDate, getDayStats, getRemainingMinutes } = useActivities();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const stats = getDayStats(dateStr);
  const remaining = getRemainingMinutes(dateStr);
  const percentage = (stats.totalMinutes / MAX_MINUTES_PER_DAY) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Daily Progress</h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(stats.totalMinutes)} logged
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{Math.round(percentage)}%</p>
          <p className="text-sm text-muted-foreground">{formatTime(remaining)} left</p>
        </div>
      </div>
      <Progress value={percentage} className="h-3" />
      {percentage >= 100 && (
        <p className="text-sm text-center mt-3 text-primary font-medium">
          ✨ Full day logged! View your analytics below.
        </p>
      )}
    </div>
  );
};

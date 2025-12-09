import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/dashboard/Header";
import { DatePicker } from "@/components/dashboard/DatePicker";
import { TimeProgress } from "@/components/dashboard/TimeProgress";
import { ActivityForm } from "@/components/dashboard/ActivityForm";
import { ActivityList } from "@/components/dashboard/ActivityList";
import { NoDataView } from "@/components/dashboard/NoDataView";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { ActivityProvider, useActivities } from "@/contexts/ActivityContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { MAX_MINUTES_PER_DAY } from "@/lib/categories";

const DashboardContent = () => {
  const { selectedDate, getActivitiesForDate, getDayStats } = useActivities();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const activities = getActivitiesForDate(dateStr);
  const stats = getDayStats(dateStr);
  const hasData = activities.length > 0;
  const canAnalyze = stats.totalMinutes > 0;

  // Reset analytics view when date changes
  useEffect(() => {
    setShowAnalytics(false);
  }, [selectedDate]);

  const handleAddClick = () => {
    // Trigger the add dialog by clicking the hidden button
    const addButton = document.querySelector('[data-add-trigger]') as HTMLButtonElement;
    addButton?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Date & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <DatePicker />
          <div className="flex items-center gap-3">
            {canAnalyze && (
              <Button
                variant={showAnalytics ? "default" : "outline"}
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                {showAnalytics ? "Hide Analytics" : "Analyse"}
              </Button>
            )}
            <div data-add-trigger>
              <ActivityForm />
            </div>
          </div>
        </div>

        {/* Progress */}
        {hasData && <TimeProgress />}

        {/* Main Content */}
        <div className="mt-8">
          {!hasData ? (
            <NoDataView date={selectedDate} onAddClick={handleAddClick} />
          ) : showAnalytics ? (
            <AnalyticsDashboard />
          ) : (
            <ActivityList />
          )}
        </div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("timetrack_user");
    if (!user) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <ActivityProvider>
      <DashboardContent />
    </ActivityProvider>
  );
};

export default Dashboard;

import { useActivities } from "@/contexts/ActivityContext";
import { format } from "date-fns";
import { getCategoryById } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ActivityForm } from "./ActivityForm";
import { Activity } from "@/types/activity";
import { toast } from "sonner";

export const ActivityList = () => {
  const { selectedDate, getActivitiesForDate, deleteActivity } = useActivities();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const activities = getActivitiesForDate(dateStr);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
    toast.success("Activity deleted");
  };

  if (activities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="text-lg font-semibold">Activities ({activities.length})</h3>
      
      {activities.map((activity, index) => {
        const category = getCategoryById(activity.category);
        const Icon = category.icon;

        return (
          <Card
            key={activity.id}
            className="p-4 flex items-center gap-4 hover:shadow-card-hover transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color: category.color }} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{activity.title}</h4>
              <p className="text-sm text-muted-foreground">{category.name}</p>
            </div>

            <div className="text-right">
              <p className="font-semibold">{formatDuration(activity.duration)}</p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditingActivity(activity)}
              >
                <Pencil className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(activity.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        );
      })}

      {/* Edit Dialog */}
      <Dialog open={!!editingActivity} onOpenChange={() => setEditingActivity(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the activity details below.
            </DialogDescription>
          </DialogHeader>
          {editingActivity && (
            <ActivityForm
              editActivity={editingActivity}
              onClose={() => setEditingActivity(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

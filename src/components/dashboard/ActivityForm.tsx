import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CATEGORIES, CategoryId } from "@/lib/categories";
import { useActivities } from "@/contexts/ActivityContext";
import { format } from "date-fns";
import { Plus, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Activity } from "@/types/activity";

interface ActivityFormProps {
  editActivity?: Activity;
  onClose?: () => void;
}

export const ActivityForm = ({ editActivity, onClose }: ActivityFormProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(editActivity?.title || "");
  const [category, setCategory] = useState<CategoryId>(editActivity?.category || "work");
  const [duration, setDuration] = useState(editActivity?.duration.toString() || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addActivity, updateActivity, selectedDate, getRemainingMinutes } = useActivities();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const remaining = getRemainingMinutes(dateStr, editActivity?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(duration);

    if (isNaN(durationNum) || durationNum <= 0) {
      toast.error("Please enter a valid duration");
      return;
    }

    if (durationNum > remaining) {
      toast.error(`Only ${remaining} minutes remaining for this day`);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    if (editActivity) {
      const success = updateActivity(editActivity.id, { title, category, duration: durationNum });
      if (success) {
        toast.success("Activity updated!");
        onClose?.();
      } else {
        toast.error("Failed to update activity");
      }
    } else {
      const success = addActivity({
        title,
        category,
        duration: durationNum,
        date: dateStr,
      });
      if (success) {
        toast.success("Activity added!");
        setTitle("");
        setDuration("");
        setOpen(false);
      } else {
        toast.error("Failed to add activity");
      }
    }
    setIsSubmitting(false);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Activity Name</Label>
        <Input
          id="title"
          placeholder="e.g., Team meeting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(value: CategoryId) => setCategory(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <SelectItem key={cat.id} value={cat.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: cat.color }} />
                    {cat.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="duration"
            type="number"
            placeholder="e.g., 60"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="pl-10"
            min={1}
            max={remaining}
            required
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {remaining} minutes remaining for this day
        </p>
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : editActivity ? (
          "Update Activity"
        ) : (
          "Add Activity"
        )}
      </Button>
    </form>
  );

  if (editActivity) {
    return formContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription>
            Log an activity for {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

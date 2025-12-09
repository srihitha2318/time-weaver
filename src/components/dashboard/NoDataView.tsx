import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock } from "lucide-react";
import { format } from "date-fns";

interface NoDataViewProps {
  date: Date;
  onAddClick: () => void;
}

export const NoDataView = ({ date, onAddClick }: NoDataViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center animate-float">
          <Calendar className="w-16 h-16 text-primary/60" />
        </div>
        <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
          <Clock className="w-6 h-6 text-accent/60" />
        </div>
      </div>

      {/* Message */}
      <h3 className="text-2xl font-semibold mb-2">No activities logged</h3>
      <p className="text-muted-foreground max-w-md mb-8">
        You haven't tracked any activities for{" "}
        <span className="font-medium text-foreground">
          {format(date, "EEEE, MMMM d, yyyy")}
        </span>
        . Start logging your day to see insights!
      </p>

      {/* CTA */}
      <Button variant="gradient" size="lg" onClick={onAddClick} className="gap-2">
        <Plus className="w-5 h-5" />
        Start Logging Your Day
      </Button>
    </div>
  );
};

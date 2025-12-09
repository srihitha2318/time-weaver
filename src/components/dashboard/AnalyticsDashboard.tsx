import { useActivities } from "@/contexts/ActivityContext";
import { format } from "date-fns";
import { getCategoryById, CATEGORIES, MAX_MINUTES_PER_DAY } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Clock, Activity, Target, TrendingUp } from "lucide-react";

export const AnalyticsDashboard = () => {
  const { selectedDate, getDayStats, getActivitiesForDate } = useActivities();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const stats = getDayStats(dateStr);
  const activities = getActivitiesForDate(dateStr);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const pieData = stats.categoryBreakdown.map((item) => {
    const category = getCategoryById(item.category);
    return {
      name: category.name,
      value: item.minutes,
      color: category.color,
    };
  });

  const barData = stats.categoryBreakdown.map((item) => {
    const category = getCategoryById(item.category);
    return {
      name: category.name,
      minutes: item.minutes,
      hours: Math.round((item.minutes / 60) * 10) / 10,
      fill: category.color,
    };
  });

  const percentage = (stats.totalMinutes / MAX_MINUTES_PER_DAY) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics for {format(selectedDate, "MMMM d, yyyy")}</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Total Time"
          value={formatTime(stats.totalMinutes)}
          subtitle={`${Math.round(percentage)}% of day`}
          color="primary"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          title="Activities"
          value={stats.totalActivities.toString()}
          subtitle="Tasks logged"
          color="accent"
        />
        <StatCard
          icon={<Target className="w-5 h-5" />}
          title="Categories"
          value={stats.categoryBreakdown.length.toString()}
          subtitle="Different types"
          color="primary"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Avg Duration"
          value={stats.totalActivities > 0 ? formatTime(Math.round(stats.totalMinutes / stats.totalActivities)) : "0m"}
          subtitle="Per activity"
          color="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatTime(value)}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg">Activity Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" unit="h" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatTime(value * 60), "Duration"]}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.categoryBreakdown.map((item) => {
              const category = getCategoryById(item.category);
              const Icon = category.icon;
              return (
                <div
                  key={item.category}
                  className="p-4 rounded-xl border border-border/50 hover:shadow-card transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: category.color }}>
                    {formatTime(item.minutes)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "primary" | "accent";
}) => (
  <Card className="glass hover:shadow-card-hover transition-all duration-200">
    <CardContent className="pt-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
          }`}
        >
          {icon}
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

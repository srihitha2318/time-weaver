import { Button } from "@/components/ui/button";
import { Clock, BarChart3, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-20 pb-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-16 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">TimeTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            AI-Powered Time Analytics
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Master Your{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              24 Hours
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            Track your daily activities, visualize where your time goes, and unlock insights to optimize your productivity and well-being.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/auth?mode=signup">
              <Button variant="gradient" size="xl" className="group">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="xl">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Log Activities"
              description="Record your daily activities in minutes with smart categories"
              delay="0.4s"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Track by Date"
              description="View and manage your time logs for any specific day"
              delay="0.5s"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Visual Analytics"
              description="Beautiful charts and insights to understand your patterns"
              delay="0.6s"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) => (
  <div
    className="glass rounded-2xl p-6 text-left hover:shadow-card-hover transition-all duration-300 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

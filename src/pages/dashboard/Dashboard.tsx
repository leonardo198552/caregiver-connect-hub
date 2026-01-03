import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Pill,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboardOverview } from "@/hooks/useDashboard";
import { usePatients } from "@/hooks/usePatients";

export default function Dashboard() {
  const { data: overview, isLoading } = useDashboardOverview();
  const { data: patients } = usePatients();

  const stats = [
    { 
      name: "Active Patients", 
      value: overview?.activePatientsCount || 0, 
      icon: Users, 
      change: patients?.length ? `${patients.length} total` : "No patients yet", 
      trend: "up" 
    },
    { 
      name: "Tasks Today", 
      value: overview?.todaySchedule?.length || 0, 
      icon: Calendar, 
      change: `${overview?.upcomingTasksCount || 0} upcoming`, 
      trend: "neutral" 
    },
    { 
      name: "Tasks Complete", 
      value: `${overview?.tasksCompletionPercent || 0}%`, 
      icon: CheckCircle, 
      change: "Today's progress", 
      trend: (overview?.tasksCompletionPercent || 0) > 50 ? "up" : "neutral" 
    },
    { 
      name: "Upcoming", 
      value: overview?.upcomingTasksCount || 0, 
      icon: Clock, 
      change: "Next 24 hours", 
      trend: "neutral" 
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} variant="elevated">
              <CardContent className="p-6">
                <Skeleton className="h-12 w-12 rounded-xl mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} variant="elevated" className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                {stat.trend === "up" && (
                  <Badge variant="success" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Up
                  </Badge>
                )}
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <CardDescription>Your upcoming tasks</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/schedule">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview?.todaySchedule && overview.todaySchedule.length > 0 ? (
              overview.todaySchedule.slice(0, 4).map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.patient}</p>
                  </div>
                  <Badge 
                    variant={task.status === "COMPLETED" ? "success" : "soft"} 
                    className="flex-shrink-0"
                  >
                    {task.time || "All day"}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No tasks scheduled for today</p>
              </div>
            )}
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/dashboard/schedule">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview?.recentActivity && overview.recentActivity.length > 0 ? (
              overview.recentActivity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "TASK_COMPLETED" || activity.type === "MEDICATION_GIVEN"
                        ? "bg-success/10"
                        : "bg-primary-light"
                    }`}
                  >
                    {activity.type === "TASK_COMPLETED" || activity.type === "MEDICATION_GIVEN" ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <Clock className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="gradient">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                Quick Actions
              </h3>
              <p className="text-sm text-muted-foreground">
                Frequently used actions at your fingertips
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" asChild>
                <Link to="/dashboard/patients">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Patient
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/medications">
                  <Pill className="w-4 h-4 mr-1" />
                  Log Medication
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/schedule">
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule Task
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

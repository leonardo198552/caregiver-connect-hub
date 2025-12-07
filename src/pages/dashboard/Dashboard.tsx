import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const stats = [
  { name: "Active Patients", value: "12", icon: Users, change: "+2 this week", trend: "up" },
  { name: "Medications Today", value: "8", icon: Pill, change: "3 remaining", trend: "neutral" },
  { name: "Tasks Complete", value: "85%", icon: CheckCircle, change: "+12% vs last week", trend: "up" },
  { name: "Upcoming", value: "5", icon: Calendar, change: "Next 24 hours", trend: "neutral" },
];

const upcomingTasks = [
  { time: "2:00 PM", patient: "Mrs. Johnson", task: "Medication - Lisinopril 10mg", status: "pending" },
  { time: "3:30 PM", patient: "Mr. Smith", task: "Physical therapy exercises", status: "pending" },
  { time: "4:00 PM", patient: "Mrs. Davis", task: "Blood pressure check", status: "pending" },
  { time: "5:00 PM", patient: "Mr. Wilson", task: "Dinner preparation", status: "pending" },
];

const recentActivity = [
  { type: "completed", text: "Morning medication given to Mrs. Johnson", time: "1 hour ago" },
  { type: "note", text: "Added vitals note for Mr. Smith", time: "2 hours ago" },
  { type: "alert", text: "Medication refill needed for Mrs. Davis", time: "3 hours ago" },
  { type: "completed", text: "Completed morning routine checklist", time: "4 hours ago" },
];

export default function Dashboard() {
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
            {upcomingTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.patient}</p>
                </div>
                <Badge variant="soft" className="flex-shrink-0">
                  {task.time}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
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
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "completed"
                      ? "bg-success/10"
                      : activity.type === "alert"
                      ? "bg-warning/10"
                      : "bg-primary-light"
                  }`}
                >
                  {activity.type === "completed" ? (
                    <CheckCircle className="w-4 h-4 text-success" />
                  ) : activity.type === "alert" ? (
                    <AlertCircle className="w-4 h-4 text-warning" />
                  ) : (
                    <Clock className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
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
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Patient
              </Button>
              <Button variant="outline" size="sm">
                <Pill className="w-4 h-4 mr-1" />
                Log Medication
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

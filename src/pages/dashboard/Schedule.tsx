import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Pill,
  Activity,
  CheckCircle,
} from "lucide-react";

const currentWeek = [
  { day: "Mon", date: 2, isToday: false },
  { day: "Tue", date: 3, isToday: false },
  { day: "Wed", date: 4, isToday: false },
  { day: "Thu", date: 5, isToday: false },
  { day: "Fri", date: 6, isToday: false },
  { day: "Sat", date: 7, isToday: true },
  { day: "Sun", date: 8, isToday: false },
];

const todayTasks = [
  {
    id: 1,
    time: "8:00 AM",
    title: "Morning Medications",
    patient: "Eleanor Johnson",
    type: "medication",
    status: "completed",
    details: "Lisinopril 10mg, Metoprolol 25mg",
  },
  {
    id: 2,
    time: "9:30 AM",
    title: "Breakfast Assistance",
    patient: "Robert Smith",
    type: "care",
    status: "completed",
    details: "Diabetic-friendly meal prepared",
  },
  {
    id: 3,
    time: "11:00 AM",
    title: "Physical Therapy",
    patient: "William Wilson",
    type: "exercise",
    status: "completed",
    details: "30 min walking exercises",
  },
  {
    id: 4,
    time: "2:00 PM",
    title: "Afternoon Medications",
    patient: "Margaret Davis",
    type: "medication",
    status: "current",
    details: "Warfarin 5mg, Aspirin 81mg",
  },
  {
    id: 5,
    time: "3:30 PM",
    title: "Vitals Check",
    patient: "Eleanor Johnson",
    type: "vitals",
    status: "upcoming",
    details: "Blood pressure, temperature",
  },
  {
    id: 6,
    time: "5:00 PM",
    title: "Dinner Preparation",
    patient: "All Patients",
    type: "care",
    status: "upcoming",
    details: "Prepare evening meals",
  },
  {
    id: 7,
    time: "7:00 PM",
    title: "Evening Medications",
    patient: "Multiple",
    type: "medication",
    status: "upcoming",
    details: "4 patients",
  },
];

const typeIcons: Record<string, any> = {
  medication: Pill,
  care: User,
  exercise: Activity,
  vitals: Activity,
};

const typeColors: Record<string, string> = {
  medication: "bg-primary-light text-primary",
  care: "bg-secondary-light text-secondary",
  exercise: "bg-success/10 text-success",
  vitals: "bg-warning/10 text-warning",
};

export default function Schedule() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Calendar Header */}
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="font-display text-xl font-bold text-foreground">
                December 2024
              </h2>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Today
              </Button>
              <Button variant="default" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Week View */}
          <div className="grid grid-cols-7 gap-2">
            {currentWeek.map((day) => (
              <button
                key={day.day}
                className={`p-4 rounded-xl text-center transition-all ${
                  day.isToday
                    ? "gradient-hero text-primary-foreground shadow-glow"
                    : "bg-accent/50 hover:bg-accent text-foreground"
                }`}
              >
                <span className="text-xs font-medium opacity-70">{day.day}</span>
                <p className="text-xl font-bold mt-1">{day.date}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Timeline */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayTasks.map((task, index) => {
                const Icon = typeIcons[task.type] || Clock;
                const isLast = index === todayTasks.length - 1;

                return (
                  <div key={task.id} className="relative flex gap-4">
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          task.status === "completed"
                            ? "bg-success/10"
                            : task.status === "current"
                            ? "gradient-hero shadow-glow"
                            : typeColors[task.type]
                        }`}
                      >
                        {task.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Icon
                            className={`w-5 h-5 ${
                              task.status === "current" ? "text-primary-foreground" : ""
                            }`}
                          />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[60px] ${
                            task.status === "completed" ? "bg-success/30" : "bg-border"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 pb-4 ${
                        task.status === "current" ? "bg-accent/50 rounded-lg p-4 -mt-2" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {task.time}
                        </span>
                        {task.status === "current" && (
                          <Badge variant="default" className="text-xs animate-pulse-soft">
                            Now
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{task.patient}</p>
                      <p className="text-xs text-muted-foreground">{task.details}</p>
                      {task.status === "current" && (
                        <Button variant="success" size="sm" className="mt-3">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          <Card variant="gradient">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold text-foreground mb-4">
                Today's Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Tasks</span>
                  <span className="font-bold text-foreground">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-bold text-success">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-bold text-primary">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Upcoming</span>
                  <span className="font-bold text-muted-foreground">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks
                .filter((t) => t.status === "upcoming")
                .slice(0, 3)
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

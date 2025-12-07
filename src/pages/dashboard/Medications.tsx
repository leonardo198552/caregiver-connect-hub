import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Pill,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MoreVertical,
} from "lucide-react";

const medications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    patient: "Eleanor Johnson",
    time: "8:00 AM",
    status: "completed",
    refillDate: "Dec 15, 2024",
    stock: 85,
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    patient: "Robert Smith",
    time: "12:00 PM",
    status: "pending",
    refillDate: "Dec 20, 2024",
    stock: 60,
  },
  {
    id: 3,
    name: "Warfarin",
    dosage: "5mg",
    patient: "Margaret Davis",
    time: "2:00 PM",
    status: "pending",
    refillDate: "Dec 10, 2024",
    stock: 15,
  },
  {
    id: 4,
    name: "Carbidopa",
    dosage: "25mg",
    patient: "William Wilson",
    time: "4:00 PM",
    status: "pending",
    refillDate: "Jan 5, 2025",
    stock: 90,
  },
];

const todaySchedule = [
  { time: "8:00 AM", medications: 3, completed: 3 },
  { time: "12:00 PM", medications: 2, completed: 0 },
  { time: "2:00 PM", medications: 4, completed: 0 },
  { time: "6:00 PM", medications: 3, completed: 0 },
  { time: "10:00 PM", medications: 2, completed: 0 },
];

export default function Medications() {
  const totalMeds = todaySchedule.reduce((acc, t) => acc + t.medications, 0);
  const completedMeds = todaySchedule.reduce((acc, t) => acc + t.completed, 0);
  const progressPercentage = Math.round((completedMeds / totalMeds) * 100);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Pill className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMeds}</p>
                <p className="text-sm text-muted-foreground">Today's Doses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{completedMeds}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalMeds - completedMeds}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card variant="gradient">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                Today's Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                {completedMeds} of {totalMeds} doses administered
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
            <CardDescription>Medication times for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaySchedule.map((slot, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  slot.completed === slot.medications
                    ? "bg-success/5 border border-success/20"
                    : "bg-accent/50"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    slot.completed === slot.medications
                      ? "bg-success/10"
                      : "bg-primary-light"
                  }`}
                >
                  {slot.completed === slot.medications ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{slot.time}</p>
                  <p className="text-xs text-muted-foreground">
                    {slot.completed}/{slot.medications} medications
                  </p>
                </div>
                {slot.completed < slot.medications && (
                  <Button variant="outline" size="sm">
                    Start
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medication List */}
        <Card variant="elevated">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Medications</CardTitle>
              <CardDescription>Active prescriptions</CardDescription>
            </div>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className="flex items-start gap-4 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    med.stock < 20 ? "bg-destructive/10" : "bg-primary-light"
                  }`}
                >
                  <Pill className={`w-5 h-5 ${med.stock < 20 ? "text-destructive" : "text-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{med.name}</p>
                    <Badge variant="soft" className="text-xs">
                      {med.dosage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {med.patient}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {med.time}
                    </span>
                  </div>
                  {med.stock < 20 && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low stock - {med.stock}% remaining
                    </p>
                  )}
                </div>
                <Badge
                  variant={med.status === "completed" ? "success" : "soft"}
                  className="flex-shrink-0"
                >
                  {med.status === "completed" ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

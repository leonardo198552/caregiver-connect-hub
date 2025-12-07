import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  Heart,
  Activity,
} from "lucide-react";

const patients = [
  {
    id: 1,
    name: "Eleanor Johnson",
    age: 78,
    condition: "Alzheimer's",
    status: "stable",
    lastVisit: "Today",
    medications: 5,
    phone: "(555) 123-4567",
    email: "family@johnson.com",
    avatar: null,
  },
  {
    id: 2,
    name: "Robert Smith",
    age: 82,
    condition: "Diabetes Type 2",
    status: "monitoring",
    lastVisit: "Yesterday",
    medications: 3,
    phone: "(555) 234-5678",
    email: "rsmith@email.com",
    avatar: null,
  },
  {
    id: 3,
    name: "Margaret Davis",
    age: 75,
    condition: "Heart Disease",
    status: "attention",
    lastVisit: "2 days ago",
    medications: 7,
    phone: "(555) 345-6789",
    email: "mdavis@email.com",
    avatar: null,
  },
  {
    id: 4,
    name: "William Wilson",
    age: 88,
    condition: "Parkinson's",
    status: "stable",
    lastVisit: "Today",
    medications: 4,
    phone: "(555) 456-7890",
    email: "wwilson@email.com",
    avatar: null,
  },
];

const statusColors: Record<string, string> = {
  stable: "success",
  monitoring: "warning",
  attention: "destructive",
};

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="default" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            variant="interactive"
            className="group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <CardTitle className="text-base">{patient.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {patient.age} years old
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Condition</span>
                <span className="text-sm font-medium text-foreground">{patient.condition}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={statusColors[patient.status] as any}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Medications</span>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{patient.medications} active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Visit</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm">{patient.lastVisit}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Activity className="w-4 h-4 mr-1" />
                  Vitals
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card variant="elevated" className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No patients found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or add a new patient
          </p>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </Card>
      )}
    </div>
  );
}

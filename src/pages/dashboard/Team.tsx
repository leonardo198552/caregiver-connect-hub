import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Shield,
  Clock,
  Star,
} from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Caregiver",
    email: "sarah@careconnect.com",
    phone: "(555) 123-4567",
    status: "active",
    patients: 4,
    joinedDate: "Jan 2023",
    avatar: null,
    isAdmin: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Caregiver",
    email: "michael@careconnect.com",
    phone: "(555) 234-5678",
    status: "active",
    patients: 3,
    joinedDate: "Mar 2023",
    avatar: null,
    isAdmin: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Caregiver",
    email: "emily@careconnect.com",
    phone: "(555) 345-6789",
    status: "active",
    patients: 3,
    joinedDate: "Jun 2023",
    avatar: null,
    isAdmin: false,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Part-time Caregiver",
    email: "david@careconnect.com",
    phone: "(555) 456-7890",
    status: "away",
    patients: 2,
    joinedDate: "Sep 2023",
    avatar: null,
    isAdmin: false,
  },
];

const pendingInvites = [
  { email: "newcaregiver@email.com", sentDate: "2 days ago" },
  { email: "another@email.com", sentDate: "5 days ago" },
];

export default function Team() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search team members..." className="pl-9" />
        </div>
        <Button variant="default">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Mail className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
          <CardDescription>Manage your caregiving team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
            >
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{member.name}</h4>
                  {member.isAdmin && (
                    <Badge variant="soft" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  <Badge
                    variant={member.status === "active" ? "success" : "warning"}
                    className="text-xs ml-auto hidden sm:flex"
                  >
                    {member.status === "active" ? "Active" : "Away"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {member.patients} patients
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Joined {member.joinedDate}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Pending Invitations</CardTitle>
          <CardDescription>Invites waiting for acceptance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pendingInvites.map((invite, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{invite.email}</p>
                  <p className="text-xs text-muted-foreground">Sent {invite.sentDate}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Resend
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

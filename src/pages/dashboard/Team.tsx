import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Loader2,
} from "lucide-react";
import { useTeamMembers, useTeamInvitations, useUserTeam } from "@/hooks/useTeam";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const { data: teamMembers, isLoading: membersLoading } = useTeamMembers();
  const { data: invitations, isLoading: invitationsLoading } = useTeamInvitations();
  const { data: userTeam } = useUserTeam();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const filteredMembers = teamMembers?.filter((member: any) =>
    `${member.profiles?.first_name} ${member.profiles?.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  ) || [];

  const activeMembers = filteredMembers.filter((m: any) => m.status === "ACTIVE");
  const awayMembers = filteredMembers.filter((m: any) => m.status === "AWAY");

  const handleInvite = async () => {
    if (!userTeam?.team_id || !inviteEmail) return;

    setIsInviting(true);

    try {
      // Generate a random token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      const { error } = await supabase
        .from("team_invitations")
        .insert({
          team_id: userTeam.team_id,
          email: inviteEmail,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}`,
      });

      setIsInviteDialogOpen(false);
      setInviteEmail("");
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from("team_invitations")
        .update({ cancelled_at: new Date().toISOString() })
        .eq("id", invitationId);

      if (error) throw error;

      toast({
        title: "Invitation cancelled",
        description: "The invitation has been cancelled.",
      });

      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isLoading = membersLoading || invitationsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail || isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Invitation"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <p className="text-2xl font-bold text-foreground">{teamMembers?.length || 0}</p>
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
                <p className="text-2xl font-bold text-foreground">{activeMembers.length}</p>
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
                <p className="text-2xl font-bold text-foreground">{invitations?.length || 0}</p>
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
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              >
                <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                  {member.profiles?.first_name?.[0]}{member.profiles?.last_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">
                      {member.profiles?.first_name} {member.profiles?.last_name}
                    </h4>
                    {member.role === "OWNER" && (
                      <Badge variant="soft" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        Owner
                      </Badge>
                    )}
                    <Badge
                      variant={member.status === "ACTIVE" ? "success" : "warning"}
                      className="text-xs ml-auto hidden sm:flex"
                    >
                      {member.status === "ACTIVE" ? "Active" : "Away"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Joined {member.joined_at ? format(new Date(member.joined_at), "MMM yyyy") : "N/A"}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Mail className="w-4 h-4" />
                  </Button>
                  {member.profiles?.phone && (
                    <Button variant="ghost" size="icon">
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No team members found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invites */}
      {invitations && invitations.length > 0 && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-lg">Pending Invitations</CardTitle>
            <CardDescription>Invites waiting for acceptance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((invite: any) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{invite.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Sent {format(new Date(invite.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Resend
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleCancelInvite(invite.id)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

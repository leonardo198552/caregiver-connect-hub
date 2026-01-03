import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserTeam() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-team", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("team_members")
        .select(`
          team_id,
          role,
          status,
          teams (
            id,
            name,
            owner_id
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTeamMembers() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["team-members", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("team_members")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            phone,
            avatar_url,
            status
          )
        `)
        .eq("team_id", userTeam.team_id);

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

export function useTeamInvitations() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["team-invitations", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("team_id", userTeam.team_id)
        .is("accepted_at", null)
        .is("cancelled_at", null);

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

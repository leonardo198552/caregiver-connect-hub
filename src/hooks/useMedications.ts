import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserTeam } from "./useTeam";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Medication = Database["public"]["Tables"]["medications"]["Row"];
type MedicationSchedule = Database["public"]["Tables"]["medication_schedules"]["Row"];
type MedicationDose = Database["public"]["Tables"]["medication_doses"]["Row"];

export function useMedications() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["medications", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("medications")
        .select(`
          *,
          patients!inner (
            id,
            first_name,
            last_name,
            team_id
          ),
          medication_schedules (
            *
          )
        `)
        .eq("patients.team_id", userTeam.team_id);

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

export function useTodayMedicationDoses() {
  const { data: userTeam } = useUserTeam();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["medication-doses-today", userTeam?.team_id, today],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("medication_doses")
        .select(`
          *,
          medication_schedules!inner (
            *,
            medications!inner (
              *,
              patients!inner (
                id,
                first_name,
                last_name,
                team_id
              )
            )
          )
        `)
        .eq("dose_date", today)
        .eq("medication_schedules.medications.patients.team_id", userTeam.team_id)
        .order("medication_schedules(time_of_day)", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

export function useCompleteDose() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ doseId, userId }: { doseId: string; userId: string }) => {
      const { data, error } = await supabase
        .from("medication_doses")
        .update({
          status: "COMPLETED",
          administered_by_id: userId,
          administered_at: new Date().toISOString(),
        })
        .eq("id", doseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication-doses-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast({
        title: "Dose completed",
        description: "Medication dose has been marked as completed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCreateMedication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (medication: Database["public"]["Tables"]["medications"]["Insert"]) => {
      const { data, error } = await supabase
        .from("medications")
        .insert(medication)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      toast({
        title: "Medication added",
        description: "The medication has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

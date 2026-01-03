import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserTeam } from "./useTeam";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Patient = Database["public"]["Tables"]["patients"]["Row"];
type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];

export function usePatients() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["patients", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("team_id", userTeam.team_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Patient[];
    },
    enabled: !!userTeam?.team_id,
  });
}

export function usePatient(patientId: string | undefined) {
  return useQuery({
    queryKey: ["patient", patientId],
    queryFn: async () => {
      if (!patientId) return null;

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .maybeSingle();

      if (error) throw error;
      return data as Patient | null;
    },
    enabled: !!patientId,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  const { data: userTeam } = useUserTeam();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (patient: Omit<PatientInsert, "team_id">) => {
      if (!userTeam?.team_id) {
        throw new Error("No team found");
      }

      const { data, error } = await supabase
        .from("patients")
        .insert({
          ...patient,
          team_id: userTeam.team_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient added",
        description: "The patient has been added successfully.",
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

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...patient }: Partial<Patient> & { id: string }) => {
      const { data, error } = await supabase
        .from("patients")
        .update(patient)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient updated",
        description: "The patient has been updated successfully.",
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

export function useDeletePatient() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (patientId: string) => {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({
        title: "Patient deleted",
        description: "The patient has been removed.",
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

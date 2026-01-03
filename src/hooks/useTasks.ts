import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserTeam } from "./useTeam";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

export function useTasks(date?: string) {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["tasks", userTeam?.team_id, date],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      let query = supabase
        .from("tasks")
        .select(`
          *,
          patients (
            id,
            first_name,
            last_name
          ),
          assigned_to:assigned_to_id (
            first_name,
            last_name
          )
        `)
        .eq("team_id", userTeam.team_id)
        .order("scheduled_date", { ascending: true })
        .order("scheduled_time", { ascending: true });

      if (date) {
        query = query.eq("scheduled_date", date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

export function useTodayTasks() {
  const today = new Date().toISOString().split("T")[0];
  return useTasks(today);
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { data: userTeam } = useUserTeam();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (task: Omit<TaskInsert, "team_id">) => {
      if (!userTeam?.team_id) {
        throw new Error("No team found");
      }

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...task,
          team_id: userTeam.team_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast({
        title: "Task created",
        description: "The task has been created successfully.",
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

export function useCompleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ taskId, userId }: { taskId: string; userId: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          status: "COMPLETED",
          completed_at: new Date().toISOString(),
          completed_by_id: userId,
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-overview"] });
      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
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

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...task }: Partial<Task> & { id: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update(task)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task updated",
        description: "The task has been updated successfully.",
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

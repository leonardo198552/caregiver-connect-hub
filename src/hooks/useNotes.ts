import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserTeam } from "./useTeam";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type Note = Database["public"]["Tables"]["notes"]["Row"];
type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];

export function useNotes() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["notes", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("notes")
        .select(`
          *,
          patients!inner (
            id,
            first_name,
            last_name,
            team_id
          ),
          author:author_id (
            first_name,
            last_name
          ),
          notes_tags (
            note_tags (
              id,
              name,
              color
            )
          )
        `)
        .eq("patients.team_id", userTeam.team_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (note: Omit<NoteInsert, "author_id">) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("notes")
        .insert({
          ...note,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note created",
        description: "Your note has been saved.",
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

export function useUpdateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...note }: Partial<Note> & { id: string }) => {
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast({
        title: "Note updated",
        description: "Your note has been updated.",
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

export function useNoteTags() {
  const { data: userTeam } = useUserTeam();

  return useQuery({
    queryKey: ["note-tags", userTeam?.team_id],
    queryFn: async () => {
      if (!userTeam?.team_id) return [];

      const { data, error } = await supabase
        .from("note_tags")
        .select("*")
        .eq("team_id", userTeam.team_id);

      if (error) throw error;
      return data;
    },
    enabled: !!userTeam?.team_id,
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type CommunityTopic = Database["public"]["Tables"]["community_topics"]["Row"];
type CommunityReply = Database["public"]["Tables"]["community_replies"]["Row"];

export function useCommunityCategories() {
  return useQuery({
    queryKey: ["community-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}

export function useCommunityTopics(categoryId?: string) {
  return useQuery({
    queryKey: ["community-topics", categoryId],
    queryFn: async () => {
      let query = supabase
        .from("community_topics")
        .select(`
          *,
          category:category_id (
            id,
            name,
            slug
          ),
          author:author_id (
            first_name,
            last_name
          ),
          community_replies (
            id
          ),
          community_likes (
            id
          )
        `)
        .order("created_at", { ascending: false });

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to include counts
      return data.map(topic => ({
        ...topic,
        replies_count: topic.community_replies?.length || 0,
        likes_count: topic.community_likes?.length || 0,
      }));
    },
  });
}

export function useCommunityTopic(topicId: string | undefined) {
  return useQuery({
    queryKey: ["community-topic", topicId],
    queryFn: async () => {
      if (!topicId) return null;

      const { data, error } = await supabase
        .from("community_topics")
        .select(`
          *,
          category:category_id (
            id,
            name,
            slug
          ),
          author:author_id (
            first_name,
            last_name
          ),
          community_replies (
            *,
            author:author_id (
              first_name,
              last_name
            )
          ),
          community_likes (
            id,
            user_id
          )
        `)
        .eq("id", topicId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!topicId,
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ title, content, categoryId }: { title: string; content: string; categoryId: string }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("community_topics")
        .insert({
          title,
          content,
          category_id: categoryId,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-topics"] });
      toast({
        title: "Topic created",
        description: "Your discussion has been posted.",
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

export function useCreateReply() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ topicId, content }: { topicId: string; content: string }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("community_replies")
        .insert({
          topic_id: topicId,
          content,
          author_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-topic", variables.topicId] });
      queryClient.invalidateQueries({ queryKey: ["community-topics"] });
      toast({
        title: "Reply posted",
        description: "Your reply has been added.",
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

export function useToggleLike() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ topicId, isLiked }: { topicId: string; isLiked: boolean }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }

      if (isLiked) {
        // Remove like
        const { error } = await supabase
          .from("community_likes")
          .delete()
          .eq("topic_id", topicId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Add like
        const { error } = await supabase
          .from("community_likes")
          .insert({
            topic_id: topicId,
            user_id: user.id,
          });

        if (error) throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["community-topic", variables.topicId] });
      queryClient.invalidateQueries({ queryKey: ["community-topics"] });
    },
  });
}

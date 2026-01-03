import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserTeam } from "./useTeam";

export function useDashboardOverview() {
  const { data: userTeam } = useUserTeam();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["dashboard-overview", userTeam?.team_id, today],
    queryFn: async () => {
      if (!userTeam?.team_id) {
        return {
          activePatientsCount: 0,
          medicationsToday: { total: 0, completed: 0, remaining: 0 },
          tasksCompletionPercent: 0,
          upcomingTasksCount: 0,
          todaySchedule: [],
          recentActivity: [],
        };
      }

      // Get active patients count
      const { count: patientsCount } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .eq("team_id", userTeam.team_id);

      // Get today's tasks
      const { data: todayTasks } = await supabase
        .from("tasks")
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq("team_id", userTeam.team_id)
        .eq("scheduled_date", today)
        .order("scheduled_time", { ascending: true });

      const tasks = todayTasks || [];
      const completedTasks = tasks.filter(t => t.status === "COMPLETED");
      const tasksCompletionPercent = tasks.length > 0 
        ? Math.round((completedTasks.length / tasks.length) * 100) 
        : 0;

      // Get upcoming tasks (next 24 hours)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      const { count: upcomingCount } = await supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("team_id", userTeam.team_id)
        .in("scheduled_date", [today, tomorrowStr])
        .neq("status", "COMPLETED")
        .neq("status", "CANCELLED");

      // Get recent activity
      const { data: recentActivityData } = await supabase
        .from("activity_logs")
        .select(`
          *,
          actor:actor_id (
            first_name,
            last_name
          )
        `)
        .eq("team_id", userTeam.team_id)
        .order("created_at", { ascending: false })
        .limit(5);

      // Format today's schedule
      const todaySchedule = tasks.map(task => ({
        id: task.id,
        time: task.scheduled_time || "",
        title: task.title,
        patient: task.patients ? `${task.patients.first_name} ${task.patients.last_name}` : "General",
        status: task.status,
        type: task.type,
      }));

      // Format recent activity
      const recentActivity = (recentActivityData || []).map(activity => ({
        id: activity.id,
        type: activity.type,
        text: activity.description,
        time: getRelativeTime(new Date(activity.created_at)),
      }));

      return {
        activePatientsCount: patientsCount || 0,
        medicationsToday: { total: 0, completed: 0, remaining: 0 }, // TODO: integrate with medication doses
        tasksCompletionPercent,
        upcomingTasksCount: upcomingCount || 0,
        todaySchedule,
        recentActivity,
      };
    },
    enabled: !!userTeam?.team_id,
  });
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

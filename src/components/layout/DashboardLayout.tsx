import { Outlet, useLocation } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Welcome back" },
  "/dashboard/patients": { title: "Patients", subtitle: "Manage your patients" },
  "/dashboard/medications": { title: "Medications", subtitle: "Track medications and schedules" },
  "/dashboard/schedule": { title: "Schedule", subtitle: "Your care calendar" },
  "/dashboard/notes": { title: "Notes", subtitle: "Care notes and documentation" },
  "/dashboard/community": { title: "Community", subtitle: "Connect with fellow caregivers" },
  "/dashboard/team": { title: "Team", subtitle: "Manage your team" },
  "/dashboard/settings": { title: "Settings", subtitle: "Account and preferences" },
};

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useAuth();

  const pageInfo = pageTitles[location.pathname] || { title: "Dashboard" };
  
  // Personalize the welcome message on dashboard
  const subtitle = location.pathname === "/dashboard" && profile
    ? `Welcome back, ${profile.first_name}`
    : pageInfo.subtitle;

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          title={pageInfo.title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

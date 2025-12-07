import { useState } from "react";
import { Bell, Search, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function DashboardHeader({ title, subtitle, onMenuClick }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-accent lg:hidden"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-64 pl-9 h-9"
          />
        </div>

        {/* Mobile search toggle */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded-lg hover:bg-accent md:hidden"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-accent">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary" />
        </button>

        {/* Quick add */}
        <Button variant="default" size="sm" className="hidden sm:flex">
          <Plus className="w-4 h-4 mr-1" />
          Quick Add
        </Button>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-card border-b border-border md:hidden animate-fade-in">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search patients, notes, medications..." className="pl-9" />
          </div>
        </div>
      )}
    </header>
  );
}

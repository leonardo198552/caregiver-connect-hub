export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          actor_id: string | null
          created_at: string | null
          description: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          team_id: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          description: string
          entity_id?: string | null
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          team_id: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          description?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          team_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      community_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      community_likes: {
        Row: {
          created_at: string | null
          id: string
          topic_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          topic_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          topic_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_likes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_replies: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          topic_id: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          topic_id: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          topic_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "community_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      community_topics: {
        Row: {
          author_id: string | null
          category_id: string
          content: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id: string
          content: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: string
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "community_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_doses: {
        Row: {
          administered_at: string | null
          administered_by_id: string | null
          created_at: string | null
          dose_date: string
          id: string
          schedule_id: string
          status: Database["public"]["Enums"]["medication_dose_status"] | null
        }
        Insert: {
          administered_at?: string | null
          administered_by_id?: string | null
          created_at?: string | null
          dose_date: string
          id?: string
          schedule_id: string
          status?: Database["public"]["Enums"]["medication_dose_status"] | null
        }
        Update: {
          administered_at?: string | null
          administered_by_id?: string | null
          created_at?: string | null
          dose_date?: string
          id?: string
          schedule_id?: string
          status?: Database["public"]["Enums"]["medication_dose_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_doses_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "medication_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_schedules: {
        Row: {
          created_at: string | null
          days_of_week: string[] | null
          frequency_type: Database["public"]["Enums"]["frequency_type"] | null
          id: string
          medication_id: string
          time_of_day: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: string[] | null
          frequency_type?: Database["public"]["Enums"]["frequency_type"] | null
          id?: string
          medication_id: string
          time_of_day: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: string[] | null
          frequency_type?: Database["public"]["Enums"]["frequency_type"] | null
          id?: string
          medication_id?: string
          time_of_day?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_schedules_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string | null
          dosage: string | null
          id: string
          instructions: string | null
          low_stock_threshold: number | null
          name: string
          patient_id: string
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          instructions?: string | null
          low_stock_threshold?: number | null
          name: string
          patient_id: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          instructions?: string | null
          low_stock_threshold?: number | null
          name?: string
          patient_id?: string
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      note_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
          team_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
          team_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tags_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          patient_id: string
          title: string
          type: Database["public"]["Enums"]["note_type"] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          patient_id: string
          title: string
          type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string
          title?: string
          type?: Database["public"]["Enums"]["note_type"] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      notes_tags: {
        Row: {
          created_at: string | null
          id: string
          note_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_tags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "note_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          avatar_url: string | null
          clinical_status: Database["public"]["Enums"]["clinical_status"] | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          notes_summary: string | null
          primary_condition: string | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          clinical_status?:
            | Database["public"]["Enums"]["clinical_status"]
            | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          notes_summary?: string | null
          primary_condition?: string | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          clinical_status?:
            | Database["public"]["Enums"]["clinical_status"]
            | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          notes_summary?: string | null
          primary_condition?: string | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          notification_community_updates: boolean | null
          notification_email: boolean | null
          notification_medication_reminders: boolean | null
          notification_push: boolean | null
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          notification_community_updates?: boolean | null
          notification_email?: boolean | null
          notification_medication_reminders?: boolean | null
          notification_push?: boolean | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notification_community_updates?: boolean | null
          notification_email?: boolean | null
          notification_medication_reminders?: boolean | null
          notification_push?: boolean | null
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to_id: string | null
          completed_at: string | null
          completed_by_id: string | null
          created_at: string | null
          description: string | null
          id: string
          patient_id: string | null
          scheduled_date: string
          scheduled_time: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          team_id: string
          title: string
          type: Database["public"]["Enums"]["task_type"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to_id?: string | null
          completed_at?: string | null
          completed_by_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          team_id: string
          title: string
          type?: Database["public"]["Enums"]["task_type"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to_id?: string | null
          completed_at?: string | null
          completed_by_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          patient_id?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          team_id?: string
          title?: string
          type?: Database["public"]["Enums"]["task_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          cancelled_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["team_member_role"] | null
          team_id: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          role?: Database["public"]["Enums"]["team_member_role"] | null
          team_id: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["team_member_role"] | null
          team_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["team_member_role"] | null
          status: Database["public"]["Enums"]["team_member_status"] | null
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"] | null
          status?: Database["public"]["Enums"]["team_member_status"] | null
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["team_member_role"] | null
          status?: Database["public"]["Enums"]["team_member_status"] | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      visits: {
        Row: {
          caregiver_id: string | null
          created_at: string | null
          id: string
          patient_id: string
          summary: string | null
          visited_at: string
        }
        Insert: {
          caregiver_id?: string | null
          created_at?: string | null
          id?: string
          patient_id: string
          summary?: string | null
          visited_at?: string
        }
        Update: {
          caregiver_id?: string | null
          created_at?: string | null
          id?: string
          patient_id?: string
          summary?: string | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_team_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_type:
        | "MEDICATION_GIVEN"
        | "NOTE_ADDED"
        | "TASK_COMPLETED"
        | "PATIENT_ADDED"
        | "VISIT_LOGGED"
        | "TEAM_MEMBER_ADDED"
      clinical_status: "STABLE" | "MONITORING" | "ATTENTION"
      entity_type: "MEDICATION" | "NOTE" | "TASK" | "PATIENT" | "VISIT" | "TEAM"
      frequency_type: "DAILY" | "WEEKLY" | "MONTHLY" | "AS_NEEDED"
      medication_dose_status: "PENDING" | "COMPLETED" | "SKIPPED"
      note_type: "TEXT" | "VIDEO"
      task_status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
      task_type: "MEDICATION" | "VISIT" | "CARE" | "CUSTOM"
      team_member_role: "OWNER" | "MEMBER"
      team_member_status: "ACTIVE" | "AWAY" | "PENDING"
      user_role: "CAREGIVER" | "ADMIN"
      user_status: "ACTIVE" | "PENDING" | "DISABLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "MEDICATION_GIVEN",
        "NOTE_ADDED",
        "TASK_COMPLETED",
        "PATIENT_ADDED",
        "VISIT_LOGGED",
        "TEAM_MEMBER_ADDED",
      ],
      clinical_status: ["STABLE", "MONITORING", "ATTENTION"],
      entity_type: ["MEDICATION", "NOTE", "TASK", "PATIENT", "VISIT", "TEAM"],
      frequency_type: ["DAILY", "WEEKLY", "MONTHLY", "AS_NEEDED"],
      medication_dose_status: ["PENDING", "COMPLETED", "SKIPPED"],
      note_type: ["TEXT", "VIDEO"],
      task_status: ["UPCOMING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      task_type: ["MEDICATION", "VISIT", "CARE", "CUSTOM"],
      team_member_role: ["OWNER", "MEMBER"],
      team_member_status: ["ACTIVE", "AWAY", "PENDING"],
      user_role: ["CAREGIVER", "ADMIN"],
      user_status: ["ACTIVE", "PENDING", "DISABLED"],
    },
  },
} as const

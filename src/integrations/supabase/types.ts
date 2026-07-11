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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      country_themes: {
        Row: {
          code: string
          colors: Json
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          code: string
          colors: Json
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          code?: string
          colors?: Json
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      custom_packs: {
        Row: {
          color: string | null
          created_at: string
          emoji: string | null
          id: string
          name: string
          template: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          name: string
          template?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          emoji?: string | null
          id?: string
          name?: string
          template?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      drive_oauth_states: {
        Row: {
          expires_at: string
          state: string
          user_id: string
        }
        Insert: {
          expires_at?: string
          state: string
          user_id: string
        }
        Update: {
          expires_at?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      memories: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          done_at: string | null
          id: string
          metadata: Json
          pack_id: string | null
          remind_at: string | null
          reminder_fired_at: string | null
          snooze_fired_for: string | null
          snoozed_until: string | null
          title: string
          updated_at: string
          user_id: string
          voice_url: string | null
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          done_at?: string | null
          id?: string
          metadata?: Json
          pack_id?: string | null
          remind_at?: string | null
          reminder_fired_at?: string | null
          snooze_fired_for?: string | null
          snoozed_until?: string | null
          title?: string
          updated_at?: string
          user_id: string
          voice_url?: string | null
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          done_at?: string | null
          id?: string
          metadata?: Json
          pack_id?: string | null
          remind_at?: string | null
          reminder_fired_at?: string | null
          snooze_fired_for?: string | null
          snoozed_until?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          voice_url?: string | null
        }
        Relationships: []
      }
      notify_events: {
        Row: {
          fired_at: string
          id: string
          payload: Json
          read_at: string | null
          rule_id: string | null
          user_id: string
        }
        Insert: {
          fired_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          rule_id?: string | null
          user_id: string
        }
        Update: {
          fired_at?: string
          id?: string
          payload?: Json
          read_at?: string | null
          rule_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notify_events_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "notify_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      notify_rules: {
        Row: {
          action: Json
          created_at: string
          enabled: boolean
          id: string
          name: string
          trigger: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          action?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name: string
          trigger?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: Json
          created_at?: string
          enabled?: boolean
          id?: string
          name?: string
          trigger?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          cf_order_id: string
          cf_payment_id: string | null
          created_at: string
          currency: string
          id: string
          raw: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          cf_order_id: string
          cf_payment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          raw?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          cf_order_id?: string
          cf_payment_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          raw?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      places: {
        Row: {
          created_at: string
          id: string
          label: string
          lat: number
          lng: number
          metadata: Json
          radius_m: number
          transition: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          lat: number
          lng: number
          metadata?: Json
          radius_m?: number
          transition?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          lat?: number
          lng?: number
          metadata?: Json
          radius_m?: number
          transition?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_limits: {
        Row: {
          anon_limit: number
          description: string | null
          free_limit: number
          key: string
          label: string
          premium_limit: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          anon_limit?: number
          description?: string | null
          free_limit?: number
          key: string
          label: string
          premium_limit?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          anon_limit?: number
          description?: string | null
          free_limit?: number
          key?: string
          label?: string
          premium_limit?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          install_country: string | null
          install_country_set_at: string | null
          migrated_local_at: string | null
          plan: string
          plan_expires_at: string | null
          plan_source: string | null
          plan_updated_at: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          install_country?: string | null
          install_country_set_at?: string | null
          migrated_local_at?: string | null
          plan?: string
          plan_expires_at?: string | null
          plan_source?: string | null
          plan_updated_at?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          install_country?: string | null
          install_country_set_at?: string | null
          migrated_local_at?: string | null
          plan?: string
          plan_expires_at?: string | null
          plan_source?: string | null
          plan_updated_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string
          id: string
          platform: string
          token: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform?: string
          token: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          token?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      story_chapters: {
        Row: {
          backdrop_key: string
          created_at: string
          hero_alt: string
          hero_key: string
          id: string
          ink: string
          number: number
          path: string
          phone_screens: Json
          recap: string
          roman_numeral: string
          sky_bottom: string
          sky_top: string
          slug: string
          sort_order: number
          status: string
          tab_label: string
          teaser: string
          time_of_day: string
          title: string
          updated_at: string
          variant: string
        }
        Insert: {
          backdrop_key?: string
          created_at?: string
          hero_alt?: string
          hero_key?: string
          id?: string
          ink?: string
          number: number
          path: string
          phone_screens?: Json
          recap?: string
          roman_numeral: string
          sky_bottom?: string
          sky_top?: string
          slug: string
          sort_order?: number
          status?: string
          tab_label?: string
          teaser?: string
          time_of_day?: string
          title: string
          updated_at?: string
          variant?: string
        }
        Update: {
          backdrop_key?: string
          created_at?: string
          hero_alt?: string
          hero_key?: string
          id?: string
          ink?: string
          number?: number
          path?: string
          phone_screens?: Json
          recap?: string
          roman_numeral?: string
          sky_bottom?: string
          sky_top?: string
          slug?: string
          sort_order?: number
          status?: string
          tab_label?: string
          teaser?: string
          time_of_day?: string
          title?: string
          updated_at?: string
          variant?: string
        }
        Relationships: []
      }
      story_pills: {
        Row: {
          created_at: string
          id: string
          kind: string
          label: string
          sort_order: number
          status: string
          subchapter_id: string
          target_key: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          label?: string
          sort_order?: number
          status?: string
          subchapter_id: string
          target_key?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          label?: string
          sort_order?: number
          status?: string
          subchapter_id?: string
          target_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_pills_subchapter_id_fkey"
            columns: ["subchapter_id"]
            isOneToOne: false
            referencedRelation: "story_subchapters"
            referencedColumns: ["id"]
          },
        ]
      }
      story_subchapters: {
        Row: {
          backdrop_key: string
          backdrop_opacity: number
          caption: string
          chapter_id: string
          created_at: string
          eyebrow: string
          headline: string
          hero_alt: string
          hero_key: string
          hero_opacity: number
          id: string
          key: string
          layout: string
          mobile_image: string
          poster_url: string | null
          sort_order: number
          status: string
          tab_label: string
          title: string
          updated_at: string
        }
        Insert: {
          backdrop_key?: string
          backdrop_opacity?: number
          caption?: string
          chapter_id: string
          created_at?: string
          eyebrow?: string
          headline?: string
          hero_alt?: string
          hero_key?: string
          hero_opacity?: number
          id?: string
          key: string
          layout?: string
          mobile_image?: string
          poster_url?: string | null
          sort_order?: number
          status?: string
          tab_label?: string
          title?: string
          updated_at?: string
        }
        Update: {
          backdrop_key?: string
          backdrop_opacity?: number
          caption?: string
          chapter_id?: string
          created_at?: string
          eyebrow?: string
          headline?: string
          hero_alt?: string
          hero_key?: string
          hero_opacity?: number
          id?: string
          key?: string
          layout?: string
          mobile_image?: string
          poster_url?: string | null
          sort_order?: number
          status?: string
          tab_label?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_subchapters_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "story_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      story_walk_beats: {
        Row: {
          created_at: string
          default_screen: string
          id: string
          label: string
          sort_order: number
          status: string
          subchapter_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_screen?: string
          id?: string
          label?: string
          sort_order?: number
          status?: string
          subchapter_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_screen?: string
          id?: string
          label?: string
          sort_order?: number
          status?: string
          subchapter_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_walk_beats_subchapter_id_fkey"
            columns: ["subchapter_id"]
            isOneToOne: false
            referencedRelation: "story_subchapters"
            referencedColumns: ["id"]
          },
        ]
      }
      story_walk_steps: {
        Row: {
          beat_id: string
          body: string
          created_at: string
          id: string
          screen: string | null
          sort_order: number
          status: string
          target: string | null
          title: string
          updated_at: string
        }
        Insert: {
          beat_id: string
          body?: string
          created_at?: string
          id?: string
          screen?: string | null
          sort_order?: number
          status?: string
          target?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          beat_id?: string
          body?: string
          created_at?: string
          id?: string
          screen?: string | null
          sort_order?: number
          status?: string
          target?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_walk_steps_beat_id_fkey"
            columns: ["beat_id"]
            isOneToOne: false
            referencedRelation: "story_walk_beats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_drive_tokens: {
        Row: {
          connected_at: string
          folder_id: string | null
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_at?: string
          folder_id?: string | null
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_at?: string
          folder_id?: string | null
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          appearance: Json
          greetings: Json
          local_snapshot: Json
          onboarding: Json
          personality: Json
          quiz_progress: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          appearance?: Json
          greetings?: Json
          local_snapshot?: Json
          onboarding?: Json
          personality?: Json
          quiz_progress?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          appearance?: Json
          greetings?: Json
          local_snapshot?: Json
          onboarding?: Json
          personality?: Json
          quiz_progress?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_premium: { Args: { _user_id: string }; Returns: boolean }
      split_helper_exec_sql: { Args: { sql: string }; Returns: undefined }
      split_helper_list_tables: { Args: never; Returns: string[] }
      split_helper_rename_table: {
        Args: { from_name: string; to_name: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "superadmin" | "user" | "admin_marketing" | "admin_app"
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
      app_role: ["superadmin", "user", "admin_marketing", "admin_app"],
    },
  },
} as const

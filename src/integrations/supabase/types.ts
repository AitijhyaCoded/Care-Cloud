export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      books: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          for_mood: number[] | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          for_mood: number[] | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      hydration: {
        Row: {
          created_at: string
          current: number | null
          date: string
          id: string
          target: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current?: number | null
          date?: string
          id?: string
          target?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current?: number | null
          date?: string
          id?: string
          target?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      journals: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          preview: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          date?: string
          id?: string
          preview?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          preview?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      medications: {
        Row: {
          created_at: string
          dosage: string | null
          frequency: string | null
          id: string
          name: string
          time: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          name: string
          time?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          dosage?: string | null
          frequency?: string | null
          id?: string
          name?: string
          time?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      meditations: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: string
          for_mood: number[] | null
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration: string
          for_mood?: number[] | null
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string
          for_mood?: number[] | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          for_mood: number[] | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          for_mood?: number[] | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string
          date: string | null
          email: string | null
          id: string
          sent: boolean | null
          time: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          email?: string | null
          id?: string
          sent?: boolean | null
          time: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          email?: string | null
          id?: string
          sent?: boolean | null
          time?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string
          date: string
          id: string
          symptom_type: string
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          symptom_type: string
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          symptom_type?: string
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
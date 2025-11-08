// Supabase Database Types
// This file is generated from the Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string | null
          email: string | null
          location: string | null
          primary_archetype: 'allies' | 'innovators' | 'organizers' | 'patrons'
          primary_confidence: number | null
          secondary_archetype: 'allies' | 'innovators' | 'organizers' | 'patrons' | null
          archetype_reasoning: string | null
          consortium_role: 'ally' | 'citizen' | 'contributor' | 'patron' | null
          quiz_completed: boolean
          quiz_started_at: string | null
          quiz_completed_at: string | null
          quiz_version: string | null
          profile_image_url: string | null
          onboarding_summary: string | null
          engagement_actions: Json
          last_active_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          email?: string | null
          location?: string | null
          primary_archetype: 'allies' | 'innovators' | 'organizers' | 'patrons'
          primary_confidence?: number | null
          secondary_archetype?: 'allies' | 'innovators' | 'organizers' | 'patrons' | null
          archetype_reasoning?: string | null
          consortium_role?: 'ally' | 'citizen' | 'contributor' | 'patron' | null
          quiz_completed?: boolean
          quiz_started_at?: string | null
          quiz_completed_at?: string | null
          quiz_version?: string | null
          profile_image_url?: string | null
          onboarding_summary?: string | null
          engagement_actions?: Json
          last_active_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string | null
          email?: string | null
          location?: string | null
          primary_archetype?: 'allies' | 'innovators' | 'organizers' | 'patrons'
          primary_confidence?: number | null
          secondary_archetype?: 'allies' | 'innovators' | 'organizers' | 'patrons' | null
          archetype_reasoning?: string | null
          consortium_role?: 'ally' | 'citizen' | 'contributor' | 'patron' | null
          quiz_completed?: boolean
          quiz_started_at?: string | null
          quiz_completed_at?: string | null
          quiz_version?: string | null
          profile_image_url?: string | null
          onboarding_summary?: string | null
          engagement_actions?: Json
          last_active_at?: string | null
          metadata?: Json
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          id: string
          profile_id: string
          created_at: string
          question_id: string
          question_text: string
          question_type: string
          response_value: Json
          response_raw_text: string | null
          question_order: number
          time_spent_seconds: number | null
        }
        Insert: {
          id?: string
          profile_id: string
          created_at?: string
          question_id: string
          question_text: string
          question_type: string
          response_value: Json
          response_raw_text?: string | null
          question_order: number
          time_spent_seconds?: number | null
        }
        Update: {
          id?: string
          profile_id?: string
          created_at?: string
          question_id?: string
          question_text?: string
          question_type?: string
          response_value?: Json
          response_raw_text?: string | null
          question_order?: number
          time_spent_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_responses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profile_interests: {
        Row: {
          id: string
          profile_id: string
          created_at: string
          civic_sectors: string[]
          primary_civic_sector: string | null
          innovation_domains: string[] | null
          skills: string[] | null
          time_commitment: 'casual' | 'regular' | 'dedicated' | 'full_time' | null
        }
        Insert: {
          id?: string
          profile_id: string
          created_at?: string
          civic_sectors: string[]
          primary_civic_sector?: string | null
          innovation_domains?: string[] | null
          skills?: string[] | null
          time_commitment?: 'casual' | 'regular' | 'dedicated' | 'full_time' | null
        }
        Update: {
          id?: string
          profile_id?: string
          created_at?: string
          civic_sectors?: string[]
          primary_civic_sector?: string | null
          innovation_domains?: string[] | null
          skills?: string[] | null
          time_commitment?: 'casual' | 'regular' | 'dedicated' | 'full_time' | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_interests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      resource_recommendations: {
        Row: {
          id: string
          profile_id: string
          created_at: string
          notion_page_id: string
          resource_title: string | null
          resource_url: string | null
          resource_type: string | null
          resource_description: string | null
          relevance_score: number | null
          recommendation_reason: string | null
          viewed: boolean
          viewed_at: string | null
          rated_helpful: boolean | null
        }
        Insert: {
          id?: string
          profile_id: string
          created_at?: string
          notion_page_id: string
          resource_title?: string | null
          resource_url?: string | null
          resource_type?: string | null
          resource_description?: string | null
          relevance_score?: number | null
          recommendation_reason?: string | null
          viewed?: boolean
          viewed_at?: string | null
          rated_helpful?: boolean | null
        }
        Update: {
          id?: string
          profile_id?: string
          created_at?: string
          notion_page_id?: string
          resource_title?: string | null
          resource_url?: string | null
          resource_type?: string | null
          resource_description?: string | null
          relevance_score?: number | null
          recommendation_reason?: string | null
          viewed?: boolean
          viewed_at?: string | null
          rated_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_recommendations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          profile_id: string | null
          created_at: string
          message_role: 'user' | 'assistant' | 'system'
          message_content: string
          conversation_type: 'quiz' | 'general' | 'resource_query' | 'blueprint_composition'
          session_id: string | null
          gemini_model: string | null
          tokens_used: number | null
          metadata: Json
        }
        Insert: {
          id?: string
          profile_id?: string | null
          created_at?: string
          message_role: 'user' | 'assistant' | 'system'
          message_content: string
          conversation_type: 'quiz' | 'general' | 'resource_query' | 'blueprint_composition'
          session_id?: string | null
          gemini_model?: string | null
          tokens_used?: number | null
          metadata?: Json
        }
        Update: {
          id?: string
          profile_id?: string | null
          created_at?: string
          message_role?: 'user' | 'assistant' | 'system'
          message_content?: string
          conversation_type?: 'quiz' | 'general' | 'resource_query' | 'blueprint_composition'
          session_id?: string | null
          gemini_model?: string | null
          tokens_used?: number | null
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "conversations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      archetype: 'allies' | 'innovators' | 'organizers' | 'patrons'
      consortium_role: 'ally' | 'citizen' | 'contributor' | 'patron'
      time_commitment: 'casual' | 'regular' | 'dedicated' | 'full_time'
      message_role: 'user' | 'assistant' | 'system'
      conversation_type: 'quiz' | 'general' | 'resource_query' | 'blueprint_composition'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
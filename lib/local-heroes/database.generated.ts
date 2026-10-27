// Generated from disposable PostgreSQL with Supabase CLI; regenerate, do not edit members.
// Extraction keeps only the catalog tables/functions and their enum dependencies.
import type { Json } from "@/lib/database.types";
export type Database = {
  public: {
    Tables: {
      figure_localities: {
      Row: {
      certainty: string
      claim_key: string
      explanation: string
      figure_id: string
      historical_place_label: string
      id: string
      locality_code: string
      primary_source_id: string
      relationship_kind: string
      uncertainty_note: string | null
      }
      Insert: {
      certainty: string
      claim_key: string
      explanation: string
      figure_id: string
      historical_place_label: string
      id?: string
      locality_code: string
      primary_source_id: string
      relationship_kind: string
      uncertainty_note?: string | null
      }
      Update: {
      certainty?: string
      claim_key?: string
      explanation?: string
      figure_id?: string
      historical_place_label?: string
      id?: string
      locality_code?: string
      primary_source_id?: string
      relationship_kind?: string
      uncertainty_note?: string | null
      }
      Relationships: [
      {
      foreignKeyName: "figure_localities_claim_fkey"
      columns: ["figure_id", "claim_key", "primary_source_id"]
      isOneToOne: false
      referencedRelation: "figure_sources"
      referencedColumns: ["figure_id", "claim_key", "source_id"]
      },
      {
      foreignKeyName: "figure_localities_figure_id_fkey"
      columns: ["figure_id"]
      isOneToOne: false
      referencedRelation: "historical_figures"
      referencedColumns: ["id"]
      },
      {
      foreignKeyName: "figure_localities_locality_code_fkey"
      columns: ["locality_code"]
      isOneToOne: false
      referencedRelation: "history_localities"
      referencedColumns: ["code"]
      },
      ]
      }
      figure_media_evidence: {
      Row: {
      checked_at: string | null
      decision: string
      depiction_kind: string
      figure_id: string
      identity_certainty: string
      identity_locator: string
      identity_source_id: string
      media_id: string
      usage_basis: string
      usage_locator: string | null
      usage_note: string | null
      usage_source_id: string | null
      }
      Insert: {
      checked_at?: string | null
      decision?: string
      depiction_kind: string
      figure_id: string
      identity_certainty: string
      identity_locator: string
      identity_source_id: string
      media_id: string
      usage_basis: string
      usage_locator?: string | null
      usage_note?: string | null
      usage_source_id?: string | null
      }
      Update: {
      checked_at?: string | null
      decision?: string
      depiction_kind?: string
      figure_id?: string
      identity_certainty?: string
      identity_locator?: string
      identity_source_id?: string
      media_id?: string
      usage_basis?: string
      usage_locator?: string | null
      usage_note?: string | null
      usage_source_id?: string | null
      }
      Relationships: [
      {
      foreignKeyName: "figure_media_evidence_figure_id_fkey"
      columns: ["figure_id"]
      isOneToOne: false
      referencedRelation: "historical_figures"
      referencedColumns: ["id"]
      },
      {
      foreignKeyName: "figure_media_evidence_identity_source_id_fkey"
      columns: ["identity_source_id"]
      isOneToOne: false
      referencedRelation: "sources"
      referencedColumns: ["id"]
      },
      {
      foreignKeyName: "figure_media_evidence_owner_fkey"
      columns: ["media_id", "figure_id"]
      isOneToOne: false
      referencedRelation: "media_assets"
      referencedColumns: ["id", "figure_id"]
      },
      {
      foreignKeyName: "figure_media_evidence_usage_source_id_fkey"
      columns: ["usage_source_id"]
      isOneToOne: false
      referencedRelation: "sources"
      referencedColumns: ["id"]
      },
      ]
      }
      figure_sources: {
      Row: {
      certainty: string
      claim_key: string
      claim_text: string
      figure_id: string
      locator: string
      scope_note: string
      source_id: string
      uncertainty_note: string | null
      }
      Insert: {
      certainty: string
      claim_key: string
      claim_text: string
      figure_id: string
      locator: string
      scope_note: string
      source_id: string
      uncertainty_note?: string | null
      }
      Update: {
      certainty?: string
      claim_key?: string
      claim_text?: string
      figure_id?: string
      locator?: string
      scope_note?: string
      source_id?: string
      uncertainty_note?: string | null
      }
      Relationships: [
      {
      foreignKeyName: "figure_sources_figure_id_fkey"
      columns: ["figure_id"]
      isOneToOne: false
      referencedRelation: "historical_figures"
      referencedColumns: ["id"]
      },
      {
      foreignKeyName: "figure_sources_source_id_fkey"
      columns: ["source_id"]
      isOneToOne: false
      referencedRelation: "sources"
      referencedColumns: ["id"]
      },
      ]
      }
      figure_stories: {
      Row: {
      body: string
      created_at: string
      figure_id: string
      id: string
      is_primary: boolean
      review_note: string | null
      slug: string
      sort_order: number
      summary: string
      title: string
      updated_at: string
      workflow_status: Database["public"]["Enums"]["content_workflow_status"]
      }
      Insert: {
      body: string
      created_at?: string
      figure_id: string
      id?: string
      is_primary?: boolean
      review_note?: string | null
      slug: string
      sort_order?: number
      summary: string
      title: string
      updated_at?: string
      workflow_status?: Database["public"]["Enums"]["content_workflow_status"]
      }
      Update: {
      body?: string
      created_at?: string
      figure_id?: string
      id?: string
      is_primary?: boolean
      review_note?: string | null
      slug?: string
      sort_order?: number
      summary?: string
      title?: string
      updated_at?: string
      workflow_status?: Database["public"]["Enums"]["content_workflow_status"]
      }
      Relationships: [
      {
      foreignKeyName: "figure_stories_figure_id_fkey"
      columns: ["figure_id"]
      isOneToOne: false
      referencedRelation: "historical_figures"
      referencedColumns: ["id"]
      },
      ]
      }
      figure_story_sources: {
      Row: {
      certainty: string
      claim_key: string
      claim_text: string
      locator: string
      scope_note: string
      source_id: string
      story_id: string
      uncertainty_note: string | null
      }
      Insert: {
      certainty: string
      claim_key: string
      claim_text: string
      locator: string
      scope_note: string
      source_id: string
      story_id: string
      uncertainty_note?: string | null
      }
      Update: {
      certainty?: string
      claim_key?: string
      claim_text?: string
      locator?: string
      scope_note?: string
      source_id?: string
      story_id?: string
      uncertainty_note?: string | null
      }
      Relationships: [
      {
      foreignKeyName: "figure_story_sources_source_id_fkey"
      columns: ["source_id"]
      isOneToOne: false
      referencedRelation: "sources"
      referencedColumns: ["id"]
      },
      {
      foreignKeyName: "figure_story_sources_story_id_fkey"
      columns: ["story_id"]
      isOneToOne: false
      referencedRelation: "figure_stories"
      referencedColumns: ["id"]
      },
      ]
      }
      historical_figures: {
      Row: {
      biography: string | null
      birth_year: number | null
      catalog_aliases: string[]
      contribution_end_year: number | null
      contribution_start_year: number | null
      contribution_summary: string | null
      death_year: number | null
      id: string
      is_local_hero: boolean
      local_hero_revision: number
      local_hero_search_text: string
      name: string
      other_names: string | null
      portrait_url: string | null
      review_note: string | null
      slug: string
      workflow_status: Database["public"]["Enums"]["content_workflow_status"]
      }
      Insert: {
      biography?: string | null
      birth_year?: number | null
      catalog_aliases?: string[]
      contribution_end_year?: number | null
      contribution_start_year?: number | null
      contribution_summary?: string | null
      death_year?: number | null
      id?: string
      is_local_hero?: boolean
      local_hero_revision?: number
      local_hero_search_text?: string
      name: string
      other_names?: string | null
      portrait_url?: string | null
      review_note?: string | null
      slug: string
      workflow_status?: Database["public"]["Enums"]["content_workflow_status"]
      }
      Update: {
      biography?: string | null
      birth_year?: number | null
      catalog_aliases?: string[]
      contribution_end_year?: number | null
      contribution_start_year?: number | null
      contribution_summary?: string | null
      death_year?: number | null
      id?: string
      is_local_hero?: boolean
      local_hero_revision?: number
      local_hero_search_text?: string
      name?: string
      other_names?: string | null
      portrait_url?: string | null
      review_note?: string | null
      slug?: string
      workflow_status?: Database["public"]["Enums"]["content_workflow_status"]
      }
      Relationships: []
      }
      history_localities: {
      Row: {
      code: string
      official_name: string
      reference_framework: string
      slug: string
      source_accessed_at: string
      source_locator: string
      source_url: string
      }
      Insert: {
      code: string
      official_name: string
      reference_framework?: string
      slug: string
      source_accessed_at: string
      source_locator: string
      source_url: string
      }
      Update: {
      code?: string
      official_name?: string
      reference_framework?: string
      slug?: string
      source_accessed_at?: string
      source_locator?: string
      source_url?: string
      }
      Relationships: []
      }
    }
    Functions: {
      local_hero_aliases_valid: {
      Args: { p_values: string[] }
      Returns: boolean
      }
      local_hero_fold: { Args: { p_value: string }; Returns: string }
      local_hero_page: {
      Args: { p_locality_code: string; p_page: number; p_query: string }
      Returns: Json
      }
      local_hero_profile: { Args: { p_slug: string }; Returns: Json }
      local_hero_restore_draft: { Args: { p_command: Json }; Returns: Json }
      local_hero_review_graph: { Args: { p_command: Json }; Returns: Json }
      local_hero_save_graph: { Args: { p_command: Json }; Returns: Json }
      local_hero_submit_graph: { Args: { p_command: Json }; Returns: Json }
    }
    Enums: {
      account_status: "active" | "locked"
      content_workflow_status:
      | "draft"
      | "pending_review"
      | "needs_revision"
      | "published"
      | "hidden"
      exam_attempt_mode: "exam" | "practice" | "review" | "paper"
      exam_attempt_status: "in_progress" | "submitted" | "abandoned"
      exam_competency:
      | "tim_hieu_lich_su"
      | "nhan_thuc_tu_duy"
      | "van_dung_kien_thuc"
      exam_item_kind: "mcq" | "true_false"
      exam_item_level: "nhan_biet" | "thong_hieu" | "van_dung"
      exam_report_reason:
      | "sai_dap_an"
      | "loi_chinh_ta"
      | "khong_ro_nghia"
      | "sai_kien_thuc"
      | "khac"
      order_status: "pending" | "paid" | "cancelled" | "expired" | "refunded"
      product_kind: "exam_pack" | "donation"
      staff_role: "editor" | "reviewer" | "system_admin"
    }
    Views: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
};

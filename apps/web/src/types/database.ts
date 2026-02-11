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
      canontask_projects: {
        Row: {
          archived: boolean | null
          color: string | null
          created_at: string
          custom_fields: Json | null
          default_priority:
            | Database["public"]["Enums"]["canontask_task_priority"]
            | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["canontask_project_status"] | null
          tags: Json | null
          team_id: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          color?: string | null
          created_at?: string
          custom_fields?: Json | null
          default_priority?:
            | Database["public"]["Enums"]["canontask_task_priority"]
            | null
          description?: string | null
          id: string
          name: string
          status?:
            | Database["public"]["Enums"]["canontask_project_status"]
            | null
          tags?: Json | null
          team_id: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          color?: string | null
          created_at?: string
          custom_fields?: Json | null
          default_priority?:
            | Database["public"]["Enums"]["canontask_task_priority"]
            | null
          description?: string | null
          id?: string
          name?: string
          status?:
            | Database["public"]["Enums"]["canontask_project_status"]
            | null
          tags?: Json | null
          team_id?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kernel_admin_config: {
        Row: {
          created_at: string
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      kernel_audit_log: {
        Row: {
          actor_id: string | null
          actor_type: string | null
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          event_type: string
          id: string
          ip_address: string | null
          previous_values: Json | null
          trace_id: string | null
          user_agent: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          event_type: string
          id?: string
          ip_address?: string | null
          previous_values?: Json | null
          trace_id?: string | null
          user_agent?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_type?: string | null
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          previous_values?: Json | null
          trace_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      kernel_network_incidents: {
        Row: {
          created_at: string
          end_time: string | null
          id: string
          start_time: string
          summary: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: string
          start_time?: string
          summary: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: string
          start_time?: string
          summary?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      kernel_service_registry: {
        Row: {
          created_at: string
          description: string | null
          documentation_url: string | null
          endpoint: string
          health_check: string
          health_check_interval_ms: number | null
          health_check_timeout_ms: number | null
          id: string
          last_health_check: string | null
          last_health_error: string | null
          last_health_latency_ms: number | null
          owner_contact: string | null
          registered_at: string
          status: string
          tags: Json | null
          updated_at: string
          version: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          endpoint: string
          health_check: string
          health_check_interval_ms?: number | null
          health_check_timeout_ms?: number | null
          id: string
          last_health_check?: string | null
          last_health_error?: string | null
          last_health_latency_ms?: number | null
          owner_contact?: string | null
          registered_at?: string
          status?: string
          tags?: Json | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          documentation_url?: string | null
          endpoint?: string
          health_check?: string
          health_check_interval_ms?: number | null
          health_check_timeout_ms?: number | null
          id?: string
          last_health_check?: string | null
          last_health_error?: string | null
          last_health_latency_ms?: number | null
          owner_contact?: string | null
          registered_at?: string
          status?: string
          tags?: Json | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      magicdrive_collection_objects: {
        Row: {
          collection_id: string
          object_id: string
        }
        Insert: {
          collection_id: string
          object_id: string
        }
        Update: {
          collection_id?: string
          object_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magicdrive_collection_objects_collection_id_magicdrive_collecti"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magicdrive_collection_objects_object_id_magicdrive_objects_id_f"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_collections: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_smart_collection: boolean | null
          legacy_tenant_id: string
          name: string
          organization_id: string | null
          owner_id: string | null
          smart_filter: Json | null
          sort_order: number | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id: string
          is_smart_collection?: boolean | null
          legacy_tenant_id: string
          name: string
          organization_id?: string | null
          owner_id?: string | null
          smart_filter?: Json | null
          sort_order?: number | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_smart_collection?: boolean | null
          legacy_tenant_id?: string
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          smart_filter?: Json | null
          sort_order?: number | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_collections_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_collections_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_duplicate_group_versions: {
        Row: {
          group_id: string
          version_id: string
        }
        Insert: {
          group_id: string
          version_id: string
        }
        Update: {
          group_id?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magicdrive_duplicate_group_versions_group_id_magicdrive_duplica"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_duplicate_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_duplicate_groups: {
        Row: {
          created_at: string | null
          id: string
          keep_version_id: string | null
          legacy_tenant_id: string
          organization_id: string | null
          reason: Database["public"]["Enums"]["magicdrive_dup_reason"]
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          keep_version_id?: string | null
          legacy_tenant_id: string
          organization_id?: string | null
          reason: Database["public"]["Enums"]["magicdrive_dup_reason"]
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          keep_version_id?: string | null
          legacy_tenant_id?: string
          organization_id?: string | null
          reason?: Database["public"]["Enums"]["magicdrive_dup_reason"]
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_duplicate_groups_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_duplicate_groups_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_object_index: {
        Row: {
          created_at: string | null
          extracted_fields: Json | null
          extracted_text: string | null
          id: string
          object_id: string
          text_hash: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          extracted_fields?: Json | null
          extracted_text?: string | null
          id: string
          object_id: string
          text_hash?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          extracted_fields?: Json | null
          extracted_text?: string | null
          id?: string
          object_id?: string
          text_hash?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "magicdrive_object_index_object_id_magicdrive_objects_id_fk"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_object_tags: {
        Row: {
          object_id: string
          tag_id: string
        }
        Insert: {
          object_id: string
          tag_id: string
        }
        Update: {
          object_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magicdrive_object_tags_object_id_magicdrive_objects_id_fk"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_objects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magicdrive_object_tags_tag_id_magicdrive_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_object_versions: {
        Row: {
          created_at: string | null
          id: string
          mime_type: string
          object_id: string
          r2_key: string
          sha256: string
          size_bytes: number
          version_no: number
        }
        Insert: {
          created_at?: string | null
          id: string
          mime_type: string
          object_id: string
          r2_key: string
          sha256: string
          size_bytes: number
          version_no: number
        }
        Update: {
          created_at?: string | null
          id?: string
          mime_type?: string
          object_id?: string
          r2_key?: string
          sha256?: string
          size_bytes?: number
          version_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "magicdrive_object_versions_object_id_magicdrive_objects_id_fk"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "magicdrive_objects"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_objects: {
        Row: {
          archived_at: string | null
          created_at: string | null
          current_version_id: string | null
          deleted_at: string | null
          doc_type: Database["public"]["Enums"]["magicdrive_doc_type"]
          id: string
          legacy_tenant_id: string
          organization_id: string | null
          owner_id: string
          status: Database["public"]["Enums"]["magicdrive_status"]
          team_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          archived_at?: string | null
          created_at?: string | null
          current_version_id?: string | null
          deleted_at?: string | null
          doc_type?: Database["public"]["Enums"]["magicdrive_doc_type"]
          id: string
          legacy_tenant_id: string
          organization_id?: string | null
          owner_id: string
          status?: Database["public"]["Enums"]["magicdrive_status"]
          team_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          archived_at?: string | null
          created_at?: string | null
          current_version_id?: string | null
          deleted_at?: string | null
          doc_type?: Database["public"]["Enums"]["magicdrive_doc_type"]
          id?: string
          legacy_tenant_id?: string
          organization_id?: string | null
          owner_id?: string
          status?: Database["public"]["Enums"]["magicdrive_status"]
          team_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_objects_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_objects_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_saved_views: {
        Row: {
          created_at: string | null
          description: string | null
          filters: Json | null
          id: string
          is_default: boolean | null
          is_public: boolean | null
          legacy_tenant_id: string
          name: string
          organization_id: string | null
          sort_by: string | null
          sort_order: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string
          view_mode: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id: string
          is_default?: boolean | null
          is_public?: boolean | null
          legacy_tenant_id: string
          name: string
          organization_id?: string | null
          sort_by?: string | null
          sort_order?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id: string
          view_mode?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          legacy_tenant_id?: string
          name?: string
          organization_id?: string | null
          sort_by?: string | null
          sort_order?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
          view_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_saved_views_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_saved_views_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          legacy_tenant_id: string
          name: string
          organization_id: string | null
          slug: string
          team_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id: string
          legacy_tenant_id: string
          name: string
          organization_id?: string | null
          slug: string
          team_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          legacy_tenant_id?: string
          name?: string
          organization_id?: string | null
          slug?: string
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_tags_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_tags_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_tenant_settings: {
        Row: {
          allowed_file_types: Json | null
          created_at: string | null
          document_types: Json | null
          enable_ai_suggestions: boolean | null
          enable_public_shares: boolean | null
          id: string
          legacy_tenant_id: string
          max_file_size_mb: number | null
          organization_id: string | null
          status_workflow: Json | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          allowed_file_types?: Json | null
          created_at?: string | null
          document_types?: Json | null
          enable_ai_suggestions?: boolean | null
          enable_public_shares?: boolean | null
          id: string
          legacy_tenant_id: string
          max_file_size_mb?: number | null
          organization_id?: string | null
          status_workflow?: Json | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allowed_file_types?: Json | null
          created_at?: string | null
          document_types?: Json | null
          enable_ai_suggestions?: boolean | null
          enable_public_shares?: boolean | null
          id?: string
          legacy_tenant_id?: string
          max_file_size_mb?: number | null
          organization_id?: string | null
          status_workflow?: Json | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_tenant_settings_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_tenant_settings_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_uploads: {
        Row: {
          created_at: string | null
          filename: string
          id: string
          legacy_tenant_id: string
          mime_type: string
          object_id: string
          organization_id: string | null
          owner_id: string
          r2_key_quarantine: string
          sha256: string
          size_bytes: number
          status: Database["public"]["Enums"]["magicdrive_upload_status"]
          team_id: string | null
          version_id: string
        }
        Insert: {
          created_at?: string | null
          filename: string
          id: string
          legacy_tenant_id: string
          mime_type: string
          object_id: string
          organization_id?: string | null
          owner_id: string
          r2_key_quarantine: string
          sha256: string
          size_bytes: number
          status?: Database["public"]["Enums"]["magicdrive_upload_status"]
          team_id?: string | null
          version_id: string
        }
        Update: {
          created_at?: string | null
          filename?: string
          id?: string
          legacy_tenant_id?: string
          mime_type?: string
          object_id?: string
          organization_id?: string | null
          owner_id?: string
          r2_key_quarantine?: string
          sha256?: string
          size_bytes?: number
          status?: Database["public"]["Enums"]["magicdrive_upload_status"]
          team_id?: string | null
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_uploads_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_uploads_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magicdrive_user_preferences: {
        Row: {
          compact_mode: boolean | null
          created_at: string | null
          default_sort: string | null
          default_view: string | null
          id: string
          items_per_page: number | null
          legacy_tenant_id: string
          organization_id: string | null
          quick_settings: Json | null
          show_file_extensions: boolean | null
          show_thumbnails: boolean | null
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compact_mode?: boolean | null
          created_at?: string | null
          default_sort?: string | null
          default_view?: string | null
          id: string
          items_per_page?: number | null
          legacy_tenant_id: string
          organization_id?: string | null
          quick_settings?: Json | null
          show_file_extensions?: boolean | null
          show_thumbnails?: boolean | null
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compact_mode?: boolean | null
          created_at?: string | null
          default_sort?: string | null
          default_view?: string | null
          id?: string
          items_per_page?: number | null
          legacy_tenant_id?: string
          organization_id?: string | null
          quick_settings?: Json | null
          show_file_extensions?: boolean | null
          show_thumbnails?: boolean | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magicdrive_user_preferences_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magicdrive_user_preferences_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_focus_session_queue: {
        Row: {
          added_at: string | null
          completed_at: string | null
          id: string
          position: number
          session_id: string
          skipped_count: number | null
          task_id: string
        }
        Insert: {
          added_at?: string | null
          completed_at?: string | null
          id?: string
          position: number
          session_id: string
          skipped_count?: number | null
          task_id: string
        }
        Update: {
          added_at?: string | null
          completed_at?: string | null
          id?: string
          position?: number
          session_id?: string
          skipped_count?: number | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magictodo_focus_session_queue_session_id_magictodo_focus_sessio"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "magictodo_focus_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_focus_session_queue_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_focus_sessions: {
        Row: {
          breaks: number | null
          created_at: string | null
          current_task_id: string | null
          daily_goal: number | null
          ended_at: string | null
          id: string
          organization_id: string | null
          settings: Json | null
          started_at: string | null
          status: Database["public"]["Enums"]["magictodo_focus_session_status"]
          tasks_completed: number | null
          tasks_skipped: number | null
          team_id: string | null
          total_focus_time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          breaks?: number | null
          created_at?: string | null
          current_task_id?: string | null
          daily_goal?: number | null
          ended_at?: string | null
          id: string
          organization_id?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["magictodo_focus_session_status"]
          tasks_completed?: number | null
          tasks_skipped?: number | null
          team_id?: string | null
          total_focus_time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          breaks?: number | null
          created_at?: string | null
          current_task_id?: string | null
          daily_goal?: number | null
          ended_at?: string | null
          id?: string
          organization_id?: string | null
          settings?: Json | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["magictodo_focus_session_status"]
          tasks_completed?: number | null
          tasks_skipped?: number | null
          team_id?: string | null
          total_focus_time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_focus_sessions_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_focus_sessions_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_focus_sessions_current_task_id_magictodo_tasks_id_fk"
            columns: ["current_task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_immutable_memos: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          message: string
          passphrase_hash: string
          position: number | null
          snoozed_until: string | null
          status: string
          team_id: string
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id: string
          message: string
          passphrase_hash: string
          position?: number | null
          snoozed_until?: string | null
          status?: string
          team_id: string
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          message?: string
          passphrase_hash?: string
          position?: number | null
          snoozed_until?: string | null
          status?: string
          team_id?: string
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      magictodo_projects: {
        Row: {
          archived: boolean | null
          color: string | null
          created_at: string | null
          custom_fields: Json | null
          default_priority:
            | Database["public"]["Enums"]["magictodo_task_priority"]
            | null
          description: string | null
          id: string
          name: string
          organization_id: string | null
          tags: Json | null
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          color?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          default_priority?:
            | Database["public"]["Enums"]["magictodo_task_priority"]
            | null
          description?: string | null
          id: string
          name: string
          organization_id?: string | null
          tags?: Json | null
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          archived?: boolean | null
          color?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          default_priority?:
            | Database["public"]["Enums"]["magictodo_task_priority"]
            | null
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          tags?: Json | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_projects_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_projects_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_saved_views: {
        Row: {
          created_at: string
          description: string | null
          filters: Json | null
          group_by: string | null
          id: string
          is_default: boolean | null
          is_public: boolean | null
          name: string
          smart_filter: string | null
          sort_by: string | null
          sort_order: string | null
          team_id: string
          tenant_id: string
          updated_at: string
          user_id: string
          view_mode: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          filters?: Json | null
          group_by?: string | null
          id: string
          is_default?: boolean | null
          is_public?: boolean | null
          name: string
          smart_filter?: string | null
          sort_by?: string | null
          sort_order?: string | null
          team_id: string
          tenant_id: string
          updated_at?: string
          user_id: string
          view_mode?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          filters?: Json | null
          group_by?: string | null
          id?: string
          is_default?: boolean | null
          is_public?: boolean | null
          name?: string
          smart_filter?: string | null
          sort_by?: string | null
          sort_order?: string | null
          team_id?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
          view_mode?: string | null
        }
        Relationships: []
      }
      magictodo_snoozed_tasks: {
        Row: {
          created_at: string | null
          dependency_task_id: string | null
          id: string
          organization_id: string | null
          reason: string | null
          snooze_count: number | null
          snoozed_until: string
          task_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_task_id?: string | null
          id?: string
          organization_id?: string | null
          reason?: string | null
          snooze_count?: number | null
          snoozed_until: string
          task_id: string
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dependency_task_id?: string | null
          id?: string
          organization_id?: string | null
          reason?: string | null
          snooze_count?: number | null
          snoozed_until?: string
          task_id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_snoozed_tasks_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_snoozed_tasks_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_snoozed_tasks_dependency_task_id_magictodo_tasks_id_f"
            columns: ["dependency_task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_snoozed_tasks_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_task_activity: {
        Row: {
          action: string
          created_at: string
          field_name: string | null
          id: string
          metadata: Json | null
          new_value: string | null
          old_value: string | null
          task_id: string
          team_id: string
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          task_id: string
          team_id: string
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          field_name?: string | null
          id?: string
          metadata?: Json | null
          new_value?: string | null
          old_value?: string | null
          task_id?: string
          team_id?: string
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magictodo_task_activity_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_task_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          organization_id: string | null
          parent_id: string | null
          task_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          organization_id?: string | null
          parent_id?: string | null
          task_id: string
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          organization_id?: string | null
          parent_id?: string | null
          task_id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_task_comments_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_task_comments_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_task_comments_parent_id_magictodo_task_comments_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "magictodo_task_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_task_comments_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_task_dependencies: {
        Row: {
          created_at: string | null
          dependency_type: string
          depends_on_task_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_type?: string
          depends_on_task_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          dependency_type?: string
          depends_on_task_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "magictodo_task_dependencies_depends_on_task_id_magictodo_tasks_"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_task_dependencies_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_tasks: {
        Row: {
          actual_minutes: number | null
          category:
            | Database["public"]["Enums"]["magictodo_task_category"]
            | null
          completed_at: string | null
          created_at: string | null
          custom_fields: Json | null
          description: string | null
          due_date: string | null
          estimated_minutes: number | null
          evidence_required: boolean | null
          id: string
          impact_weight: number | null
          intent_type: string | null
          next_occurrence_date: string | null
          organization_id: string | null
          parent_task_id: string | null
          position: number | null
          priority: Database["public"]["Enums"]["magictodo_task_priority"]
          project_id: string | null
          recurrence_rule: Json | null
          risk_weight: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["magictodo_task_status"]
          tags: Json | null
          team_id: string | null
          title: string
          updated_at: string | null
          urgency: number | null
          user_id: string
        }
        Insert: {
          actual_minutes?: number | null
          category?:
            | Database["public"]["Enums"]["magictodo_task_category"]
            | null
          completed_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          evidence_required?: boolean | null
          id: string
          impact_weight?: number | null
          intent_type?: string | null
          next_occurrence_date?: string | null
          organization_id?: string | null
          parent_task_id?: string | null
          position?: number | null
          priority?: Database["public"]["Enums"]["magictodo_task_priority"]
          project_id?: string | null
          recurrence_rule?: Json | null
          risk_weight?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["magictodo_task_status"]
          tags?: Json | null
          team_id?: string | null
          title: string
          updated_at?: string | null
          urgency?: number | null
          user_id: string
        }
        Update: {
          actual_minutes?: number | null
          category?:
            | Database["public"]["Enums"]["magictodo_task_category"]
            | null
          completed_at?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_minutes?: number | null
          evidence_required?: boolean | null
          id?: string
          impact_weight?: number | null
          intent_type?: string | null
          next_occurrence_date?: string | null
          organization_id?: string | null
          parent_task_id?: string | null
          position?: number | null
          priority?: Database["public"]["Enums"]["magictodo_task_priority"]
          project_id?: string | null
          recurrence_rule?: Json | null
          risk_weight?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["magictodo_task_status"]
          tags?: Json | null
          team_id?: string | null
          title?: string
          updated_at?: string | null
          urgency?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_tasks_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_tasks_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_tasks_parent_task_id_magictodo_tasks_id_fk"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_tasks_project_id_magictodo_projects_id_fk"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "magictodo_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      magictodo_time_entries: {
        Row: {
          billable: boolean | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          organization_id: string | null
          start_time: string
          task_id: string
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billable?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          organization_id?: string | null
          start_time: string
          task_id: string
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billable?: boolean | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          organization_id?: string | null
          start_time?: string
          task_id?: string
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_magictodo_time_entries_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_magictodo_time_entries_team"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "magictodo_time_entries_task_id_magictodo_tasks_id_fk"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "magictodo_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      orchestra_app_domains: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          href: string
          icon: string
          id: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          href: string
          icon: string
          id: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          href?: string
          icon?: string
          id?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      orchestra_backup_history: {
        Row: {
          actor_id: string | null
          backup_id: string
          created_at: string
          event_details: Json | null
          event_message: string | null
          event_type: string
          id: string
          trace_id: string | null
        }
        Insert: {
          actor_id?: string | null
          backup_id: string
          created_at?: string
          event_details?: Json | null
          event_message?: string | null
          event_type: string
          id?: string
          trace_id?: string | null
        }
        Update: {
          actor_id?: string | null
          backup_id?: string
          created_at?: string
          event_details?: Json | null
          event_message?: string | null
          event_type?: string
          id?: string
          trace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orchestra_backup_history_backup_id_orchestra_backups_id_fk"
            columns: ["backup_id"]
            isOneToOne: false
            referencedRelation: "orchestra_backups"
            referencedColumns: ["id"]
          },
        ]
      }
      orchestra_backup_schedule: {
        Row: {
          backup_type: string
          created_at: string
          created_by: string | null
          cron_expression: string
          enabled: boolean
          id: string
          last_run: string | null
          name: string
          next_run: string | null
          retention_days: number
          updated_at: string
        }
        Insert: {
          backup_type?: string
          created_at?: string
          created_by?: string | null
          cron_expression: string
          enabled?: boolean
          id?: string
          last_run?: string | null
          name: string
          next_run?: string | null
          retention_days?: number
          updated_at?: string
        }
        Update: {
          backup_type?: string
          created_at?: string
          created_by?: string | null
          cron_expression?: string
          enabled?: boolean
          id?: string
          last_run?: string | null
          name?: string
          next_run?: string | null
          retention_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      orchestra_backups: {
        Row: {
          backup_type: string
          checksum: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          encrypted: boolean
          encryption_algorithm: string | null
          encryption_key_version: string | null
          error_details: Json | null
          error_message: string | null
          expires_at: string | null
          filename: string
          id: string
          includes_database: boolean | null
          includes_r2_bucket: boolean | null
          includes_services: Json | null
          local_fallback_path: string | null
          metadata: Json | null
          size_bytes: number
          status: string
          storage_location: string
          storage_provider: string
        }
        Insert: {
          backup_type: string
          checksum: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          encrypted?: boolean
          encryption_algorithm?: string | null
          encryption_key_version?: string | null
          error_details?: Json | null
          error_message?: string | null
          expires_at?: string | null
          filename: string
          id?: string
          includes_database?: boolean | null
          includes_r2_bucket?: boolean | null
          includes_services?: Json | null
          local_fallback_path?: string | null
          metadata?: Json | null
          size_bytes: number
          status: string
          storage_location: string
          storage_provider: string
        }
        Update: {
          backup_type?: string
          checksum?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          encrypted?: boolean
          encryption_algorithm?: string | null
          encryption_key_version?: string | null
          error_details?: Json | null
          error_message?: string | null
          expires_at?: string | null
          filename?: string
          id?: string
          includes_database?: boolean | null
          includes_r2_bucket?: boolean | null
          includes_services?: Json | null
          local_fallback_path?: string | null
          metadata?: Json | null
          size_bytes?: number
          status?: string
          storage_location?: string
          storage_provider?: string
        }
        Relationships: []
      }
      orchestra_config_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          config_key: string
          id: string
          new_value: Json | null
          old_value: Json | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          config_key: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          config_key?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
        }
        Relationships: []
      }
      orchestra_custom_templates: {
        Row: {
          applied_count: string | null
          archived_at: string | null
          archived_by: string | null
          category: string
          configs: Json
          created_at: string
          created_by: string | null
          description: string
          icon: string
          id: string
          last_applied_at: string | null
          name: string
          published_at: string | null
          status: string
          tags: Json | null
          updated_at: string
          updated_by: string | null
          version: string | null
        }
        Insert: {
          applied_count?: string | null
          archived_at?: string | null
          archived_by?: string | null
          category: string
          configs: Json
          created_at?: string
          created_by?: string | null
          description: string
          icon?: string
          id?: string
          last_applied_at?: string | null
          name: string
          published_at?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          applied_count?: string | null
          archived_at?: string | null
          archived_by?: string | null
          category?: string
          configs?: Json
          created_at?: string
          created_by?: string | null
          description?: string
          icon?: string
          id?: string
          last_applied_at?: string | null
          name?: string
          published_at?: string | null
          status?: string
          tags?: Json | null
          updated_at?: string
          updated_by?: string | null
          version?: string | null
        }
        Relationships: []
      }
      orchestra_health_history: {
        Row: {
          error_message: string | null
          id: string
          latency_ms: number | null
          recorded_at: string
          service_id: string
          status: string
        }
        Insert: {
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          recorded_at?: string
          service_id: string
          status: string
        }
        Update: {
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          recorded_at?: string
          service_id?: string
          status?: string
        }
        Relationships: []
      }
      orchestra_template_history: {
        Row: {
          change_notes: string | null
          change_type: string
          changed_by: string | null
          created_at: string
          id: string
          snapshot: Json
          template_id: string
          version: string
        }
        Insert: {
          change_notes?: string | null
          change_type: string
          changed_by?: string | null
          created_at?: string
          id?: string
          snapshot: Json
          template_id: string
          version: string
        }
        Update: {
          change_notes?: string | null
          change_type?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          snapshot?: Json
          template_id?: string
          version?: string
        }
        Relationships: []
      }
      r2_files: {
        Row: {
          content_type: string | null
          created_at: string
          file_name: string | null
          file_url: string
          id: string
          object_key: string
          size_bytes: number | null
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_url: string
          id?: string
          object_key: string
          size_bytes?: number | null
          user_id?: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string
          id?: string
          object_key?: string
          size_bytes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      tenancy_audit_logs: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          organization_id: string | null
          resource_id: string
          resource_type: string
          team_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          organization_id?: string | null
          resource_id: string
          resource_type: string
          team_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          organization_id?: string | null
          resource_id?: string
          resource_type?: string
          team_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_audit_logs_organization_id_tenancy_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenancy_audit_logs_team_id_tenancy_teams_id_fk"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_invitation_rate_limits: {
        Row: {
          created_at: string
          id: string
          invitation_count: number
          organization_id: string
          updated_at: string
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id: string
          invitation_count?: number
          organization_id: string
          updated_at?: string
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          created_at?: string
          id?: string
          invitation_count?: number
          organization_id?: string
          updated_at?: string
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_invitation_rate_limits_organization_id_tenancy_organiza"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_invitation_templates: {
        Row: {
          body_html: string
          body_text: string
          created_at: string
          created_by: string
          id: string
          is_default: boolean
          name: string
          organization_id: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body_html: string
          body_text: string
          created_at?: string
          created_by: string
          id: string
          is_default?: boolean
          name: string
          organization_id: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body_html?: string
          body_text?: string
          created_at?: string
          created_by?: string
          id?: string
          is_default?: boolean
          name?: string
          organization_id?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_invitation_templates_organization_id_tenancy_organizati"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          batch_id: string | null
          created_at: string | null
          custom_message: string | null
          email: string
          expires_at: string
          id: string
          invitation_type: string
          invited_by: string
          ip_address: string | null
          message: string | null
          metadata: Json | null
          organization_id: string | null
          reminder_count: number
          reminder_sent_at: string | null
          requires_approval: boolean
          role: string
          source: string
          status: string
          team_id: string | null
          template_id: string | null
          token: string
          updated_at: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string | null
          custom_message?: string | null
          email: string
          expires_at: string
          id?: string
          invitation_type?: string
          invited_by: string
          ip_address?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          reminder_count?: number
          reminder_sent_at?: string | null
          requires_approval?: boolean
          role: string
          source?: string
          status?: string
          team_id?: string | null
          template_id?: string | null
          token: string
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          batch_id?: string | null
          created_at?: string | null
          custom_message?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_type?: string
          invited_by?: string
          ip_address?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string | null
          reminder_count?: number
          reminder_sent_at?: string | null
          requires_approval?: boolean
          role?: string
          source?: string
          status?: string
          team_id?: string | null
          template_id?: string | null
          token?: string
          updated_at?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_invitations_organization_id_tenancy_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenancy_invitations_team_id_tenancy_teams_id_fk"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_memberships: {
        Row: {
          created_at: string | null
          department: string | null
          id: string
          invited_by: string | null
          is_active: boolean
          job_title: string | null
          joined_at: string | null
          last_activity_at: string | null
          metadata: Json | null
          organization_id: string | null
          permissions: Json | null
          removal_reason: string | null
          removed_at: string | null
          removed_by: string | null
          role: string
          status: Database["public"]["Enums"]["tenancy_membership_status"]
          suspended_at: string | null
          suspended_by: string | null
          suspension_reason: string | null
          team_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          id: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          organization_id?: string | null
          permissions?: Json | null
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          role?: string
          status?: Database["public"]["Enums"]["tenancy_membership_status"]
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          organization_id?: string | null
          permissions?: Json | null
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          role?: string
          status?: Database["public"]["Enums"]["tenancy_membership_status"]
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          team_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_memberships_organization_id_tenancy_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenancy_memberships_team_id_tenancy_teams_id_fk"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_organizations: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          billing_email: string | null
          billing_metadata: Json | null
          compliance_settings: Json | null
          created_at: string | null
          created_by: string
          description: string | null
          feature_flags: Json | null
          id: string
          is_active: boolean
          locale: string | null
          logo: string | null
          name: string
          quotas: Json | null
          region: string | null
          security_settings: Json | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["tenancy_organization_status"]
          subscription_current_period_end: string | null
          subscription_current_period_start: string | null
          subscription_id: string | null
          subscription_status: string | null
          suspended_at: string | null
          suspended_by: string | null
          suspension_reason: string | null
          tier: Database["public"]["Enums"]["tenancy_organization_tier"]
          timezone: string | null
          trial_ends_at: string | null
          updated_at: string | null
          usage: Json | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          billing_email?: string | null
          billing_metadata?: Json | null
          compliance_settings?: Json | null
          created_at?: string | null
          created_by: string
          description?: string | null
          feature_flags?: Json | null
          id: string
          is_active?: boolean
          locale?: string | null
          logo?: string | null
          name: string
          quotas?: Json | null
          region?: string | null
          security_settings?: Json | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["tenancy_organization_status"]
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          tier?: Database["public"]["Enums"]["tenancy_organization_tier"]
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage?: Json | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          billing_email?: string | null
          billing_metadata?: Json | null
          compliance_settings?: Json | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          feature_flags?: Json | null
          id?: string
          is_active?: boolean
          locale?: string | null
          logo?: string | null
          name?: string
          quotas?: Json | null
          region?: string | null
          security_settings?: Json | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["tenancy_organization_status"]
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspension_reason?: string | null
          tier?: Database["public"]["Enums"]["tenancy_organization_tier"]
          timezone?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage?: Json | null
        }
        Relationships: []
      }
      tenancy_teams: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hierarchy_depth: number
          hierarchy_path: string[] | null
          id: string
          is_active: boolean
          last_activity_at: string | null
          max_child_depth: number
          member_count: number
          metadata: Json | null
          name: string
          organization_id: string | null
          parent_id: string | null
          permissions_model: Json | null
          resource_scopes: Json | null
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["tenancy_team_status"]
          team_settings: Json | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["tenancy_team_visibility"]
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_depth?: number
          hierarchy_path?: string[] | null
          id: string
          is_active?: boolean
          last_activity_at?: string | null
          max_child_depth?: number
          member_count?: number
          metadata?: Json | null
          name: string
          organization_id?: string | null
          parent_id?: string | null
          permissions_model?: Json | null
          resource_scopes?: Json | null
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["tenancy_team_status"]
          team_settings?: Json | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["tenancy_team_visibility"]
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_depth?: number
          hierarchy_path?: string[] | null
          id?: string
          is_active?: boolean
          last_activity_at?: string | null
          max_child_depth?: number
          member_count?: number
          metadata?: Json | null
          name?: string
          organization_id?: string | null
          parent_id?: string | null
          permissions_model?: Json | null
          resource_scopes?: Json | null
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["tenancy_team_status"]
          team_settings?: Json | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["tenancy_team_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "tenancy_teams_organization_id_tenancy_organizations_id_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "tenancy_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenancy_teams_parent_id_tenancy_teams_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tenancy_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      tenancy_tenant_design_system: {
        Row: {
          created_at: string | null
          settings: Json | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          settings?: Json | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          settings?: Json | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          image: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          image?: string | null
          name: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          image?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      pg_stat_statements: {
        Row: {
          calls: number | null
          dbid: unknown
          jit_deform_count: number | null
          jit_deform_time: number | null
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blk_read_time: number | null
          local_blk_write_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          min_exec_time: number | null
          min_plan_time: number | null
          minmax_stats_since: string | null
          plans: number | null
          query: string | null
          queryid: number | null
          rows: number | null
          shared_blk_read_time: number | null
          shared_blk_write_time: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          stats_since: string | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null
          stats_reset: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_id: { Args: never; Returns: string }
      dearmor: { Args: { "": string }; Returns: string }
      gen_random_uuid: { Args: never; Returns: string }
      gen_salt: { Args: { "": string }; Returns: string }
      is_authenticated: { Args: never; Returns: boolean }
      pg_stat_statements: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_statements_info: { Args: never; Returns: Record<string, unknown> }
      pg_stat_statements_reset: {
        Args: {
          dbid?: unknown
          minmax_only?: boolean
          queryid?: number
          userid?: unknown
        }
        Returns: string
      }
      pgp_armor_headers: {
        Args: { "": string }
        Returns: Record<string, unknown>[]
      }
      show_db_tree: {
        Args: never
        Returns: {
          tree_structure: string
        }[]
      }
    }
    Enums: {
      canontask_project_status: "active" | "frozen" | "archived"
      canontask_task_priority: "low" | "medium" | "high" | "urgent"
      magicdrive_doc_type:
        | "pdf"
        | "image"
        | "document"
        | "spreadsheet"
        | "presentation"
        | "archive"
        | "video"
        | "audio"
        | "other"
      magicdrive_dup_reason: "exact" | "near"
      magicdrive_status:
        | "inbox"
        | "processing"
        | "ready"
        | "archived"
        | "error"
        | "deleted"
      magicdrive_upload_status: "presigned" | "uploaded" | "ingested" | "failed"
      magictodo_focus_session_status:
        | "active"
        | "paused"
        | "completed"
        | "aborted"
      magictodo_recurrence_frequency:
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "yearly"
      magictodo_task_category:
        | "work"
        | "personal"
        | "meeting"
        | "research"
        | "admin"
        | "learning"
        | "health"
        | "finance"
        | "other"
      magictodo_task_priority: "low" | "medium" | "high" | "urgent"
      magictodo_task_status: "todo" | "in_progress" | "done" | "cancelled"
      tenancy_membership_status:
        | "active"
        | "suspended"
        | "pending_removal"
        | "removed"
      tenancy_organization_status:
        | "active"
        | "trial"
        | "suspended"
        | "payment_failed"
        | "archived"
      tenancy_organization_tier:
        | "free"
        | "starter"
        | "professional"
        | "enterprise"
        | "custom"
      tenancy_team_status: "active" | "archived" | "suspended"
      tenancy_team_visibility: "public" | "private" | "secret"
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
      canontask_project_status: ["active", "frozen", "archived"],
      canontask_task_priority: ["low", "medium", "high", "urgent"],
      magicdrive_doc_type: [
        "pdf",
        "image",
        "document",
        "spreadsheet",
        "presentation",
        "archive",
        "video",
        "audio",
        "other",
      ],
      magicdrive_dup_reason: ["exact", "near"],
      magicdrive_status: [
        "inbox",
        "processing",
        "ready",
        "archived",
        "error",
        "deleted",
      ],
      magicdrive_upload_status: ["presigned", "uploaded", "ingested", "failed"],
      magictodo_focus_session_status: [
        "active",
        "paused",
        "completed",
        "aborted",
      ],
      magictodo_recurrence_frequency: [
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "yearly",
      ],
      magictodo_task_category: [
        "work",
        "personal",
        "meeting",
        "research",
        "admin",
        "learning",
        "health",
        "finance",
        "other",
      ],
      magictodo_task_priority: ["low", "medium", "high", "urgent"],
      magictodo_task_status: ["todo", "in_progress", "done", "cancelled"],
      tenancy_membership_status: [
        "active",
        "suspended",
        "pending_removal",
        "removed",
      ],
      tenancy_organization_status: [
        "active",
        "trial",
        "suspended",
        "payment_failed",
        "archived",
      ],
      tenancy_organization_tier: [
        "free",
        "starter",
        "professional",
        "enterprise",
        "custom",
      ],
      tenancy_team_status: ["active", "archived", "suspended"],
      tenancy_team_visibility: ["public", "private", "secret"],
    },
  },
} as const

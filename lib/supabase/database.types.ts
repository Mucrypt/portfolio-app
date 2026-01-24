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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      about_highlights: {
        Row: {
          created_at: string | null
          description: string
          group_key: string
          icon: string | null
          id: string
          is_visible: boolean | null
          owner_user_id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          group_key: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          group_key?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      about_page: {
        Row: {
          cta_primary_href: string | null
          cta_primary_label: string | null
          cta_secondary_href: string | null
          cta_secondary_label: string | null
          hero_eyebrow: string | null
          hero_subtitle: string | null
          hero_title: string
          id: string
          intro: string | null
          is_published: boolean | null
          mission: string | null
          owner_user_id: string
          updated_at: string | null
        }
        Insert: {
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          hero_eyebrow?: string | null
          hero_subtitle?: string | null
          hero_title: string
          id?: string
          intro?: string | null
          is_published?: boolean | null
          mission?: string | null
          owner_user_id: string
          updated_at?: string | null
        }
        Update: {
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          hero_eyebrow?: string | null
          hero_subtitle?: string | null
          hero_title?: string
          id?: string
          intro?: string | null
          is_published?: boolean | null
          mission?: string | null
          owner_user_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      about_quotes: {
        Row: {
          caption: string | null
          created_at: string | null
          id: string
          is_visible: boolean | null
          owner_user_id: string
          quote: string
          sort_order: number
          theme: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id: string
          quote: string
          sort_order?: number
          theme?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id?: string
          quote?: string
          sort_order?: number
          theme?: string | null
        }
        Relationships: []
      }
      about_sections: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_visible: boolean | null
          kind: string | null
          owner_user_id: string
          sort_order: number
          subtitle: string | null
          title: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          kind?: string | null
          owner_user_id: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_visible?: boolean | null
          kind?: string | null
          owner_user_id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      about_timeline: {
        Row: {
          city: string | null
          country: string
          created_at: string | null
          description: string
          icon: string | null
          id: string
          is_visible: boolean | null
          owner_user_id: string
          period: string | null
          sort_order: number
          title: string
        }
        Insert: {
          city?: string | null
          country: string
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id: string
          period?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          city?: string | null
          country?: string
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          owner_user_id?: string
          period?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          post_count: number | null
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          post_count?: number | null
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          post_count?: number | null
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string | null
          author_name: string
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          likes_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          likes_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          id: string
          post_id: string
          referrer_url: string | null
          user_id: string | null
          viewed_at: string | null
          viewer_country: string | null
          viewer_device: string | null
          viewer_ip: string | null
        }
        Insert: {
          id?: string
          post_id: string
          referrer_url?: string | null
          user_id?: string | null
          viewed_at?: string | null
          viewer_country?: string | null
          viewer_device?: string | null
          viewer_ip?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          referrer_url?: string | null
          user_id?: string | null
          viewed_at?: string | null
          viewer_country?: string | null
          viewer_device?: string | null
          viewer_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean | null
          allow_likes: boolean | null
          author_avatar_url: string | null
          author_bio: string | null
          author_name: string | null
          author_user_id: string
          canonical_url: string | null
          category: string
          code_language: string | null
          comments_count: number | null
          content: string
          content_format: string | null
          created_at: string | null
          cta_text: string | null
          cta_url: string | null
          demo_url: string | null
          excerpt: string | null
          featured_image_url: string | null
          featured_video_url: string | null
          github_repo_url: string | null
          id: string
          image_urls: string[] | null
          is_featured: boolean | null
          is_pinned: boolean | null
          is_published: boolean | null
          last_updated: string | null
          likes_count: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          og_image_url: string | null
          publish_date: string | null
          reading_time_minutes: number | null
          related_post_ids: string[] | null
          series_name: string | null
          series_order: number | null
          shares_count: number | null
          slug: string
          subcategory: string | null
          table_of_contents: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          video_urls: string[] | null
          views_count: number | null
        }
        Insert: {
          allow_comments?: boolean | null
          allow_likes?: boolean | null
          author_avatar_url?: string | null
          author_bio?: string | null
          author_name?: string | null
          author_user_id: string
          canonical_url?: string | null
          category?: string
          code_language?: string | null
          comments_count?: number | null
          content: string
          content_format?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          demo_url?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          featured_video_url?: string | null
          github_repo_url?: string | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          last_updated?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_image_url?: string | null
          publish_date?: string | null
          reading_time_minutes?: number | null
          related_post_ids?: string[] | null
          series_name?: string | null
          series_order?: number | null
          shares_count?: number | null
          slug: string
          subcategory?: string | null
          table_of_contents?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          video_urls?: string[] | null
          views_count?: number | null
        }
        Update: {
          allow_comments?: boolean | null
          allow_likes?: boolean | null
          author_avatar_url?: string | null
          author_bio?: string | null
          author_name?: string | null
          author_user_id?: string
          canonical_url?: string | null
          category?: string
          code_language?: string | null
          comments_count?: number | null
          content?: string
          content_format?: string | null
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          demo_url?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          featured_video_url?: string | null
          github_repo_url?: string | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          is_pinned?: boolean | null
          is_published?: boolean | null
          last_updated?: string | null
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          og_image_url?: string | null
          publish_date?: string | null
          reading_time_minutes?: number | null
          related_post_ids?: string[] | null
          series_name?: string | null
          series_order?: number | null
          shares_count?: number | null
          slug?: string
          subcategory?: string | null
          table_of_contents?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          video_urls?: string[] | null
          views_count?: number | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          id: string
          issuer: string | null
          name: string
          owner_user_id: string
          url: string | null
          year: number | null
        }
        Insert: {
          id?: string
          issuer?: string | null
          name: string
          owner_user_id: string
          url?: string | null
          year?: number | null
        }
        Update: {
          id?: string
          issuer?: string | null
          name?: string
          owner_user_id?: string
          url?: string | null
          year?: number | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          ip_address: string | null
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          status: string | null
          subject: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          ip_address?: string | null
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          status?: string | null
          subject: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          ip_address?: string | null
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          status?: string | null
          subject?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          affiliate_link: string
          category: string
          created_at: string | null
          currency: string | null
          description: string
          discounted_price: number | null
          duration_hours: number | null
          id: string
          instructor_name: string
          is_featured: boolean | null
          is_published: boolean | null
          language: string | null
          level: string | null
          original_price: number | null
          owner_user_id: string
          platform: string
          rating: number | null
          requirements: string[] | null
          short_description: string | null
          slug: string
          sort_order: number | null
          students_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          what_you_learn: string[] | null
        }
        Insert: {
          affiliate_link: string
          category: string
          created_at?: string | null
          currency?: string | null
          description: string
          discounted_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_name: string
          is_featured?: boolean | null
          is_published?: boolean | null
          language?: string | null
          level?: string | null
          original_price?: number | null
          owner_user_id: string
          platform: string
          rating?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug: string
          sort_order?: number | null
          students_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          what_you_learn?: string[] | null
        }
        Update: {
          affiliate_link?: string
          category?: string
          created_at?: string | null
          currency?: string | null
          description?: string
          discounted_price?: number | null
          duration_hours?: number | null
          id?: string
          instructor_name?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          language?: string | null
          level?: string | null
          original_price?: number | null
          owner_user_id?: string
          platform?: string
          rating?: number | null
          requirements?: string[] | null
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          students_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          what_you_learn?: string[] | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          location: string | null
          notes: string | null
          owner_user_id: string
          program: string | null
          school: string
          sort_order: number
          start_date: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_user_id: string
          program?: string | null
          school: string
          sort_order?: number
          start_date?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          owner_user_id?: string
          program?: string | null
          school?: string
          sort_order?: number
          start_date?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string | null
          end_date: string | null
          highlights: string[] | null
          id: string
          is_current: boolean | null
          location: string | null
          owner_user_id: string
          sort_order: number
          start_date: string | null
          title: string
        }
        Insert: {
          company: string
          created_at?: string | null
          end_date?: string | null
          highlights?: string[] | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          owner_user_id: string
          sort_order?: number
          start_date?: string | null
          title: string
        }
        Update: {
          company?: string
          created_at?: string | null
          end_date?: string | null
          highlights?: string[] | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          owner_user_id?: string
          sort_order?: number
          start_date?: string | null
          title?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          id: string
          level: string | null
          name: string
          owner_user_id: string
          sort_order: number
        }
        Insert: {
          id?: string
          level?: string | null
          name: string
          owner_user_id: string
          sort_order?: number
        }
        Update: {
          id?: string
          level?: string | null
          name?: string
          owner_user_id?: string
          sort_order?: number
        }
        Relationships: []
      }
      portfolio_sections: {
        Row: {
          enabled: boolean | null
          id: string
          key: string
          owner_user_id: string
          sort_order: number
          title: string | null
        }
        Insert: {
          enabled?: boolean | null
          id?: string
          key: string
          owner_user_id: string
          sort_order?: number
          title?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: string
          key?: string
          owner_user_id?: string
          sort_order?: number
          title?: string | null
        }
        Relationships: []
      }
      profile_stats: {
        Row: {
          id: string
          label: string
          owner_user_id: string
          sort_order: number
          value: string
        }
        Insert: {
          id?: string
          label: string
          owner_user_id: string
          sort_order?: number
          value: string
        }
        Update: {
          id?: string
          label?: string
          owner_user_id?: string
          sort_order?: number
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cv_url: string | null
          email: string | null
          full_name: string
          headline: string | null
          id: string
          location: string | null
          owner_user_id: string
          phone: string | null
          portfolio_title: string | null
          public_slug: string | null
          role_tags: string[] | null
          socials: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cv_url?: string | null
          email?: string | null
          full_name: string
          headline?: string | null
          id?: string
          location?: string | null
          owner_user_id: string
          phone?: string | null
          portfolio_title?: string | null
          public_slug?: string | null
          role_tags?: string[] | null
          socials?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cv_url?: string | null
          email?: string | null
          full_name?: string
          headline?: string | null
          id?: string
          location?: string | null
          owner_user_id?: string
          phone?: string | null
          portfolio_title?: string | null
          public_slug?: string | null
          role_tags?: string[] | null
          socials?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_links: {
        Row: {
          id: string
          label: string
          project_id: string
          url: string
        }
        Insert: {
          id?: string
          label: string
          project_id: string
          url: string
        }
        Update: {
          id?: string
          label?: string
          project_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_media: {
        Row: {
          alt: string | null
          id: string
          kind: string | null
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt?: string | null
          id?: string
          kind?: string | null
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt?: string | null
          id?: string
          kind?: string | null
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          owner_user_id: string
          project_type: string | null
          sort_order: number
          status: string | null
          summary: string | null
          tech_stack: string[] | null
          title: string
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          owner_user_id: string
          project_type?: string | null
          sort_order?: number
          status?: string | null
          summary?: string | null
          tech_stack?: string[] | null
          title: string
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          owner_user_id?: string
          project_type?: string | null
          sort_order?: number
          status?: string | null
          summary?: string | null
          tech_stack?: string[] | null
          title?: string
          year?: number | null
        }
        Relationships: []
      }
      public_users: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
          user_role: string
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_role?: string
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          user_role?: string
        }
        Relationships: []
      }
      sections: {
        Row: {
          enabled: boolean | null
          id: string
          key: string
          owner_user_id: string
          sort_order: number
          subtitle: string | null
          title: string | null
        }
        Insert: {
          enabled?: boolean | null
          id?: string
          key: string
          owner_user_id: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
        }
        Update: {
          enabled?: boolean | null
          id?: string
          key?: string
          owner_user_id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string | null
        }
        Relationships: []
      }
      service_inquiries: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          company: string | null
          consultation_scheduled_at: string | null
          created_at: string | null
          email: string
          follow_up_date: string | null
          id: string
          message: string
          name: string
          notes: string | null
          phone: string | null
          preferred_start_date: string | null
          priority: string | null
          project_description: string | null
          referrer_url: string | null
          responded_at: string | null
          service_id: string
          source: string | null
          specific_requirements: string[] | null
          status: string | null
          subject: string | null
          timeline: string | null
          updated_at: string | null
          urgency: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          website: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          consultation_scheduled_at?: string | null
          created_at?: string | null
          email: string
          follow_up_date?: string | null
          id?: string
          message: string
          name: string
          notes?: string | null
          phone?: string | null
          preferred_start_date?: string | null
          priority?: string | null
          project_description?: string | null
          referrer_url?: string | null
          responded_at?: string | null
          service_id: string
          source?: string | null
          specific_requirements?: string[] | null
          status?: string | null
          subject?: string | null
          timeline?: string | null
          updated_at?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          company?: string | null
          consultation_scheduled_at?: string | null
          created_at?: string | null
          email?: string
          follow_up_date?: string | null
          id?: string
          message?: string
          name?: string
          notes?: string | null
          phone?: string | null
          preferred_start_date?: string | null
          priority?: string | null
          project_description?: string | null
          referrer_url?: string | null
          responded_at?: string | null
          service_id?: string
          source?: string | null
          specific_requirements?: string[] | null
          status?: string | null
          subject?: string | null
          timeline?: string | null
          updated_at?: string | null
          urgency?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_inquiries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          admin_response: string | null
          attachments: Json | null
          budget_range: string | null
          created_at: string | null
          description: string
          id: string
          project_title: string
          service_type: string
          status: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          attachments?: Json | null
          budget_range?: string | null
          created_at?: string | null
          description: string
          id?: string
          project_title: string
          service_type: string
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_response?: string | null
          attachments?: Json | null
          budget_range?: string | null
          created_at?: string | null
          description?: string
          id?: string
          project_title?: string
          service_type?: string
          status?: string | null
          timeline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_reviews: {
        Row: {
          admin_response: string | null
          communication_rating: number | null
          completion_date: string | null
          cons: string[] | null
          created_at: string | null
          display_on_homepage: boolean | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          project_budget_range: string | null
          project_duration: string | null
          project_type: string | null
          pros: string[] | null
          quality_rating: number | null
          rating: number
          responded_at: string | null
          review_text: string
          reviewer_avatar_url: string | null
          reviewer_company: string | null
          reviewer_linkedin_url: string | null
          reviewer_name: string
          reviewer_position: string | null
          service_id: string
          timeline_rating: number | null
          title: string | null
          updated_at: string | null
          value_rating: number | null
          verification_method: string | null
          would_hire_again: boolean | null
          would_recommend: boolean | null
        }
        Insert: {
          admin_response?: string | null
          communication_rating?: number | null
          completion_date?: string | null
          cons?: string[] | null
          created_at?: string | null
          display_on_homepage?: boolean | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          project_budget_range?: string | null
          project_duration?: string | null
          project_type?: string | null
          pros?: string[] | null
          quality_rating?: number | null
          rating: number
          responded_at?: string | null
          review_text: string
          reviewer_avatar_url?: string | null
          reviewer_company?: string | null
          reviewer_linkedin_url?: string | null
          reviewer_name: string
          reviewer_position?: string | null
          service_id: string
          timeline_rating?: number | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          verification_method?: string | null
          would_hire_again?: boolean | null
          would_recommend?: boolean | null
        }
        Update: {
          admin_response?: string | null
          communication_rating?: number | null
          completion_date?: string | null
          cons?: string[] | null
          created_at?: string | null
          display_on_homepage?: boolean | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          project_budget_range?: string | null
          project_duration?: string | null
          project_type?: string | null
          pros?: string[] | null
          quality_rating?: number | null
          rating?: number
          responded_at?: string | null
          review_text?: string
          reviewer_avatar_url?: string | null
          reviewer_company?: string | null
          reviewer_linkedin_url?: string | null
          reviewer_name?: string
          reviewer_position?: string | null
          service_id?: string
          timeline_rating?: number | null
          title?: string | null
          updated_at?: string | null
          value_rating?: number | null
          verification_method?: string | null
          would_hire_again?: boolean | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability_status: string | null
          avg_rating: number | null
          base_price: number | null
          booking_url: string | null
          bookings_count: number | null
          calendar_url: string | null
          cancellation_policy: string | null
          case_study_urls: string[] | null
          category: string
          client_testimonials: Json | null
          color: string | null
          common_questions: string[] | null
          communication_channels: string[] | null
          completion_rate: number | null
          consultation_duration: number | null
          consultation_required: boolean | null
          contract_template_url: string | null
          created_at: string | null
          cta_primary_text: string | null
          cta_primary_url: string | null
          cta_secondary_text: string | null
          cta_secondary_url: string | null
          current_clients: number | null
          deliverables: string[] | null
          demo_url: string | null
          description: string
          display_order: number | null
          documentation_url: string | null
          duration_unit: string | null
          estimated_duration: string | null
          excluded_services: string[] | null
          faqs: Json | null
          featured_image_url: string | null
          full_description: string | null
          gallery_images: string[] | null
          github_repo_url: string | null
          icon: string | null
          id: string
          included_services: string[] | null
          inquiries_count: number | null
          is_accepting_clients: boolean | null
          is_active: boolean | null
          is_available: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          is_popular: boolean | null
          is_price_negotiable: boolean | null
          key_features: string[]
          languages: string[] | null
          lead_time_days: number | null
          max_concurrent_clients: number | null
          max_duration: number | null
          meeting_frequency: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          methodologies: string[] | null
          min_duration: number | null
          name: string
          og_image_url: string | null
          onboarding_process: string | null
          payment_methods: string[] | null
          payment_terms: string | null
          portfolio_project_ids: string[] | null
          price_currency: string | null
          price_unit: string | null
          pricing_tiers: Json | null
          process_steps: Json | null
          refund_policy: string | null
          requirements: string[] | null
          revision_count: number | null
          sample_work_urls: string[] | null
          service_type: string | null
          slug: string
          subcategories: string[] | null
          success_metrics: Json | null
          success_stories: string[] | null
          support_duration: string | null
          support_email: string | null
          support_hours: string | null
          tagline: string | null
          technologies: string[] | null
          terms_conditions: string | null
          timeline_breakdown: Json | null
          tools: string[] | null
          total_reviews: number | null
          typical_results: string[] | null
          updated_at: string | null
          views_count: number | null
          waitlist_available: boolean | null
        }
        Insert: {
          availability_status?: string | null
          avg_rating?: number | null
          base_price?: number | null
          booking_url?: string | null
          bookings_count?: number | null
          calendar_url?: string | null
          cancellation_policy?: string | null
          case_study_urls?: string[] | null
          category: string
          client_testimonials?: Json | null
          color?: string | null
          common_questions?: string[] | null
          communication_channels?: string[] | null
          completion_rate?: number | null
          consultation_duration?: number | null
          consultation_required?: boolean | null
          contract_template_url?: string | null
          created_at?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          current_clients?: number | null
          deliverables?: string[] | null
          demo_url?: string | null
          description: string
          display_order?: number | null
          documentation_url?: string | null
          duration_unit?: string | null
          estimated_duration?: string | null
          excluded_services?: string[] | null
          faqs?: Json | null
          featured_image_url?: string | null
          full_description?: string | null
          gallery_images?: string[] | null
          github_repo_url?: string | null
          icon?: string | null
          id?: string
          included_services?: string[] | null
          inquiries_count?: number | null
          is_accepting_clients?: boolean | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_popular?: boolean | null
          is_price_negotiable?: boolean | null
          key_features: string[]
          languages?: string[] | null
          lead_time_days?: number | null
          max_concurrent_clients?: number | null
          max_duration?: number | null
          meeting_frequency?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          methodologies?: string[] | null
          min_duration?: number | null
          name: string
          og_image_url?: string | null
          onboarding_process?: string | null
          payment_methods?: string[] | null
          payment_terms?: string | null
          portfolio_project_ids?: string[] | null
          price_currency?: string | null
          price_unit?: string | null
          pricing_tiers?: Json | null
          process_steps?: Json | null
          refund_policy?: string | null
          requirements?: string[] | null
          revision_count?: number | null
          sample_work_urls?: string[] | null
          service_type?: string | null
          slug: string
          subcategories?: string[] | null
          success_metrics?: Json | null
          success_stories?: string[] | null
          support_duration?: string | null
          support_email?: string | null
          support_hours?: string | null
          tagline?: string | null
          technologies?: string[] | null
          terms_conditions?: string | null
          timeline_breakdown?: Json | null
          tools?: string[] | null
          total_reviews?: number | null
          typical_results?: string[] | null
          updated_at?: string | null
          views_count?: number | null
          waitlist_available?: boolean | null
        }
        Update: {
          availability_status?: string | null
          avg_rating?: number | null
          base_price?: number | null
          booking_url?: string | null
          bookings_count?: number | null
          calendar_url?: string | null
          cancellation_policy?: string | null
          case_study_urls?: string[] | null
          category?: string
          client_testimonials?: Json | null
          color?: string | null
          common_questions?: string[] | null
          communication_channels?: string[] | null
          completion_rate?: number | null
          consultation_duration?: number | null
          consultation_required?: boolean | null
          contract_template_url?: string | null
          created_at?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          current_clients?: number | null
          deliverables?: string[] | null
          demo_url?: string | null
          description?: string
          display_order?: number | null
          documentation_url?: string | null
          duration_unit?: string | null
          estimated_duration?: string | null
          excluded_services?: string[] | null
          faqs?: Json | null
          featured_image_url?: string | null
          full_description?: string | null
          gallery_images?: string[] | null
          github_repo_url?: string | null
          icon?: string | null
          id?: string
          included_services?: string[] | null
          inquiries_count?: number | null
          is_accepting_clients?: boolean | null
          is_active?: boolean | null
          is_available?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_popular?: boolean | null
          is_price_negotiable?: boolean | null
          key_features?: string[]
          languages?: string[] | null
          lead_time_days?: number | null
          max_concurrent_clients?: number | null
          max_duration?: number | null
          meeting_frequency?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          methodologies?: string[] | null
          min_duration?: number | null
          name?: string
          og_image_url?: string | null
          onboarding_process?: string | null
          payment_methods?: string[] | null
          payment_terms?: string | null
          portfolio_project_ids?: string[] | null
          price_currency?: string | null
          price_unit?: string | null
          pricing_tiers?: Json | null
          process_steps?: Json | null
          refund_policy?: string | null
          requirements?: string[] | null
          revision_count?: number | null
          sample_work_urls?: string[] | null
          service_type?: string | null
          slug?: string
          subcategories?: string[] | null
          success_metrics?: Json | null
          success_stories?: string[] | null
          support_duration?: string | null
          support_email?: string | null
          support_hours?: string | null
          tagline?: string | null
          technologies?: string[] | null
          terms_conditions?: string | null
          timeline_breakdown?: Json | null
          tools?: string[] | null
          total_reviews?: number | null
          typical_results?: string[] | null
          updated_at?: string | null
          views_count?: number | null
          waitlist_available?: boolean | null
        }
        Relationships: []
      }
      shop_products: {
        Row: {
          affiliate_link: string | null
          category: string
          compatibility: string[] | null
          created_at: string | null
          currency: string | null
          demo_url: string | null
          description: string
          discount_percentage: number | null
          discounted_price: number | null
          documentation_url: string | null
          download_url: string | null
          external_product_url: string | null
          features: string[] | null
          file_format: string | null
          file_size: string | null
          id: string
          image_urls: string[] | null
          included_items: string[] | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          is_in_stock: boolean | null
          is_new: boolean | null
          is_published: boolean | null
          license_type: string | null
          meta_description: string | null
          meta_title: string | null
          original_price: number
          owner_user_id: string
          product_type: string
          published_at: string | null
          purchases_count: number | null
          rating: number | null
          requirements: string[] | null
          reviews_count: number | null
          shipping_required: boolean | null
          short_description: string | null
          sku: string | null
          slug: string
          sort_order: number | null
          specifications: Json | null
          stock_quantity: number | null
          subcategory: string | null
          support_url: string | null
          tags: string[] | null
          tech_stack: string[] | null
          thumbnail_url: string
          title: string
          updated_at: string | null
          usage_rights: string | null
          version: string | null
          views_count: number | null
          weight_kg: number | null
        }
        Insert: {
          affiliate_link?: string | null
          category: string
          compatibility?: string[] | null
          created_at?: string | null
          currency?: string | null
          demo_url?: string | null
          description: string
          discount_percentage?: number | null
          discounted_price?: number | null
          documentation_url?: string | null
          download_url?: string | null
          external_product_url?: string | null
          features?: string[] | null
          file_format?: string | null
          file_size?: string | null
          id?: string
          image_urls?: string[] | null
          included_items?: string[] | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_in_stock?: boolean | null
          is_new?: boolean | null
          is_published?: boolean | null
          license_type?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price: number
          owner_user_id: string
          product_type: string
          published_at?: string | null
          purchases_count?: number | null
          rating?: number | null
          requirements?: string[] | null
          reviews_count?: number | null
          shipping_required?: boolean | null
          short_description?: string | null
          sku?: string | null
          slug: string
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          subcategory?: string | null
          support_url?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          thumbnail_url: string
          title: string
          updated_at?: string | null
          usage_rights?: string | null
          version?: string | null
          views_count?: number | null
          weight_kg?: number | null
        }
        Update: {
          affiliate_link?: string | null
          category?: string
          compatibility?: string[] | null
          created_at?: string | null
          currency?: string | null
          demo_url?: string | null
          description?: string
          discount_percentage?: number | null
          discounted_price?: number | null
          documentation_url?: string | null
          download_url?: string | null
          external_product_url?: string | null
          features?: string[] | null
          file_format?: string | null
          file_size?: string | null
          id?: string
          image_urls?: string[] | null
          included_items?: string[] | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_in_stock?: boolean | null
          is_new?: boolean | null
          is_published?: boolean | null
          license_type?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number
          owner_user_id?: string
          product_type?: string
          published_at?: string | null
          purchases_count?: number | null
          rating?: number | null
          requirements?: string[] | null
          reviews_count?: number | null
          shipping_required?: boolean | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          subcategory?: string | null
          support_url?: string | null
          tags?: string[] | null
          tech_stack?: string[] | null
          thumbnail_url?: string
          title?: string
          updated_at?: string | null
          usage_rights?: string | null
          version?: string | null
          views_count?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          id: string
          level: number
          name: string
          owner_user_id: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          level?: number
          name: string
          owner_user_id: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          level?: number
          name?: string
          owner_user_id?: string
          sort_order?: number
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          ip_address: string | null
          page_url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_type: string
          city: string
          country: string
          created_at: string | null
          id: string
          is_default: boolean | null
          postal_code: string
          state: string | null
          street_address: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_type: string
          city: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code: string
          state?: string | null
          street_address: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_type?: string
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          postal_code?: string
          state?: string | null
          street_address?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_pending_service_requests: {
        Row: {
          admin_response: string | null
          attachments: Json | null
          budget_range: string | null
          created_at: string | null
          description: string | null
          email: string | null
          full_name: string | null
          id: string | null
          phone: string | null
          project_title: string | null
          service_type: string | null
          status: string | null
          timeline: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_recent_inquiries: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          email: string | null
          id: string | null
          inquiry_type: string | null
          ip_address: string | null
          message: string | null
          name: string | null
          phone: string | null
          responded_at: string | null
          status: string | null
          subject: string | null
          user_agent: string | null
          user_email: string | null
          user_full_name: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_inquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_user_stats: {
        Row: {
          active_users: number | null
          active_users_7d: number | null
          new_users_30d: number | null
          total_users: number | null
          verified_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_user: {
        Args: never
        Returns: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
          user_role: string
        }[]
        SetofOptions: {
          from: "*"
          to: "public_users"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_user_type: { Args: never; Returns: string }
      is_admin: { Args: { user_id: string }; Returns: boolean }
      is_portfolio_admin: { Args: never; Returns: boolean }
      is_public_user: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

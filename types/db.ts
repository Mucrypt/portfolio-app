export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          owner_user_id: string
          full_name: string
          headline: string | null
          location: string | null
          email: string | null
          phone: string | null
          bio: string | null
          role_tags: string[]
          avatar_url: string | null
          cv_url: string | null
          socials: Record<string, any>
          updated_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          full_name: string
          headline?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          bio?: string | null
          role_tags?: string[]
          avatar_url?: string | null
          cv_url?: string | null
          socials?: Record<string, any>
          updated_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          full_name?: string
          headline?: string | null
          location?: string | null
          email?: string | null
          phone?: string | null
          bio?: string | null
          role_tags?: string[]
          avatar_url?: string | null
          cv_url?: string | null
          socials?: Record<string, any>
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          owner_user_id: string
          category: string
          name: string
          level: number
          sort_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          owner_user_id: string
          category: string
          name: string
          level?: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          category?: string
          name?: string
          level?: number
          sort_order?: number
          created_at?: string
        }
      }
      experiences: {
        Row: {
          id: string
          owner_user_id: string
          company: string
          title: string
          location: string | null
          start_date: string | null
          end_date: string | null
          is_current: boolean
          highlights: string[]
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          company: string
          title: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          highlights?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          company?: string
          title?: string
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          is_current?: boolean
          highlights?: string[]
          created_at?: string
        }
      }
      education: {
        Row: {
          id: string
          owner_user_id: string
          school: string
          program: string | null
          location: string | null
          start_date: string | null
          end_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          school: string
          program?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          school?: string
          program?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          owner_user_id: string
          title: string
          summary: string | null
          description: string | null
          tech_stack: string[] | null
          featured: boolean | null
          sort_order: number
          created_at: string | null
        }
        Insert: {
          id?: string
          owner_user_id: string
          title: string
          summary?: string | null
          description?: string | null
          tech_stack?: string[]
          featured?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          title?: string
          summary?: string | null
          description?: string | null
          tech_stack?: string[]
          featured?: boolean
          sort_order?: number
          created_at?: string
        }
      }
      project_links: {
        Row: {
          id: string
          project_id: string
          label: string
          url: string
        }
        Insert: {
          id?: string
          project_id: string
          label: string
          url: string
        }
        Update: {
          id?: string
          project_id?: string
          label?: string
          url?: string
        }
      }
      project_media: {
        Row: {
          id: string
          project_id: string
          url: string
          alt: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          project_id: string
          url: string
          alt?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          project_id?: string
          url?: string
          alt?: string | null
          sort_order?: number
        }
      }
      languages: {
        Row: {
          id: string
          owner_user_id: string
          name: string
          level: string | null
          sort_order: number
        }
        Insert: {
          id?: string
          owner_user_id: string
          name: string
          level?: string | null
          sort_order?: number
        }
        Update: {
          id?: string
          owner_user_id?: string
          name?: string
          level?: string | null
          sort_order?: number
        }
      }
      certificates: {
        Row: {
          id: string
          owner_user_id: string
          name: string
          issuer: string | null
          year: number | null
          url: string | null
        }
        Insert: {
          id?: string
          owner_user_id: string
          name: string
          issuer?: string | null
          year?: number | null
          url?: string | null
        }
        Update: {
          id?: string
          owner_user_id?: string
          name?: string
          issuer?: string | null
          year?: number | null
          url?: string | null
        }
      }
    }
  }
}

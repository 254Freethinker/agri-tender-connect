export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aggregators: {
        Row: {
          aggregator_name: string
          business_type: string
          certifications: string[] | null
          collection_points: string[] | null
          commission_rate_percent: number | null
          commodities_handled: string[]
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          farmers_network_size: number | null
          has_cold_storage: boolean | null
          has_drying_facilities: boolean | null
          has_packaging_facilities: boolean | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_quantity_tons: number | null
          payment_terms: string[] | null
          physical_address: string
          pricing_model: string | null
          rating: number | null
          registration_number: string | null
          service_radius_km: number | null
          storage_capacity_tons: number | null
          sub_county: string | null
          total_transactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aggregator_name: string
          business_type?: string
          certifications?: string[] | null
          collection_points?: string[] | null
          commission_rate_percent?: number | null
          commodities_handled: string[]
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          farmers_network_size?: number | null
          has_cold_storage?: boolean | null
          has_drying_facilities?: boolean | null
          has_packaging_facilities?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address: string
          pricing_model?: string | null
          rating?: number | null
          registration_number?: string | null
          service_radius_km?: number | null
          storage_capacity_tons?: number | null
          sub_county?: string | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aggregator_name?: string
          business_type?: string
          certifications?: string[] | null
          collection_points?: string[] | null
          commission_rate_percent?: number | null
          commodities_handled?: string[]
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          farmers_network_size?: number | null
          has_cold_storage?: boolean | null
          has_drying_facilities?: boolean | null
          has_packaging_facilities?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          pricing_model?: string | null
          rating?: number | null
          registration_number?: string | null
          service_radius_km?: number | null
          storage_capacity_tons?: number | null
          sub_county?: string | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_hash: string
          key_preview: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash: string
          key_preview: string
          last_used_at?: string | null
          name?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_hash?: string
          key_preview?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown | null
          method: string
          request_size_bytes: number | null
          response_size_bytes: number | null
          response_time_ms: number | null
          status_code: number
          user_agent: string | null
          user_id: string
        }
        Insert: {
          api_key_id: string
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code: number
          user_agent?: string | null
          user_id: string
        }
        Update: {
          api_key_id?: string
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          method?: string
          request_size_bytes?: number | null
          response_size_bytes?: number | null
          response_time_ms?: number | null
          status_code?: number
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      barter_listings: {
        Row: {
          commodity: string
          county: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status: string
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commodity: string
          county: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location: string
          quantity: number
          seeking_commodities: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commodity?: string
          county?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          location?: string
          quantity?: number
          seeking_commodities?: string[]
          status?: string
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_advertisements: {
        Row: {
          ad_content: string
          amount_paid: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count: number | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string
          payment_id: string | null
          payment_status: string | null
          target_audience: string[] | null
          updated_at: string
          user_id: string | null
          views_count: number | null
          website_url: string | null
        }
        Insert: {
          ad_content: string
          amount_paid?: number | null
          business_category: string
          business_description: string
          business_name: string
          clicks_count?: number | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Update: {
          ad_content?: string
          amount_paid?: number | null
          business_category?: string
          business_description?: string
          business_name?: string
          clicks_count?: number | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string
          payment_id?: string | null
          payment_status?: string | null
          target_audience?: string[] | null
          updated_at?: string
          user_id?: string | null
          views_count?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      city_markets: {
        Row: {
          average_daily_buyers: number | null
          average_daily_traders: number | null
          city: string
          commodities_traded: string[]
          contact_email: string | null
          contact_phone: string | null
          coordinates: Json
          county: string
          created_at: string
          established_year: number | null
          facilities: string[] | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          market_authority: string | null
          market_fee_structure: Json | null
          market_name: string
          market_type: string
          operating_days: string[]
          operating_hours: string
          physical_address: string
          social_media: Json | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          average_daily_buyers?: number | null
          average_daily_traders?: number | null
          city: string
          commodities_traded: string[]
          contact_email?: string | null
          contact_phone?: string | null
          coordinates: Json
          county: string
          created_at?: string
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          market_authority?: string | null
          market_fee_structure?: Json | null
          market_name: string
          market_type: string
          operating_days: string[]
          operating_hours: string
          physical_address: string
          social_media?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          average_daily_buyers?: number | null
          average_daily_traders?: number | null
          city?: string
          commodities_traded?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          coordinates?: Json
          county?: string
          created_at?: string
          established_year?: number | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          market_authority?: string | null
          market_fee_structure?: Json | null
          market_name?: string
          market_type?: string
          operating_days?: string[]
          operating_hours?: string
          physical_address?: string
          social_media?: Json | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      collaboration_messages: {
        Row: {
          attachment_urls: string[] | null
          collaboration_id: string
          created_at: string
          id: string
          is_read: boolean | null
          message_content: string
          message_type: string | null
          sender_id: string
          sender_type: string
        }
        Insert: {
          attachment_urls?: string[] | null
          collaboration_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_content: string
          message_type?: string | null
          sender_id: string
          sender_type: string
        }
        Update: {
          attachment_urls?: string[] | null
          collaboration_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_content?: string
          message_type?: string | null
          sender_id?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_messages_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_proposals: {
        Row: {
          collaboration_id: string
          created_at: string
          delivery_terms: string | null
          documentation_fee: number | null
          export_timeline: string | null
          exporter_id: string
          exporter_notes: string | null
          farmer_response: string | null
          id: string
          logistics_fee: number | null
          market_destination: string[] | null
          payment_terms: string | null
          proposal_status: string | null
          proposal_type: string
          proposed_price_per_unit: number | null
          proposed_total_value: number | null
          quality_requirements: string[] | null
          service_fees: number | null
          services_included: string[] | null
          terms_and_conditions: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          collaboration_id: string
          created_at?: string
          delivery_terms?: string | null
          documentation_fee?: number | null
          export_timeline?: string | null
          exporter_id: string
          exporter_notes?: string | null
          farmer_response?: string | null
          id?: string
          logistics_fee?: number | null
          market_destination?: string[] | null
          payment_terms?: string | null
          proposal_status?: string | null
          proposal_type: string
          proposed_price_per_unit?: number | null
          proposed_total_value?: number | null
          quality_requirements?: string[] | null
          service_fees?: number | null
          services_included?: string[] | null
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          collaboration_id?: string
          created_at?: string
          delivery_terms?: string | null
          documentation_fee?: number | null
          export_timeline?: string | null
          exporter_id?: string
          exporter_notes?: string | null
          farmer_response?: string | null
          id?: string
          logistics_fee?: number | null
          market_destination?: string[] | null
          payment_terms?: string | null
          proposal_status?: string | null
          proposal_type?: string
          proposed_price_per_unit?: number | null
          proposed_total_value?: number | null
          quality_requirements?: string[] | null
          service_fees?: number | null
          services_included?: string[] | null
          terms_and_conditions?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaboration_proposals_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      community_polls: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean | null
          options: Json
          post_id: string | null
          question: string
          total_votes: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options: Json
          post_id?: string | null
          question: string
          total_votes?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          options?: Json
          post_id?: string | null
          question?: string
          total_votes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          location: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          location?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      crop_tracking: {
        Row: {
          actual_harvest_date: string | null
          actual_yield: number | null
          created_at: string
          crop_name: string
          estimated_yield: number | null
          expected_harvest_date: string | null
          fertilizer_applied: Json | null
          growth_stage: string | null
          id: string
          irrigation_schedule: Json | null
          notes: string | null
          parcel_id: string | null
          pesticides_applied: Json | null
          planted_area: number
          planting_date: string
          quality_grade: string | null
          seeds_used: number | null
          updated_at: string
          user_id: string
          variety: string | null
        }
        Insert: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area: number
          planting_date: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id: string
          variety?: string | null
        }
        Update: {
          actual_harvest_date?: string | null
          actual_yield?: number | null
          created_at?: string
          crop_name?: string
          estimated_yield?: number | null
          expected_harvest_date?: string | null
          fertilizer_applied?: Json | null
          growth_stage?: string | null
          id?: string
          irrigation_schedule?: Json | null
          notes?: string | null
          parcel_id?: string | null
          pesticides_applied?: Json | null
          planted_area?: number
          planting_date?: string
          quality_grade?: string | null
          seeds_used?: number | null
          updated_at?: string
          user_id?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_tracking_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "farm_parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      data_fetch_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          records_count: number | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source: string
          status: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          records_count?: number | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      exporter_profiles: {
        Row: {
          business_license_number: string | null
          certifications: string[] | null
          commodities_handled: string[]
          company_description: string | null
          company_name: string
          company_registration_number: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at: string
          documentation_services: boolean | null
          export_license_number: string | null
          export_markets: string[]
          financing_services: boolean | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logistics_services: boolean | null
          maximum_quantity_tons: number | null
          minimum_quantity_tons: number | null
          office_coordinates: Json | null
          office_county: string
          office_location: string
          quality_assurance_services: boolean | null
          rating: number | null
          services_offered: string[]
          successful_exports: number | null
          total_collaborations: number | null
          updated_at: string
          user_id: string
          verification_documents: string[] | null
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled: string[]
          company_description?: string | null
          company_name: string
          company_registration_number?: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string
          created_at?: string
          documentation_services?: boolean | null
          export_license_number?: string | null
          export_markets: string[]
          financing_services?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logistics_services?: boolean | null
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county: string
          office_location: string
          quality_assurance_services?: boolean | null
          rating?: number | null
          services_offered: string[]
          successful_exports?: number | null
          total_collaborations?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          business_license_number?: string | null
          certifications?: string[] | null
          commodities_handled?: string[]
          company_description?: string | null
          company_name?: string
          company_registration_number?: string | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string
          created_at?: string
          documentation_services?: boolean | null
          export_license_number?: string | null
          export_markets?: string[]
          financing_services?: boolean | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logistics_services?: boolean | null
          maximum_quantity_tons?: number | null
          minimum_quantity_tons?: number | null
          office_coordinates?: Json | null
          office_county?: string
          office_location?: string
          quality_assurance_services?: boolean | null
          rating?: number | null
          services_offered?: string[]
          successful_exports?: number | null
          total_collaborations?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: string[] | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Relationships: []
      }
      exporter_reviews: {
        Row: {
          collaboration_id: string | null
          communication_rating: number | null
          created_at: string
          documentation_quality_rating: number | null
          export_successful: boolean | null
          exporter_id: string
          farmer_id: string
          id: string
          rating: number
          review_text: string | null
          review_title: string | null
          services_used: string[] | null
          timeline_adherence_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          collaboration_id?: string | null
          communication_rating?: number | null
          created_at?: string
          documentation_quality_rating?: number | null
          export_successful?: boolean | null
          exporter_id: string
          farmer_id: string
          id?: string
          rating: number
          review_text?: string | null
          review_title?: string | null
          services_used?: string[] | null
          timeline_adherence_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          collaboration_id?: string | null
          communication_rating?: number | null
          created_at?: string
          documentation_quality_rating?: number | null
          export_successful?: boolean | null
          exporter_id?: string
          farmer_id?: string
          id?: string
          rating?: number
          review_text?: string | null
          review_title?: string | null
          services_used?: string[] | null
          timeline_adherence_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "exporter_reviews_collaboration_id_fkey"
            columns: ["collaboration_id"]
            isOneToOne: false
            referencedRelation: "farmer_exporter_collaborations"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "farm_input_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farm_input_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "farm_input_products"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_orders: {
        Row: {
          actual_delivery_date: string | null
          buyer_email: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at: string
          delivery_address: string | null
          delivery_coordinates: Json | null
          delivery_county: string | null
          delivery_method: string
          id: string
          order_notes: string | null
          order_number: string
          order_status: string
          payment_method: string | null
          payment_status: string
          requested_delivery_date: string | null
          special_instructions: string | null
          supplier_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          buyer_email?: string | null
          buyer_id: string
          buyer_name: string
          buyer_phone: string
          created_at?: string
          delivery_address?: string | null
          delivery_coordinates?: Json | null
          delivery_county?: string | null
          delivery_method: string
          id?: string
          order_notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          requested_delivery_date?: string | null
          special_instructions?: string | null
          supplier_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          buyer_email?: string | null
          buyer_id?: string
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          delivery_address?: string | null
          delivery_coordinates?: Json | null
          delivery_county?: string | null
          delivery_method?: string
          id?: string
          order_notes?: string | null
          order_number?: string
          order_status?: string
          payment_method?: string | null
          payment_status?: string
          requested_delivery_date?: string | null
          special_instructions?: string | null
          supplier_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_products: {
        Row: {
          batch_number: string | null
          brand_name: string | null
          country_of_origin: string | null
          created_at: string
          expiry_date: string | null
          id: string
          image_urls: string[] | null
          is_active: boolean | null
          is_available: boolean | null
          manufacturer: string | null
          minimum_order_quantity: number | null
          organic_certified: boolean | null
          price_per_unit: number
          product_category: string
          product_description: string | null
          product_name: string
          product_subcategory: string | null
          restock_level: number | null
          specifications: Json | null
          stock_quantity: number | null
          supplier_id: string
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          batch_number?: string | null
          brand_name?: string | null
          country_of_origin?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          manufacturer?: string | null
          minimum_order_quantity?: number | null
          organic_certified?: boolean | null
          price_per_unit: number
          product_category: string
          product_description?: string | null
          product_name: string
          product_subcategory?: string | null
          restock_level?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id: string
          unit_of_measure: string
          updated_at?: string
        }
        Update: {
          batch_number?: string | null
          brand_name?: string | null
          country_of_origin?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_active?: boolean | null
          is_available?: boolean | null
          manufacturer?: string | null
          minimum_order_quantity?: number | null
          organic_certified?: boolean | null
          price_per_unit?: number
          product_category?: string
          product_description?: string | null
          product_name?: string
          product_subcategory?: string | null
          restock_level?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id?: string
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_input_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "farm_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_suppliers: {
        Row: {
          business_registration_number: string | null
          certifications: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at: string
          delivery_radius_km: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_order_value: number | null
          payment_terms: string[] | null
          physical_address: string
          rating: number | null
          specialization: string[]
          sub_county: string | null
          supplier_name: string
          total_orders: number | null
          updated_at: string
          user_id: string
          years_in_business: number | null
        }
        Insert: {
          business_registration_number?: string | null
          certifications?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string
          delivery_radius_km?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_order_value?: number | null
          payment_terms?: string[] | null
          physical_address: string
          rating?: number | null
          specialization: string[]
          sub_county?: string | null
          supplier_name: string
          total_orders?: number | null
          updated_at?: string
          user_id: string
          years_in_business?: number | null
        }
        Update: {
          business_registration_number?: string | null
          certifications?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string
          delivery_radius_km?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_order_value?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          rating?: number | null
          specialization?: string[]
          sub_county?: string | null
          supplier_name?: string
          total_orders?: number | null
          updated_at?: string
          user_id?: string
          years_in_business?: number | null
        }
        Relationships: []
      }
      farm_parcels: {
        Row: {
          coordinates: Json | null
          created_at: string
          current_crop: string | null
          expected_harvest: string | null
          id: string
          irrigation_system: string | null
          is_active: boolean | null
          notes: string | null
          parcel_name: string
          planting_date: string | null
          size_acres: number
          slope_type: string | null
          soil_type: string | null
          updated_at: string
          user_id: string
          water_source: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name: string
          planting_date?: string | null
          size_acres: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id: string
          water_source?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          current_crop?: string | null
          expected_harvest?: string | null
          id?: string
          irrigation_system?: string | null
          is_active?: boolean | null
          notes?: string | null
          parcel_name?: string
          planting_date?: string | null
          size_acres?: number
          slope_type?: string | null
          soil_type?: string | null
          updated_at?: string
          user_id?: string
          water_source?: string | null
        }
        Relationships: []
      }
      farm_statistics: {
        Row: {
          active_alerts: number | null
          average_yield: number | null
          created_at: string
          id: string
          monthly_revenue: number | null
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_alerts?: number | null
          average_yield?: number | null
          created_at?: string
          id?: string
          monthly_revenue?: number | null
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tasks: {
        Row: {
          created_at: string
          crop: string
          date: string
          description: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          crop: string
          date: string
          description?: string | null
          id?: string
          priority: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          crop?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farmer_exporter_collaborations: {
        Row: {
          availability_period: string | null
          collaboration_status: string
          collaboration_type: string | null
          commodity_name: string
          commodity_variety: string | null
          created_at: string
          documentation_needs: string[] | null
          estimated_quantity: number
          expires_at: string | null
          exporter_id: string | null
          farm_size_acres: number | null
          farmer_certifications: string[] | null
          farmer_coordinates: Json | null
          farmer_county: string
          farmer_email: string | null
          farmer_experience_years: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description: string | null
          harvest_date: string | null
          has_export_documentation: boolean | null
          id: string
          is_active: boolean | null
          notes: string | null
          pricing_expectations: string | null
          quality_grade: string | null
          special_requirements: string[] | null
          target_markets: string[] | null
          unit: string
          updated_at: string
        }
        Insert: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type?: string | null
          commodity_name: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id: string
          farmer_location: string
          farmer_name: string
          farmer_phone: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit?: string
          updated_at?: string
        }
        Update: {
          availability_period?: string | null
          collaboration_status?: string
          collaboration_type?: string | null
          commodity_name?: string
          commodity_variety?: string | null
          created_at?: string
          documentation_needs?: string[] | null
          estimated_quantity?: number
          expires_at?: string | null
          exporter_id?: string | null
          farm_size_acres?: number | null
          farmer_certifications?: string[] | null
          farmer_coordinates?: Json | null
          farmer_county?: string
          farmer_email?: string | null
          farmer_experience_years?: number | null
          farmer_id?: string
          farmer_location?: string
          farmer_name?: string
          farmer_phone?: string
          farmer_profile_description?: string | null
          harvest_date?: string | null
          has_export_documentation?: boolean | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          pricing_expectations?: string | null
          quality_grade?: string | null
          special_requirements?: string[] | null
          target_markets?: string[] | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      kilimo_statistics: {
        Row: {
          category: string
          county: string
          created_at: string | null
          external_id: string | null
          fetch_date: string | null
          id: string
          metadata: Json | null
          name: string
          source: string | null
          unit: string | null
          updated_at: string | null
          value: string
          verified: boolean | null
        }
        Insert: {
          category: string
          county: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value: string
          verified?: boolean | null
        }
        Update: {
          category?: string
          county?: string
          created_at?: string | null
          external_id?: string | null
          fetch_date?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          source?: string | null
          unit?: string | null
          updated_at?: string | null
          value?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      market_agents: {
        Row: {
          agent_email: string | null
          agent_name: string
          agent_phone: string
          agent_type: string
          commission_structure: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          languages_spoken: string[] | null
          markets_covered: string[]
          network_size: number | null
          rating: number | null
          services_offered: string[]
          success_rate_percent: number | null
          total_transactions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_email?: string | null
          agent_name: string
          agent_phone: string
          agent_type: string
          commission_structure?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          markets_covered: string[]
          network_size?: number | null
          rating?: number | null
          services_offered: string[]
          success_rate_percent?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_email?: string | null
          agent_name?: string
          agent_phone?: string
          agent_type?: string
          commission_structure?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          languages_spoken?: string[] | null
          markets_covered?: string[]
          network_size?: number | null
          rating?: number | null
          services_offered?: string[]
          success_rate_percent?: number | null
          total_transactions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      market_demand_supply: {
        Row: {
          additional_notes: string | null
          commodity_name: string
          contact_person: string
          contact_phone: string
          created_at: string
          entry_type: string
          id: string
          is_active: boolean | null
          market_id: string
          participant_id: string | null
          price_range_max: number | null
          price_range_min: number | null
          quality_requirements: string[] | null
          quantity_available: number | null
          quantity_needed: number | null
          unit_of_measure: string
          updated_at: string
          urgency_level: string | null
          valid_until: string
        }
        Insert: {
          additional_notes?: string | null
          commodity_name: string
          contact_person: string
          contact_phone: string
          created_at?: string
          entry_type: string
          id?: string
          is_active?: boolean | null
          market_id: string
          participant_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          quality_requirements?: string[] | null
          quantity_available?: number | null
          quantity_needed?: number | null
          unit_of_measure: string
          updated_at?: string
          urgency_level?: string | null
          valid_until: string
        }
        Update: {
          additional_notes?: string | null
          commodity_name?: string
          contact_person?: string
          contact_phone?: string
          created_at?: string
          entry_type?: string
          id?: string
          is_active?: boolean | null
          market_id?: string
          participant_id?: string | null
          price_range_max?: number | null
          price_range_min?: number | null
          quality_requirements?: string[] | null
          quantity_available?: number | null
          quantity_needed?: number | null
          unit_of_measure?: string
          updated_at?: string
          urgency_level?: string | null
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_demand_supply_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_demand_supply_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "market_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      market_forecasts: {
        Row: {
          commodity_name: string
          confidence_level: number
          county: string
          created_at: string
          current_price: number
          factors: Json | null
          forecast_price: number
          id: string
          period: string
          valid_until: string
        }
        Insert: {
          commodity_name: string
          confidence_level?: number
          county: string
          created_at?: string
          current_price: number
          factors?: Json | null
          forecast_price: number
          id?: string
          period?: string
          valid_until?: string
        }
        Update: {
          commodity_name?: string
          confidence_level?: number
          county?: string
          created_at?: string
          current_price?: number
          factors?: Json | null
          forecast_price?: number
          id?: string
          period?: string
          valid_until?: string
        }
        Relationships: []
      }
      market_linkage_applications: {
        Row: {
          application_status: string | null
          applied_at: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity: number | null
          farm_size: number | null
          farmer_name: string
          id: string
          linkage_id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          user_id: string
        }
        Insert: {
          application_status?: string | null
          applied_at?: string
          contact_phone: string
          crops_to_supply: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name: string
          id?: string
          linkage_id: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id: string
        }
        Update: {
          application_status?: string | null
          applied_at?: string
          contact_phone?: string
          crops_to_supply?: string[]
          estimated_quantity?: number | null
          farm_size?: number | null
          farmer_name?: string
          id?: string
          linkage_id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_linkage_applications_linkage_id_fkey"
            columns: ["linkage_id"]
            isOneToOne: false
            referencedRelation: "market_linkages"
            referencedColumns: ["id"]
          },
        ]
      }
      market_linkages: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          contact_info: string
          counties: string[]
          created_at: string
          created_by: string | null
          crops_involved: string[]
          description: string
          duration_months: number | null
          id: string
          linkage_type: string
          max_participants: number | null
          minimum_quantity: number | null
          participants_count: number | null
          price_range: string | null
          requirements: string[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info: string
          counties: string[]
          created_at?: string
          created_by?: string | null
          crops_involved: string[]
          description: string
          duration_months?: number | null
          id?: string
          linkage_type: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          contact_info?: string
          counties?: string[]
          created_at?: string
          created_by?: string | null
          crops_involved?: string[]
          description?: string
          duration_months?: number | null
          id?: string
          linkage_type?: string
          max_participants?: number | null
          minimum_quantity?: number | null
          participants_count?: number | null
          price_range?: string | null
          requirements?: string[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_participants: {
        Row: {
          agent_id: string | null
          business_name: string | null
          capacity_description: string | null
          contact_email: string | null
          contact_phone: string
          coordinates: Json | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_active_at: string | null
          location_details: string | null
          market_id: string
          onboarded_at: string
          operating_schedule: string | null
          participant_name: string
          participant_type: string
          payment_methods: string[]
          price_range: string | null
          quality_standards: string[] | null
          rating: number | null
          specialization: string[]
          total_transactions: number | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          business_name?: string | null
          capacity_description?: string | null
          contact_email?: string | null
          contact_phone: string
          coordinates?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_details?: string | null
          market_id: string
          onboarded_at?: string
          operating_schedule?: string | null
          participant_name: string
          participant_type: string
          payment_methods: string[]
          price_range?: string | null
          quality_standards?: string[] | null
          rating?: number | null
          specialization: string[]
          total_transactions?: number | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          business_name?: string | null
          capacity_description?: string | null
          contact_email?: string | null
          contact_phone?: string
          coordinates?: Json | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          location_details?: string | null
          market_id?: string
          onboarded_at?: string
          operating_schedule?: string | null
          participant_name?: string
          participant_type?: string
          payment_methods?: string[]
          price_range?: string | null
          quality_standards?: string[] | null
          rating?: number | null
          specialization?: string[]
          total_transactions?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_participants_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "market_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_participants_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      market_prices: {
        Row: {
          commodity_name: string
          confidence_score: number | null
          county: string
          date_recorded: string
          id: string
          market_id: string
          market_name: string
          price: number
          source: string
          unit: string
          verified: boolean | null
        }
        Insert: {
          commodity_name: string
          confidence_score?: number | null
          county: string
          date_recorded?: string
          id?: string
          market_id: string
          market_name: string
          price: number
          source?: string
          unit: string
          verified?: boolean | null
        }
        Update: {
          commodity_name?: string
          confidence_score?: number | null
          county?: string
          date_recorded?: string
          id?: string
          market_id?: string
          market_name?: string
          price?: number
          source?: string
          unit?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      market_sentiment: {
        Row: {
          commodity_name: string
          county: string
          created_at: string
          id: string
          issues: string[]
          report_count: number
          sentiment_score: number
          tags: string[]
          updated_at: string
        }
        Insert: {
          commodity_name: string
          county: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score: number
          tags?: string[]
          updated_at?: string
        }
        Update: {
          commodity_name?: string
          county?: string
          created_at?: string
          id?: string
          issues?: string[]
          report_count?: number
          sentiment_score?: number
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_encrypted: boolean | null
          media_type: string | null
          media_url: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_encrypted?: boolean | null
          media_type?: string | null
          media_url?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      micro_creditors: {
        Row: {
          active_borrowers: number | null
          collateral_requirements: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          default_rate_percent: number | null
          id: string
          institution_name: string
          institution_type: string
          interest_rate_range: string
          is_active: boolean | null
          is_licensed: boolean | null
          license_number: string | null
          loan_processing_time_days: number | null
          loan_products: Json
          maximum_loan_amount: number
          minimum_loan_amount: number
          physical_address: string
          rating: number | null
          service_counties: string[]
          sub_county: string | null
          target_sectors: string[]
          total_disbursed_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_borrowers?: number | null
          collateral_requirements?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          default_rate_percent?: number | null
          id?: string
          institution_name: string
          institution_type: string
          interest_rate_range: string
          is_active?: boolean | null
          is_licensed?: boolean | null
          license_number?: string | null
          loan_processing_time_days?: number | null
          loan_products: Json
          maximum_loan_amount: number
          minimum_loan_amount: number
          physical_address: string
          rating?: number | null
          service_counties: string[]
          sub_county?: string | null
          target_sectors: string[]
          total_disbursed_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_borrowers?: number | null
          collateral_requirements?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          default_rate_percent?: number | null
          id?: string
          institution_name?: string
          institution_type?: string
          interest_rate_range?: string
          is_active?: boolean | null
          is_licensed?: boolean | null
          license_number?: string | null
          loan_processing_time_days?: number | null
          loan_products?: Json
          maximum_loan_amount?: number
          minimum_loan_amount?: number
          physical_address?: string
          rating?: number | null
          service_counties?: string[]
          sub_county?: string | null
          target_sectors?: string[]
          total_disbursed_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      p2p_lending_offers: {
        Row: {
          application_deadline: string | null
          borrower_requirements: string[] | null
          collateral_description: string | null
          collateral_required: boolean | null
          counties_served: string[]
          created_at: string
          funding_status: string
          id: string
          interest_rate_percent: number
          is_active: boolean | null
          lender_email: string
          lender_id: string
          lender_name: string
          lender_phone: string
          loan_amount: number
          loan_term_months: number
          minimum_borrower_rating: number | null
          offer_title: string
          purpose_category: string
          risk_level: string
          specific_purpose: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          borrower_requirements?: string[] | null
          collateral_description?: string | null
          collateral_required?: boolean | null
          counties_served: string[]
          created_at?: string
          funding_status?: string
          id?: string
          interest_rate_percent: number
          is_active?: boolean | null
          lender_email: string
          lender_id: string
          lender_name: string
          lender_phone: string
          loan_amount: number
          loan_term_months: number
          minimum_borrower_rating?: number | null
          offer_title: string
          purpose_category: string
          risk_level: string
          specific_purpose?: string | null
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          borrower_requirements?: string[] | null
          collateral_description?: string | null
          collateral_required?: boolean | null
          counties_served?: string[]
          created_at?: string
          funding_status?: string
          id?: string
          interest_rate_percent?: number
          is_active?: boolean | null
          lender_email?: string
          lender_id?: string
          lender_name?: string
          lender_phone?: string
          loan_amount?: number
          loan_term_months?: number
          minimum_borrower_rating?: number | null
          offer_title?: string
          purpose_category?: string
          risk_level?: string
          specific_purpose?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          advertisement_id: string | null
          amount: number
          created_at: string
          currency: string
          id: string
          payment_details: Json | null
          payment_provider: string
          status: string | null
          transaction_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          advertisement_id?: string | null
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider: string
          status?: string | null
          transaction_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          advertisement_id?: string | null
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_details?: Json | null
          payment_provider?: string
          status?: string | null
          transaction_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "business_advertisements"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          likes_count: number | null
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_tiers: {
        Row: {
          created_at: string
          currency: string
          features: string[]
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: string[]
          id: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          period: string
          price: number
          requests: number
        }
        Update: {
          created_at?: string
          currency?: string
          features?: string[]
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          period?: string
          price?: number
          requests?: number
        }
        Relationships: []
      }
      processors: {
        Row: {
          business_type: string
          certifications: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates: Json | null
          county: string
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          minimum_quantity_tons: number | null
          payment_terms: string[] | null
          physical_address: string
          pricing_model: string | null
          processed_products: string[]
          processing_capacity_tons_per_day: number
          processing_fee_per_ton: number | null
          processing_methods: string[] | null
          processor_name: string
          quality_standards: string[] | null
          rating: number | null
          raw_materials_needed: string[]
          registration_number: string | null
          service_radius_km: number | null
          sub_county: string | null
          total_orders: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_type?: string
          certifications?: string[] | null
          contact_email: string
          contact_person: string
          contact_phone: string
          coordinates?: Json | null
          county: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address: string
          pricing_model?: string | null
          processed_products: string[]
          processing_capacity_tons_per_day: number
          processing_fee_per_ton?: number | null
          processing_methods?: string[] | null
          processor_name: string
          quality_standards?: string[] | null
          rating?: number | null
          raw_materials_needed: string[]
          registration_number?: string | null
          service_radius_km?: number | null
          sub_county?: string | null
          total_orders?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_type?: string
          certifications?: string[] | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          coordinates?: Json | null
          county?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          minimum_quantity_tons?: number | null
          payment_terms?: string[] | null
          physical_address?: string
          pricing_model?: string | null
          processed_products?: string[]
          processing_capacity_tons_per_day?: number
          processing_fee_per_ton?: number | null
          processing_methods?: string[] | null
          processor_name?: string
          quality_standards?: string[] | null
          rating?: number | null
          raw_materials_needed?: string[]
          registration_number?: string | null
          service_radius_km?: number | null
          sub_county?: string | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      produce_inventory: {
        Row: {
          available_for_sale: boolean | null
          created_at: string
          description: string | null
          expiry_date: string | null
          farmer_id: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string
          organic_certified: boolean | null
          price_per_unit: number | null
          product_name: string
          quality_grade: string | null
          quantity: number
          storage_conditions: string | null
          unit: string
          updated_at: string
          variety: string | null
        }
        Insert: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name: string
          quality_grade?: string | null
          quantity: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Update: {
          available_for_sale?: boolean | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string
          organic_certified?: boolean | null
          price_per_unit?: number | null
          product_name?: string
          quality_grade?: string | null
          quantity?: number
          storage_conditions?: string | null
          unit?: string
          updated_at?: string
          variety?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_number: string | null
          county: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          farm_size: number | null
          farm_type: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          role: string | null
          specialization: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_number?: string | null
          county?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          farm_size?: number | null
          farm_type?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          role?: string | null
          specialization?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      quality_control_discussions: {
        Row: {
          attendees: number | null
          author_name: string
          author_type: string
          county: string
          created_at: string
          date: string
          description: string
          id: string
          is_active: boolean | null
          location: string
          organizer: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendees?: number | null
          author_name: string
          author_type: string
          county: string
          created_at?: string
          date: string
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          organizer: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendees?: number | null
          author_name?: string
          author_type?: string
          county?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          organizer?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_provider_reviews: {
        Row: {
          created_at: string
          id: string
          provider_id: string
          rating: number
          review_text: string | null
          service_used: string
          user_id: string
          would_recommend: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          provider_id: string
          rating: number
          review_text?: string | null
          service_used: string
          user_id: string
          would_recommend?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          provider_id?: string
          rating?: number
          review_text?: string | null
          service_used?: string
          user_id?: string
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "service_provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          availability: string | null
          business_name: string
          certifications: string[] | null
          contact_email: string
          contact_phone: string | null
          counties_served: string[] | null
          created_at: string
          description: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          location: string
          rating: number | null
          service_type: string
          services_offered: string[] | null
          total_jobs: number | null
          updated_at: string
          user_id: string | null
          website_url: string | null
        }
        Insert: {
          availability?: string | null
          business_name: string
          certifications?: string[] | null
          contact_email: string
          contact_phone?: string | null
          counties_served?: string[] | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location: string
          rating?: number | null
          service_type: string
          services_offered?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Update: {
          availability?: string | null
          business_name?: string
          certifications?: string[] | null
          contact_email?: string
          contact_phone?: string | null
          counties_served?: string[] | null
          created_at?: string
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          location?: string
          rating?: number | null
          service_type?: string
          services_offered?: string[] | null
          total_jobs?: number | null
          updated_at?: string
          user_id?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      training_events: {
        Row: {
          certificate_provided: boolean | null
          contact_info: string
          cost: number | null
          county: string
          created_at: string
          current_participants: number | null
          description: string
          end_date: string
          event_type: string
          id: string
          is_active: boolean | null
          is_online: boolean | null
          location: string
          materials_provided: boolean | null
          max_participants: number | null
          meeting_link: string | null
          organizer_id: string | null
          registration_deadline: string | null
          requirements: string[] | null
          start_date: string
          status: string | null
          target_audience: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          certificate_provided?: boolean | null
          contact_info: string
          cost?: number | null
          county: string
          created_at?: string
          current_participants?: number | null
          description: string
          end_date: string
          event_type: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date: string
          status?: string | null
          target_audience?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          certificate_provided?: boolean | null
          contact_info?: string
          cost?: number | null
          county?: string
          created_at?: string
          current_participants?: number | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          is_active?: boolean | null
          is_online?: boolean | null
          location?: string
          materials_provided?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          organizer_id?: string | null
          registration_deadline?: string | null
          requirements?: string[] | null
          start_date?: string
          status?: string | null
          target_audience?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      training_registrations: {
        Row: {
          attended: boolean | null
          contact_phone: string
          experience_level: string | null
          feedback_comments: string | null
          feedback_rating: number | null
          id: string
          organization: string | null
          participant_name: string
          registered_at: string
          registration_status: string | null
          specific_interests: string | null
          training_id: string
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          contact_phone: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id: string
          user_id: string
        }
        Update: {
          attended?: boolean | null
          contact_phone?: string
          experience_level?: string | null
          feedback_comments?: string | null
          feedback_rating?: number | null
          id?: string
          organization?: string | null
          participant_name?: string
          registered_at?: string
          registration_status?: string | null
          specific_interests?: string | null
          training_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_registrations_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "training_events"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_requests: {
        Row: {
          actual_price: number | null
          cargo_type: string
          contact_phone: string
          created_at: string
          dropoff_county: string
          dropoff_location: string
          estimated_value: number | null
          flexible_timing: boolean | null
          id: string
          insurance_required: boolean | null
          notes: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price: number | null
          requested_date: string
          requester_id: string | null
          special_requirements: string[] | null
          status: string | null
          transporter_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          actual_price?: number | null
          cargo_type: string
          contact_phone: string
          created_at?: string
          dropoff_county: string
          dropoff_location: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county: string
          pickup_location: string
          quantity: number
          quoted_price?: number | null
          requested_date: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          actual_price?: number | null
          cargo_type?: string
          contact_phone?: string
          created_at?: string
          dropoff_county?: string
          dropoff_location?: string
          estimated_value?: number | null
          flexible_timing?: boolean | null
          id?: string
          insurance_required?: boolean | null
          notes?: string | null
          pickup_county?: string
          pickup_location?: string
          quantity?: number
          quoted_price?: number | null
          requested_date?: string
          requester_id?: string | null
          special_requirements?: string[] | null
          status?: string | null
          transporter_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_requests_transporter_id_fkey"
            columns: ["transporter_id"]
            isOneToOne: false
            referencedRelation: "transporters"
            referencedColumns: ["id"]
          },
        ]
      }
      transporters: {
        Row: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at: string
          has_refrigeration: boolean
          id: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at: string
          user_id: string
          vehicle_type: string
        }
        Insert: {
          capacity: string
          contact_info: string
          counties: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity: number
          name: string
          rates: string
          service_type: string
          updated_at?: string
          user_id: string
          vehicle_type: string
        }
        Update: {
          capacity?: string
          contact_info?: string
          counties?: string[]
          created_at?: string
          has_refrigeration?: boolean
          id?: string
          load_capacity?: number
          name?: string
          rates?: string
          service_type?: string
          updated_at?: string
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      warehouse_bookings: {
        Row: {
          contact_phone: string
          created_at: string
          end_date: string
          id: string
          notes: string | null
          payment_status: string | null
          produce_type: string
          quantity_tons: number
          special_requirements: string[] | null
          start_date: string
          status: string | null
          total_cost: number
          updated_at: string
          user_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          end_date: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type: string
          quantity_tons: number
          special_requirements?: string[] | null
          start_date: string
          status?: string | null
          total_cost: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          end_date?: string
          id?: string
          notes?: string | null
          payment_status?: string | null
          produce_type?: string
          quantity_tons?: number
          special_requirements?: string[] | null
          start_date?: string
          status?: string | null
          total_cost?: number
          updated_at?: string
          user_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_bookings_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          availability_status: string | null
          capacity_tons: number
          certifications: string[] | null
          contact_info: string
          county: string
          created_at: string
          daily_rate_per_ton: number
          has_refrigeration: boolean | null
          has_security: boolean | null
          id: string
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          operating_hours: string | null
          owner_id: string | null
          storage_types: string[] | null
          updated_at: string
        }
        Insert: {
          availability_status?: string | null
          capacity_tons: number
          certifications?: string[] | null
          contact_info: string
          county: string
          created_at?: string
          daily_rate_per_ton: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
        }
        Update: {
          availability_status?: string | null
          capacity_tons?: number
          certifications?: string[] | null
          contact_info?: string
          county?: string
          created_at?: string
          daily_rate_per_ton?: number
          has_refrigeration?: boolean | null
          has_security?: boolean | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          operating_hours?: string | null
          owner_id?: string | null
          storage_types?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          created_at: string
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          region: string
          severity: string
          start_date: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          region?: string
          severity?: string
          start_date?: string
          type?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          county: string
          created_at: string
          date: string
          forecast_data: Json | null
          humidity: number | null
          id: string
          rainfall: number | null
          source: string | null
          temperature_max: number | null
          temperature_min: number | null
          weather_condition: string | null
          wind_speed: number | null
        }
        Insert: {
          county: string
          created_at?: string
          date: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Update: {
          county?: string
          created_at?: string
          date?: string
          forecast_data?: Json | null
          humidity?: number | null
          id?: string
          rainfall?: number | null
          source?: string | null
          temperature_max?: number | null
          temperature_min?: number | null
          weather_condition?: string | null
          wind_speed?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_user_id: string
          p_subscription_type: string
          p_time_window?: unknown
        }
        Returns: Json
      }
      validate_api_key: {
        Args: { p_key_hash: string }
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
    Enums: {},
  },
} as const

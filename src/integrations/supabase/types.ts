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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          api_key: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key_name: string
          last_used_at: string | null
          rate_limit: number
          tier: string
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name: string
          last_used_at?: string | null
          rate_limit?: number
          tier?: string
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key_name?: string
          last_used_at?: string | null
          rate_limit?: number
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          endpoint: string
          id: string
          method: string
          response_time_ms: number | null
          status_code: number
          timestamp: string
        }
        Insert: {
          api_key_id: string
          endpoint: string
          id?: string
          method: string
          response_time_ms?: number | null
          status_code: number
          timestamp?: string
        }
        Update: {
          api_key_id?: string
          endpoint?: string
          id?: string
          method?: string
          response_time_ms?: number | null
          status_code?: number
          timestamp?: string
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
      auction_bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string | null
          bidder_id: string
          id: string
          is_winning_bid: boolean | null
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string | null
          bidder_id: string
          id?: string
          is_winning_bid?: boolean | null
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string | null
          bidder_id?: string
          id?: string
          is_winning_bid?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "product_auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ban_recommendations: {
        Row: {
          created_at: string
          id: string
          market_id: string
          reason: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          reason: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          reason?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      batch_tracking: {
        Row: {
          batch_id: string
          certifications: string[] | null
          created_at: string
          destination: string | null
          events: Json | null
          farmer_id: string
          id: string
          origin: string
          product_type: string
          qr_code_url: string | null
          quality_score: number | null
          quantity: number
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          batch_id: string
          certifications?: string[] | null
          created_at?: string
          destination?: string | null
          events?: Json | null
          farmer_id: string
          id?: string
          origin: string
          product_type: string
          qr_code_url?: string | null
          quality_score?: number | null
          quantity: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          batch_id?: string
          certifications?: string[] | null
          created_at?: string
          destination?: string | null
          events?: Json | null
          farmer_id?: string
          id?: string
          origin?: string
          product_type?: string
          qr_code_url?: string | null
          quality_score?: number | null
          quantity?: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      bulk_order_messages: {
        Row: {
          attachment_urls: string[] | null
          bulk_order_id: string
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          message_type: string | null
          sender_id: string
          title: string | null
        }
        Insert: {
          attachment_urls?: string[] | null
          bulk_order_id: string
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          message_type?: string | null
          sender_id: string
          title?: string | null
        }
        Update: {
          attachment_urls?: string[] | null
          bulk_order_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          message_type?: string | null
          sender_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_order_messages_bulk_order_id_fkey"
            columns: ["bulk_order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_order_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_order_participants: {
        Row: {
          bulk_order_id: string
          delivery_address_id: string | null
          id: string
          joined_date: string | null
          participant_id: string
          payment_amount: number | null
          payment_date: string | null
          payment_due_date: string | null
          payment_status: string | null
          quantity_committed: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          bulk_order_id: string
          delivery_address_id?: string | null
          id?: string
          joined_date?: string | null
          participant_id: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_due_date?: string | null
          payment_status?: string | null
          quantity_committed: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          bulk_order_id?: string
          delivery_address_id?: string | null
          id?: string
          joined_date?: string | null
          participant_id?: string
          payment_amount?: number | null
          payment_date?: string | null
          payment_due_date?: string | null
          payment_status?: string | null
          quantity_committed?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_order_participants_bulk_order_id_fkey"
            columns: ["bulk_order_id"]
            isOneToOne: false
            referencedRelation: "bulk_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_order_participants_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "delivery_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bulk_order_participants_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_orders: {
        Row: {
          buyer_id: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          produce_type: string
          quantity: number
          status: string
          target_price: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          produce_type: string
          quantity: number
          status?: string
          target_price?: number | null
          unit?: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          produce_type?: string
          quantity?: number
          status?: string
          target_price?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      carbon_credit_providers: {
        Row: {
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at: string
          description: string | null
          id: string
          physical_address: string
          pricing_model: string | null
          provider_name: string
          provider_type: string
          registration_number: string | null
          services_offered: string[] | null
          trust_score: number | null
          updated_at: string
          user_id: string
          verification_status: string
        }
        Insert: {
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string
          description?: string | null
          id?: string
          physical_address: string
          pricing_model?: string | null
          provider_name: string
          provider_type: string
          registration_number?: string | null
          services_offered?: string[] | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          verification_status?: string
        }
        Update: {
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string
          description?: string | null
          id?: string
          physical_address?: string
          pricing_model?: string | null
          provider_name?: string
          provider_type?: string
          registration_number?: string | null
          services_offered?: string[] | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          added_at: string | null
          cart_id: string
          custom_attributes: Json | null
          id: string
          item_total: number
          product_id: string
          product_type: string
          quantity: number
          seller_id: string
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          added_at?: string | null
          cart_id: string
          custom_attributes?: Json | null
          id?: string
          item_total: number
          product_id: string
          product_type: string
          quantity?: number
          seller_id: string
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          added_at?: string | null
          cart_id?: string
          custom_attributes?: Json | null
          id?: string
          item_total?: number
          product_id?: string
          product_type?: string
          quantity?: number
          seller_id?: string
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "shopping_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          language: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          status?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          message_data: Json | null
          message_text: string
          sender_type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          message_data?: Json | null
          message_text: string
          sender_type?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          message_data?: Json | null
          message_text?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      city_market_bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string
          bidder_user_id: string
          created_at: string
          id: string
          status: string
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string
          bidder_user_id: string
          created_at?: string
          id?: string
          status?: string
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string
          bidder_user_id?: string
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      city_market_products: {
        Row: {
          agent_id: string
          category: string
          created_at: string | null
          description: string | null
          expiry_date: string | null
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string | null
          name: string
          posted_at: string | null
          price_per_unit: number
          quantity: number
          status: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          category: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name: string
          posted_at?: string | null
          price_per_unit: number
          quantity: number
          status?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name?: string
          posted_at?: string | null
          price_per_unit?: number
          quantity?: number
          status?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "city_market_products_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      city_markets: {
        Row: {
          address: string | null
          city: string
          county: string
          created_at: string | null
          description: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          is_active: boolean | null
          market_name: string
          market_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city: string
          county: string
          created_at?: string | null
          description?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean | null
          market_name: string
          market_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          county?: string
          created_at?: string | null
          description?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          is_active?: boolean | null
          market_name?: string
          market_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: []
      }
      community_post_reposts: {
        Row: {
          id: string
          original_post_id: string
          repost_caption: string | null
          reposted_at: string
          reposted_by: string
        }
        Insert: {
          id?: string
          original_post_id: string
          repost_caption?: string | null
          reposted_at?: string
          reposted_by: string
        }
        Update: {
          id?: string
          original_post_id?: string
          repost_caption?: string | null
          reposted_at?: string
          reposted_by?: string
        }
        Relationships: []
      }
      community_post_shares: {
        Row: {
          id: string
          platform: string
          post_id: string
          shared_at: string
          user_id: string
        }
        Insert: {
          id?: string
          platform: string
          post_id: string
          shared_at?: string
          user_id: string
        }
        Update: {
          id?: string
          platform?: string
          post_id?: string
          shared_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category: string
          comments_count: number
          content: string
          created_at: string
          id: string
          images: string[] | null
          likes_count: number
          shares_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number
          shares_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          likes_count?: number
          shares_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reported_by: string
          reported_post_id: string | null
          reported_user_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reported_by: string
          reported_post_id?: string | null
          reported_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reported_by?: string
          reported_post_id?: string | null
          reported_user_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: []
      }
      contract_disputes: {
        Row: {
          contract_id: string
          created_at: string
          description: string
          dispute_type: string
          evidence_urls: string[] | null
          id: string
          raised_by: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          description: string
          dispute_type: string
          evidence_urls?: string[] | null
          id?: string
          raised_by: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          description?: string
          dispute_type?: string
          evidence_urls?: string[] | null
          id?: string
          raised_by?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_disputes_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents: {
        Row: {
          contract_id: string
          document_type: string
          document_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          contract_id: string
          document_type: string
          document_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          contract_id?: string
          document_type?: string
          document_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_documents_v2: {
        Row: {
          contract_id: string
          created_at: string
          document_name: string
          document_type: string
          document_url: string
          file_size: number | null
          id: string
          is_verified: boolean | null
          notes: string | null
          uploaded_by: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          document_name: string
          document_type: string
          document_url: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          notes?: string | null
          uploaded_by: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          document_url?: string
          file_size?: number | null
          id?: string
          is_verified?: boolean | null
          notes?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_documents_v2_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_farming: {
        Row: {
          buyer_id: string
          contract_start_date: string
          created_at: string | null
          crop_type: string
          delivery_terms: string | null
          expected_harvest_date: string
          farmer_id: string | null
          id: string
          price_per_unit: number
          quality_standards: string | null
          quantity: number
          status: string | null
          unit: string
        }
        Insert: {
          buyer_id: string
          contract_start_date: string
          created_at?: string | null
          crop_type: string
          delivery_terms?: string | null
          expected_harvest_date: string
          farmer_id?: string | null
          id?: string
          price_per_unit: number
          quality_standards?: string | null
          quantity: number
          status?: string | null
          unit: string
        }
        Update: {
          buyer_id?: string
          contract_start_date?: string
          created_at?: string | null
          crop_type?: string
          delivery_terms?: string | null
          expected_harvest_date?: string
          farmer_id?: string | null
          id?: string
          price_per_unit?: number
          quality_standards?: string | null
          quantity?: number
          status?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_farming_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_farming_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_milestones: {
        Row: {
          completed_at: string | null
          contract_id: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          milestone_name: string
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          status: string
          verified_by: string | null
        }
        Insert: {
          completed_at?: string | null
          contract_id: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          milestone_name: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: string
          verified_by?: string | null
        }
        Update: {
          completed_at?: string | null
          contract_id?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          milestone_name?: string
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          status?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_payments: {
        Row: {
          amount: number
          contract_id: string
          created_at: string
          id: string
          milestone_id: string | null
          paid_at: string | null
          paid_by: string | null
          paid_to: string | null
          payment_method: string | null
          payment_type: string
          released_at: string | null
          status: string
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string
          id?: string
          milestone_id?: string | null
          paid_at?: string | null
          paid_by?: string | null
          paid_to?: string | null
          payment_method?: string | null
          payment_type: string
          released_at?: string | null
          status?: string
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string
          id?: string
          milestone_id?: string | null
          paid_at?: string | null
          paid_by?: string | null
          paid_to?: string | null
          payment_method?: string | null
          payment_type?: string
          released_at?: string | null
          status?: string
          transaction_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_payments_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_payments_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "contract_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_reviews: {
        Row: {
          contract_id: string
          created_at: string | null
          id: string
          rating: number | null
          review_text: string | null
          reviewer_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          reviewer_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          id?: string
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_reviews_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contract_farming"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          last_message_content: string | null
          last_message_date: string | null
          participant1_id: string
          participant1_unread_count: number | null
          participant2_id: string
          participant2_unread_count: number | null
          product_id: string | null
          product_type: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_content?: string | null
          last_message_date?: string | null
          participant1_id: string
          participant1_unread_count?: number | null
          participant2_id: string
          participant2_unread_count?: number | null
          product_id?: string | null
          product_type?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_content?: string | null
          last_message_date?: string | null
          participant1_id?: string
          participant1_unread_count?: number | null
          participant2_id?: string
          participant2_unread_count?: number | null
          product_id?: string | null
          product_type?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_participant1_id_fkey"
            columns: ["participant1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant2_id_fkey"
            columns: ["participant2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_addresses: {
        Row: {
          address_type: string | null
          apartment_number: string | null
          city: string
          country: string | null
          county: string
          created_at: string | null
          delivery_instructions: string | null
          id: string
          is_default: boolean | null
          landmark: string | null
          phone_number: string
          postal_code: string | null
          recipient_name: string
          street_address: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_type?: string | null
          apartment_number?: string | null
          city: string
          country?: string | null
          county: string
          created_at?: string | null
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          phone_number: string
          postal_code?: string | null
          recipient_name: string
          street_address: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_type?: string | null
          apartment_number?: string | null
          city?: string
          country?: string | null
          county?: string
          created_at?: string | null
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          phone_number?: string
          postal_code?: string | null
          recipient_name?: string
          street_address?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_requests: {
        Row: {
          actual_cost: number | null
          cargo_type: string
          cargo_weight_tons: number
          created_at: string | null
          delivery_county: string
          delivery_date: string | null
          delivery_location: string
          estimated_cost: number | null
          id: string
          notes: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id: string | null
          provider_rating: number | null
          requester_id: string
          requester_rating: number | null
          special_requirements: string[] | null
          status: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          cargo_type: string
          cargo_weight_tons: number
          created_at?: string | null
          delivery_county: string
          delivery_date?: string | null
          delivery_location: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county: string
          pickup_date: string
          pickup_location: string
          provider_id?: string | null
          provider_rating?: number | null
          requester_id: string
          requester_rating?: number | null
          special_requirements?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          cargo_type?: string
          cargo_weight_tons?: number
          created_at?: string | null
          delivery_county?: string
          delivery_date?: string | null
          delivery_location?: string
          estimated_cost?: number | null
          id?: string
          notes?: string | null
          pickup_county?: string
          pickup_date?: string
          pickup_location?: string
          provider_id?: string | null
          provider_rating?: number | null
          requester_id?: string
          requester_rating?: number | null
          special_requirements?: string[] | null
          status?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_requests_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "logistics_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking: {
        Row: {
          courier_phone: string | null
          courier_service: string | null
          created_at: string | null
          current_location: string | null
          current_status: string | null
          delivery_proof_photo_url: string | null
          estimated_arrival: string | null
          gps_latitude: number | null
          gps_longitude: number | null
          id: string
          last_updated: string | null
          notes: string | null
          order_id: string
          recipient_name_on_delivery: string | null
          signature_url: string | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          courier_phone?: string | null
          courier_service?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          delivery_proof_photo_url?: string | null
          estimated_arrival?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          last_updated?: string | null
          notes?: string | null
          order_id: string
          recipient_name_on_delivery?: string | null
          signature_url?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          courier_phone?: string | null
          courier_service?: string | null
          created_at?: string | null
          current_location?: string | null
          current_status?: string | null
          delivery_proof_photo_url?: string | null
          estimated_arrival?: string | null
          gps_latitude?: number | null
          gps_longitude?: number | null
          id?: string
          last_updated?: string | null
          notes?: string | null
          order_id?: string
          recipient_name_on_delivery?: string | null
          signature_url?: string | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          claimant_id: string
          created_at: string | null
          description: string
          dispute_status: string | null
          dispute_type: string
          evidence_urls: string[] | null
          id: string
          mediator_id: string | null
          mediator_notes: string | null
          order_id: string
          resolution_amount: number | null
          resolution_type: string | null
          resolved_at: string | null
          respondent_id: string
          updated_at: string | null
        }
        Insert: {
          claimant_id: string
          created_at?: string | null
          description: string
          dispute_status?: string | null
          dispute_type: string
          evidence_urls?: string[] | null
          id?: string
          mediator_id?: string | null
          mediator_notes?: string | null
          order_id: string
          resolution_amount?: number | null
          resolution_type?: string | null
          resolved_at?: string | null
          respondent_id: string
          updated_at?: string | null
        }
        Update: {
          claimant_id?: string
          created_at?: string | null
          description?: string
          dispute_status?: string | null
          dispute_type?: string
          evidence_urls?: string[] | null
          id?: string
          mediator_id?: string | null
          mediator_notes?: string | null
          order_id?: string
          resolution_amount?: number | null
          resolution_type?: string | null
          resolved_at?: string | null
          respondent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_claimant_id_fkey"
            columns: ["claimant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_mediator_id_fkey"
            columns: ["mediator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_respondent_id_fkey"
            columns: ["respondent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_documentation: {
        Row: {
          document_name: string
          document_type: string
          document_url: string
          file_size: number | null
          id: string
          opportunity_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          document_name: string
          document_type: string
          document_url: string
          file_size?: number | null
          id?: string
          opportunity_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          document_name?: string
          document_type?: string
          document_url?: string
          file_size?: number | null
          id?: string
          opportunity_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_documentation_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "export_documentation_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      export_opportunities: {
        Row: {
          created_at: string | null
          created_by: string | null
          deadline: string | null
          delivery_location: string | null
          description: string | null
          id: string
          opportunity_type: string | null
          product_category: string
          quantity_needed: number | null
          specifications: Json | null
          status: string | null
          target_price: number | null
          title: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          delivery_location?: string | null
          description?: string | null
          id?: string
          opportunity_type?: string | null
          product_category: string
          quantity_needed?: number | null
          specifications?: Json | null
          status?: string | null
          target_price?: number | null
          title: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          delivery_location?: string | null
          description?: string | null
          id?: string
          opportunity_type?: string | null
          product_category?: string
          quantity_needed?: number | null
          specifications?: Json | null
          status?: string | null
          target_price?: number | null
          title?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "export_opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      f2c_deliveries: {
        Row: {
          contents: Json | null
          created_at: string | null
          delivery_date: string
          delivery_notes: string | null
          farmer_id: string | null
          id: string
          status: string | null
          subscription_id: string
          tracking_number: string | null
        }
        Insert: {
          contents?: Json | null
          created_at?: string | null
          delivery_date: string
          delivery_notes?: string | null
          farmer_id?: string | null
          id?: string
          status?: string | null
          subscription_id: string
          tracking_number?: string | null
        }
        Update: {
          contents?: Json | null
          created_at?: string | null
          delivery_date?: string
          delivery_notes?: string | null
          farmer_id?: string | null
          id?: string
          status?: string | null
          subscription_id?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "f2c_deliveries_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "f2c_deliveries_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "f2c_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      f2c_subscription_plans: {
        Row: {
          box_size: string | null
          created_at: string | null
          description: string | null
          frequency: string
          id: string
          name: string
          price: number
        }
        Insert: {
          box_size?: string | null
          created_at?: string | null
          description?: string | null
          frequency: string
          id?: string
          name: string
          price: number
        }
        Update: {
          box_size?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      f2c_subscriptions: {
        Row: {
          consumer_id: string
          created_at: string | null
          delivery_address: string
          delivery_instructions: string | null
          id: string
          next_delivery_date: string | null
          payment_method: string | null
          plan_id: string
          status: string | null
        }
        Insert: {
          consumer_id: string
          created_at?: string | null
          delivery_address: string
          delivery_instructions?: string | null
          id?: string
          next_delivery_date?: string | null
          payment_method?: string | null
          plan_id: string
          status?: string | null
        }
        Update: {
          consumer_id?: string
          created_at?: string | null
          delivery_address?: string
          delivery_instructions?: string | null
          id?: string
          next_delivery_date?: string | null
          payment_method?: string | null
          plan_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "f2c_subscriptions_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "f2c_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "f2c_subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_budget: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string | null
          date: string
          farm_id: string
          id: string
          notes: string | null
          planned_amount: number
          updated_at: string | null
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string | null
          date: string
          farm_id: string
          id?: string
          notes?: string | null
          planned_amount: number
          updated_at?: string | null
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string | null
          date?: string
          farm_id?: string
          id?: string
          notes?: string | null
          planned_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      farm_galleries: {
        Row: {
          caption: string | null
          created_at: string | null
          farmer_id: string
          id: string
          photo_type: string | null
          photo_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          farmer_id: string
          id?: string
          photo_type?: string | null
          photo_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          farmer_id?: string
          id?: string
          photo_type?: string | null
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_galleries_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farm_input_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
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
          buyer_id: string | null
          created_at: string
          delivery_address: string | null
          id: string
          notes: string | null
          status: string | null
          supplier_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          delivery_address?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          delivery_address?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          supplier_id?: string | null
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
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          minimum_order: number | null
          price_per_unit: number
          product_name: string
          stock_quantity: number | null
          supplier_id: string | null
          unit_type: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          minimum_order?: number | null
          price_per_unit: number
          product_name: string
          stock_quantity?: number | null
          supplier_id?: string | null
          unit_type?: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          minimum_order?: number | null
          price_per_unit?: number
          product_name?: string
          stock_quantity?: number | null
          supplier_id?: string | null
          unit_type?: string
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
          address: string | null
          contact_phone: string | null
          created_at: string
          email: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          supplier_name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          supplier_name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_phone?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          supplier_name?: string
          updated_at?: string
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
          total_crops: number | null
          total_livestock: number | null
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
          total_crops?: number | null
          total_livestock?: number | null
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
          total_crops?: number | null
          total_livestock?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      farm_tasks: {
        Row: {
          created_at: string | null
          crop: string
          date: string
          description: string | null
          id: string
          priority: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          crop: string
          date: string
          description?: string | null
          id?: string
          priority: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          crop?: string
          date?: string
          description?: string | null
          id?: string
          priority?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      farm_yields: {
        Row: {
          actual_yield: number | null
          created_at: string | null
          crop_type: string
          expected_yield: number
          farm_id: string
          id: string
          notes: string | null
          planting_date: string
          updated_at: string | null
          yield_unit: string
        }
        Insert: {
          actual_yield?: number | null
          created_at?: string | null
          crop_type: string
          expected_yield: number
          farm_id: string
          id?: string
          notes?: string | null
          planting_date: string
          updated_at?: string | null
          yield_unit: string
        }
        Update: {
          actual_yield?: number | null
          created_at?: string | null
          crop_type?: string
          expected_yield?: number
          farm_id?: string
          id?: string
          notes?: string | null
          planting_date?: string
          updated_at?: string | null
          yield_unit?: string
        }
        Relationships: []
      }
      farmer_consolidations: {
        Row: {
          agreed_price: number | null
          consolidation_fee: number | null
          consolidator_id: string
          created_at: string | null
          farmers_involved: string[]
          id: string
          opportunity_id: string
          status: string | null
          total_quantity: number
        }
        Insert: {
          agreed_price?: number | null
          consolidation_fee?: number | null
          consolidator_id: string
          created_at?: string | null
          farmers_involved: string[]
          id?: string
          opportunity_id: string
          status?: string | null
          total_quantity: number
        }
        Update: {
          agreed_price?: number | null
          consolidation_fee?: number | null
          consolidator_id?: string
          created_at?: string | null
          farmers_involved?: string[]
          id?: string
          opportunity_id?: string
          status?: string | null
          total_quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "farmer_consolidations_consolidator_id_fkey"
            columns: ["consolidator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "farmer_consolidations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "export_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_contract_networks: {
        Row: {
          contract_terms: string | null
          created_at: string
          crop_focus: string | null
          description: string | null
          id: string
          lead_farmer_id: string | null
          location: string | null
          member_count: number | null
          network_name: string
          status: string | null
          updated_at: string
        }
        Insert: {
          contract_terms?: string | null
          created_at?: string
          crop_focus?: string | null
          description?: string | null
          id?: string
          lead_farmer_id?: string | null
          location?: string | null
          member_count?: number | null
          network_name: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          contract_terms?: string | null
          created_at?: string
          crop_focus?: string | null
          description?: string | null
          id?: string
          lead_farmer_id?: string | null
          location?: string | null
          member_count?: number | null
          network_name?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      farmer_produce: {
        Row: {
          available_from: string | null
          category: string
          county: string
          created_at: string
          description: string | null
          farmer_id: string
          id: string
          images: string[] | null
          is_organic: boolean | null
          name: string
          price_per_unit: number | null
          quality_grade: string | null
          quantity: number
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          available_from?: string | null
          category: string
          county: string
          created_at?: string
          description?: string | null
          farmer_id: string
          id?: string
          images?: string[] | null
          is_organic?: boolean | null
          name: string
          price_per_unit?: number | null
          quality_grade?: string | null
          quantity: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          available_from?: string | null
          category?: string
          county?: string
          created_at?: string
          description?: string | null
          farmer_id?: string
          id?: string
          images?: string[] | null
          is_organic?: boolean | null
          name?: string
          price_per_unit?: number | null
          quality_grade?: string | null
          quantity?: number
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      farmer_protection_warnings: {
        Row: {
          affected_regions: string[] | null
          created_at: string
          description: string
          id: string
          reported_by: string | null
          severity: string
          status: string
          title: string
          updated_at: string
          verified_by: string | null
          warning_type: string
        }
        Insert: {
          affected_regions?: string[] | null
          created_at?: string
          description: string
          id?: string
          reported_by?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
          verified_by?: string | null
          warning_type: string
        }
        Update: {
          affected_regions?: string[] | null
          created_at?: string
          description?: string
          id?: string
          reported_by?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
          verified_by?: string | null
          warning_type?: string
        }
        Relationships: []
      }
      flagged_markets: {
        Row: {
          created_at: string
          id: string
          market_id: string
          reason: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          reason: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          reason?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      food_rescue_claims: {
        Row: {
          claimed_at: string
          claimer_id: string
          completed_at: string | null
          id: string
          listing_id: string
          organization_type: string
          status: string
        }
        Insert: {
          claimed_at?: string
          claimer_id: string
          completed_at?: string | null
          id?: string
          listing_id: string
          organization_type: string
          status?: string
        }
        Update: {
          claimed_at?: string
          claimer_id?: string
          completed_at?: string | null
          id?: string
          listing_id?: string
          organization_type?: string
          status?: string
        }
        Relationships: []
      }
      food_rescue_listings: {
        Row: {
          created_at: string | null
          description: string | null
          donor_id: string
          expiry_date: string | null
          id: string
          pickup_deadline: string | null
          pickup_location: string
          pickup_time_end: string | null
          pickup_time_start: string | null
          product_name: string
          quantity: number
          recipient_id: string | null
          status: string | null
          transport_details: string | null
          transport_provided: boolean | null
          unit: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          donor_id: string
          expiry_date?: string | null
          id?: string
          pickup_deadline?: string | null
          pickup_location: string
          pickup_time_end?: string | null
          pickup_time_start?: string | null
          product_name: string
          quantity: number
          recipient_id?: string | null
          status?: string | null
          transport_details?: string | null
          transport_provided?: boolean | null
          unit: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          donor_id?: string
          expiry_date?: string | null
          id?: string
          pickup_deadline?: string | null
          pickup_location?: string
          pickup_time_end?: string | null
          pickup_time_start?: string | null
          product_name?: string
          quantity?: number
          recipient_id?: string | null
          status?: string | null
          transport_details?: string | null
          transport_provided?: boolean | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_rescue_listings_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_rescue_listings_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "food_rescue_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_rescue_matches: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string
          notes: string | null
          pickup_scheduled_time: string | null
          recipient_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id: string
          notes?: string | null
          pickup_scheduled_time?: string | null
          recipient_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string
          notes?: string | null
          pickup_scheduled_time?: string | null
          recipient_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_rescue_matches_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "food_rescue_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_rescue_matches_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "food_rescue_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      food_rescue_recipients: {
        Row: {
          address: string
          capacity_description: string | null
          contact_person: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          type: string | null
          verification_status: string | null
        }
        Insert: {
          address: string
          capacity_description?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          type?: string | null
          verification_status?: string | null
        }
        Update: {
          address?: string
          capacity_description?: string | null
          contact_person?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          type?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      group_input_orders: {
        Row: {
          coordinator_id: string
          created_at: string | null
          delivery_location: string | null
          description: string | null
          final_price_per_unit: number | null
          id: string
          input_type: string
          order_deadline: string
          status: string | null
          supplier_id: string | null
          target_price_per_unit: number | null
          target_quantity: number
          unit: string
        }
        Insert: {
          coordinator_id: string
          created_at?: string | null
          delivery_location?: string | null
          description?: string | null
          final_price_per_unit?: number | null
          id?: string
          input_type: string
          order_deadline: string
          status?: string | null
          supplier_id?: string | null
          target_price_per_unit?: number | null
          target_quantity: number
          unit: string
        }
        Update: {
          coordinator_id?: string
          created_at?: string | null
          delivery_location?: string | null
          description?: string | null
          final_price_per_unit?: number | null
          id?: string
          input_type?: string
          order_deadline?: string
          status?: string | null
          supplier_id?: string | null
          target_price_per_unit?: number | null
          target_quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_input_orders_coordinator_id_fkey"
            columns: ["coordinator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_input_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_order_participants: {
        Row: {
          commitment_status: string | null
          farmer_id: string
          id: string
          joined_at: string | null
          order_id: string
          quantity_needed: number
        }
        Insert: {
          commitment_status?: string | null
          farmer_id: string
          id?: string
          joined_at?: string | null
          order_id: string
          quantity_needed: number
        }
        Update: {
          commitment_status?: string | null
          farmer_id?: string
          id?: string
          joined_at?: string | null
          order_id?: string
          quantity_needed?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_order_participants_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_order_participants_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "group_input_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      imperfect_surplus_produce: {
        Row: {
          category: string
          condition_notes: string | null
          county: string
          created_at: string
          description: string | null
          discount_percentage: number | null
          discounted_price: number
          expiry_date: string | null
          id: string
          images: string[] | null
          is_organic: boolean | null
          original_price: number | null
          pickup_location: string
          product_name: string
          quantity: number
          reason_for_discount: string | null
          seller_id: string
          status: string
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          condition_notes?: string | null
          county: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          discounted_price: number
          expiry_date?: string | null
          id?: string
          images?: string[] | null
          is_organic?: boolean | null
          original_price?: number | null
          pickup_location: string
          product_name: string
          quantity: number
          reason_for_discount?: string | null
          seller_id: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          condition_notes?: string | null
          county?: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          discounted_price?: number
          expiry_date?: string | null
          id?: string
          images?: string[] | null
          is_organic?: boolean | null
          original_price?: number | null
          pickup_location?: string
          product_name?: string
          quantity?: number
          reason_for_discount?: string | null
          seller_id?: string
          status?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      input_products: {
        Row: {
          category: string
          created_at: string | null
          current_price: number
          description: string | null
          id: string
          images: string[] | null
          product_name: string
          quality_grade: string | null
          specifications: Json | null
          stock_quantity: number | null
          supplier_id: string
          unit: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          current_price: number
          description?: string | null
          id?: string
          images?: string[] | null
          product_name: string
          quality_grade?: string | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id: string
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_price?: number
          description?: string | null
          id?: string
          images?: string[] | null
          product_name?: string
          quality_grade?: string | null
          specifications?: Json | null
          stock_quantity?: number | null
          supplier_id?: string
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "input_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "input_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "input_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "public_input_suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      input_suppliers: {
        Row: {
          business_name: string
          contact_info: Json | null
          coverage_areas: string[] | null
          created_at: string | null
          description: string | null
          id: string
          products_offered: string[] | null
          rating: number | null
          supplier_id: string
          total_reviews: number | null
          verification_status: string | null
        }
        Insert: {
          business_name: string
          contact_info?: Json | null
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          products_offered?: string[] | null
          rating?: number | null
          supplier_id: string
          total_reviews?: number | null
          verification_status?: string | null
        }
        Update: {
          business_name?: string
          contact_info?: Json | null
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          products_offered?: string[] | null
          rating?: number | null
          supplier_id?: string
          total_reviews?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "input_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          buyer_id: string
          created_at: string | null
          delivery_location: string | null
          delivery_required: boolean | null
          id: string
          inquiry_type: string
          message: string
          price_range_max: number | null
          price_range_min: number | null
          product_id: string
          product_type: string
          quantity_requested: number | null
          quote_expiry_date: string | null
          quote_validity_days: number | null
          quoted_price: number | null
          seller_id: string
          seller_response: string | null
          seller_response_date: string | null
          status: string | null
          subject: string
          updated_at: string | null
          urgency: string | null
          viewed_by_seller: boolean | null
          viewed_by_seller_date: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          delivery_location?: string | null
          delivery_required?: boolean | null
          id?: string
          inquiry_type?: string
          message: string
          price_range_max?: number | null
          price_range_min?: number | null
          product_id: string
          product_type: string
          quantity_requested?: number | null
          quote_expiry_date?: string | null
          quote_validity_days?: number | null
          quoted_price?: number | null
          seller_id: string
          seller_response?: string | null
          seller_response_date?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          urgency?: string | null
          viewed_by_seller?: boolean | null
          viewed_by_seller_date?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          delivery_location?: string | null
          delivery_required?: boolean | null
          id?: string
          inquiry_type?: string
          message?: string
          price_range_max?: number | null
          price_range_min?: number | null
          product_id?: string
          product_type?: string
          quantity_requested?: number | null
          quote_expiry_date?: string | null
          quote_validity_days?: number | null
          quoted_price?: number | null
          seller_id?: string
          seller_response?: string | null
          seller_response_date?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          urgency?: string | null
          viewed_by_seller?: boolean | null
          viewed_by_seller_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          created_at: string
          expiry_date: string | null
          farm_id: string
          id: string
          item_name: string
          location: string | null
          notes: string | null
          quantity: number
          status: string
          total_value: number | null
          unit: string
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          expiry_date?: string | null
          farm_id: string
          id?: string
          item_name: string
          location?: string | null
          notes?: string | null
          quantity?: number
          status?: string
          total_value?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          expiry_date?: string | null
          farm_id?: string
          id?: string
          item_name?: string
          location?: string | null
          notes?: string | null
          quantity?: number
          status?: string
          total_value?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      logistics_providers: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_phone: string | null
          coverage_areas: string[] | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number | null
          total_deliveries: number | null
          updated_at: string | null
          user_id: string
          vehicle_types: string[] | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_phone?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_types?: string[] | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_phone?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_types?: string[] | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          commodity_name: string
          county: string
          created_at: string
          date_recorded: string
          id: string
          market_name: string
          price: number
          source: string | null
          unit: string
        }
        Insert: {
          commodity_name: string
          county: string
          created_at?: string
          date_recorded?: string
          id?: string
          market_name: string
          price: number
          source?: string | null
          unit?: string
        }
        Update: {
          commodity_name?: string
          county?: string
          created_at?: string
          date_recorded?: string
          id?: string
          market_name?: string
          price?: number
          source?: string | null
          unit?: string
        }
        Relationships: []
      }
      market_trading_schedules: {
        Row: {
          closing_time: string
          created_at: string | null
          day_of_week: number
          id: string
          is_trading_day: boolean | null
          market_id: string
          opening_time: string
          special_notes: string | null
          updated_at: string | null
        }
        Insert: {
          closing_time: string
          created_at?: string | null
          day_of_week: number
          id?: string
          is_trading_day?: boolean | null
          market_id: string
          opening_time: string
          special_notes?: string | null
          updated_at?: string | null
        }
        Update: {
          closing_time?: string
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_trading_day?: boolean | null
          market_id?: string
          opening_time?: string
          special_notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "market_trading_schedules_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "city_markets"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          conversation_id: string
          created_at: string | null
          deleted_by_receiver: boolean | null
          deleted_by_sender: boolean | null
          file_urls: string[] | null
          id: string
          is_read: boolean | null
          message_text: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          deleted_by_receiver?: boolean | null
          deleted_by_sender?: boolean | null
          file_urls?: string[] | null
          id?: string
          is_read?: boolean | null
          message_text: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          deleted_by_receiver?: boolean | null
          deleted_by_sender?: boolean | null
          file_urls?: string[] | null
          id?: string
          is_read?: boolean | null
          message_text?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          digest_frequency: string | null
          email_notifications: boolean | null
          id: string
          in_app_notifications: boolean | null
          message_notifications: boolean | null
          order_updates: boolean | null
          promotion_notifications: boolean | null
          push_notifications: boolean | null
          review_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          digest_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          message_notifications?: boolean | null
          order_updates?: boolean | null
          promotion_notifications?: boolean | null
          push_notifications?: boolean | null
          review_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          digest_frequency?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          message_notifications?: boolean | null
          order_updates?: boolean | null
          promotion_notifications?: boolean | null
          push_notifications?: boolean | null
          review_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          custom_attributes: Json | null
          id: string
          item_total: number
          order_id: string
          product_id: string
          product_name: string
          product_type: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          custom_attributes?: Json | null
          id?: string
          item_total: number
          order_id: string
          product_id: string
          product_name: string
          product_type: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          custom_attributes?: Json | null
          id?: string
          item_total?: number
          order_id?: string
          product_id?: string
          product_name?: string
          product_type?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_date: string | null
          buyer_id: string
          cancellation_date: string | null
          cancellation_reason: string | null
          created_at: string | null
          delivery_status: string | null
          discount_amount: number | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          order_number: string
          order_status: string | null
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string | null
          seller_id: string
          shipping_address: string
          shipping_city: string | null
          shipping_cost: number | null
          shipping_county: string | null
          shipping_postal_code: string | null
          subtotal: number
          tax: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          buyer_id: string
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_number: string
          order_status?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          seller_id: string
          shipping_address: string
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_county?: string | null
          shipping_postal_code?: string | null
          subtotal: number
          tax?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          buyer_id?: string
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          delivery_status?: string | null
          discount_amount?: number | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          order_number?: string
          order_status?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string | null
          seller_id?: string
          shipping_address?: string
          shipping_city?: string | null
          shipping_cost?: number | null
          shipping_county?: string | null
          shipping_postal_code?: string | null
          subtotal?: number
          tax?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          beneficiary_count: number | null
          completed_rescues: number | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at: string
          description: string | null
          id: string
          org_name: string
          org_type: string
          physical_address: string
          registration_number: string
          rejection_reason: string | null
          service_area: string[] | null
          trust_score: number | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          website: string | null
        }
        Insert: {
          beneficiary_count?: number | null
          completed_rescues?: number | null
          contact_email: string
          contact_person: string
          contact_phone: string
          county: string
          created_at?: string
          description?: string | null
          id?: string
          org_name: string
          org_type: string
          physical_address: string
          registration_number: string
          rejection_reason?: string | null
          service_area?: string[] | null
          trust_score?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Update: {
          beneficiary_count?: number | null
          completed_rescues?: number | null
          contact_email?: string
          contact_person?: string
          contact_phone?: string
          county?: string
          created_at?: string
          description?: string | null
          id?: string
          org_name?: string
          org_type?: string
          physical_address?: string
          registration_number?: string
          rejection_reason?: string | null
          service_area?: string[] | null
          trust_score?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bank_account_number: string | null
          bank_name: string | null
          card_last_4: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          id: string
          mpesa_phone: string | null
          mpesa_receipt_number: string | null
          order_id: string
          payment_gateway_response: Json | null
          payment_method: string
          payment_reference: string | null
          payment_status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_number?: string | null
          bank_name?: string | null
          card_last_4?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          mpesa_phone?: string | null
          mpesa_receipt_number?: string | null
          order_id: string
          payment_gateway_response?: Json | null
          payment_method: string
          payment_reference?: string | null
          payment_status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_number?: string | null
          bank_name?: string | null
          card_last_4?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string
          mpesa_phone?: string | null
          mpesa_receipt_number?: string | null
          order_id?: string
          payment_gateway_response?: Json | null
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reports: {
        Row: {
          action_taken: string | null
          created_at: string
          description: string | null
          id: string
          post_id: string
          report_type: string
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          action_taken?: string | null
          created_at?: string
          description?: string | null
          id?: string
          post_id: string
          report_type: string
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          action_taken?: string | null
          created_at?: string
          description?: string | null
          id?: string
          post_id?: string
          report_type?: string
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: []
      }
      product_auctions: {
        Row: {
          agent_id: string
          auction_end_time: string
          created_at: string | null
          current_highest_bid: number | null
          description: string | null
          id: string
          product_id: string | null
          reserve_price: number | null
          starting_price: number
          status: string | null
          title: string
          winner_id: string | null
        }
        Insert: {
          agent_id: string
          auction_end_time: string
          created_at?: string | null
          current_highest_bid?: number | null
          description?: string | null
          id?: string
          product_id?: string | null
          reserve_price?: number | null
          starting_price: number
          status?: string | null
          title: string
          winner_id?: string | null
        }
        Update: {
          agent_id?: string
          auction_end_time?: string
          created_at?: string | null
          current_highest_bid?: number | null
          description?: string | null
          id?: string
          product_id?: string | null
          reserve_price?: number | null
          starting_price?: number
          status?: string | null
          title?: string
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_auctions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_auctions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "city_market_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_auctions_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string | null
          delivery_rating: number | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          photo_urls: string[] | null
          product_id: string
          product_type: string
          quality_rating: number | null
          rating: number
          review_text: string | null
          review_title: string | null
          reviewer_id: string
          seller_communication_rating: number | null
          seller_response: string | null
          seller_response_date: string | null
          unhelpful_count: number | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_rating?: number | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          photo_urls?: string[] | null
          product_id: string
          product_type: string
          quality_rating?: number | null
          rating: number
          review_text?: string | null
          review_title?: string | null
          reviewer_id: string
          seller_communication_rating?: number | null
          seller_response?: string | null
          seller_response_date?: string | null
          unhelpful_count?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_rating?: number | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          photo_urls?: string[] | null
          product_id?: string
          product_type?: string
          quality_rating?: number | null
          rating?: number
          review_text?: string | null
          review_title?: string | null
          reviewer_id?: string
          seller_communication_rating?: number | null
          seller_response?: string | null
          seller_response_date?: string | null
          unhelpful_count?: number | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_balance: number | null
          address: string | null
          avatar_url: string | null
          average_rating: number | null
          bio: string | null
          business_name: string | null
          business_registration_number: string | null
          city: string | null
          country: string | null
          county: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          kyc_approved_date: string | null
          kyc_status: string | null
          kyc_submitted_date: string | null
          location: string | null
          phone: string | null
          postal_code: string | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          user_type: string | null
          verification_date: string | null
          verification_method: string | null
          verification_status: string | null
          website_url: string | null
        }
        Insert: {
          account_balance?: number | null
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          city?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          kyc_approved_date?: string | null
          kyc_status?: string | null
          kyc_submitted_date?: string | null
          location?: string | null
          phone?: string | null
          postal_code?: string | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_type?: string | null
          verification_date?: string | null
          verification_method?: string | null
          verification_status?: string | null
          website_url?: string | null
        }
        Update: {
          account_balance?: number | null
          address?: string | null
          avatar_url?: string | null
          average_rating?: number | null
          bio?: string | null
          business_name?: string | null
          business_registration_number?: string | null
          city?: string | null
          country?: string | null
          county?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          kyc_approved_date?: string | null
          kyc_status?: string | null
          kyc_submitted_date?: string | null
          location?: string | null
          phone?: string | null
          postal_code?: string | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_type?: string | null
          verification_date?: string | null
          verification_method?: string | null
          verification_status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      resource_usage: {
        Row: {
          created_at: string | null
          efficiency_score: number | null
          farm_id: string
          id: string
          notes: string | null
          quantity: number
          resource_type: string
          total_cost: number
          unit: string
          updated_at: string | null
          usage_date: string
        }
        Insert: {
          created_at?: string | null
          efficiency_score?: number | null
          farm_id: string
          id?: string
          notes?: string | null
          quantity: number
          resource_type: string
          total_cost: number
          unit: string
          updated_at?: string | null
          usage_date: string
        }
        Update: {
          created_at?: string | null
          efficiency_score?: number | null
          farm_id?: string
          id?: string
          notes?: string | null
          quantity?: number
          resource_type?: string
          total_cost?: number
          unit?: string
          updated_at?: string | null
          usage_date?: string
        }
        Relationships: []
      }
      seller_ratings: {
        Row: {
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          rating: number
          review_text: string | null
          review_title: string | null
          reviewer_id: string
          seller_id: string
          seller_response: string | null
          seller_response_date: string | null
          transaction_id: string | null
          unhelpful_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating: number
          review_text?: string | null
          review_title?: string | null
          reviewer_id: string
          seller_id: string
          seller_response?: string | null
          seller_response_date?: string | null
          transaction_id?: string | null
          unhelpful_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number
          review_text?: string | null
          review_title?: string | null
          reviewer_id?: string
          seller_id?: string
          seller_response?: string | null
          seller_response_date?: string | null
          transaction_id?: string | null
          unhelpful_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_ratings_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_ratings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_statistics: {
        Row: {
          average_rating: number | null
          dispute_rate: number | null
          id: string
          last_updated: string | null
          order_completion_rate: number | null
          response_time_hours: number | null
          return_rate: number | null
          seller_id: string
          total_orders: number | null
          total_revenue: number | null
          total_reviews: number | null
        }
        Insert: {
          average_rating?: number | null
          dispute_rate?: number | null
          id?: string
          last_updated?: string | null
          order_completion_rate?: number | null
          response_time_hours?: number | null
          return_rate?: number | null
          seller_id: string
          total_orders?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
        }
        Update: {
          average_rating?: number | null
          dispute_rate?: number | null
          id?: string
          last_updated?: string | null
          order_completion_rate?: number | null
          response_time_hours?: number | null
          return_rate?: number | null
          seller_id?: string
          total_orders?: number | null
          total_revenue?: number | null
          total_reviews?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_statistics_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          booking_date: string
          client_id: string
          created_at: string | null
          details: Json | null
          id: string
          payment_status: string | null
          service_date: string
          service_id: string
          status: string | null
          total_cost: number | null
        }
        Insert: {
          booking_date: string
          client_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          payment_status?: string | null
          service_date: string
          service_id: string
          status?: string | null
          total_cost?: number | null
        }
        Update: {
          booking_date?: string
          client_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          payment_status?: string | null
          service_date?: string
          service_id?: string
          status?: string | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "public_service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          availability_schedule: Json | null
          base_price: number | null
          contact_info: Json | null
          coverage_area: string[] | null
          created_at: string | null
          description: string | null
          id: string
          pricing_model: string | null
          provider_id: string
          rating: number | null
          service_name: string
          service_type: string
          total_reviews: number | null
          verification_status: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          base_price?: number | null
          contact_info?: Json | null
          coverage_area?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_model?: string | null
          provider_id: string
          rating?: number | null
          service_name: string
          service_type: string
          total_reviews?: number | null
          verification_status?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          base_price?: number | null
          contact_info?: Json | null
          coverage_area?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          pricing_model?: string | null
          provider_id?: string
          rating?: number | null
          service_name?: string
          service_type?: string
          total_reviews?: number | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_carts: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          discount_amount: number | null
          id: string
          shipping_cost: number | null
          subtotal: number | null
          tax: number | null
          total_amount: number | null
          total_items: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          shipping_cost?: number | null
          subtotal?: number | null
          tax?: number | null
          total_amount?: number | null
          total_items?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          discount_amount?: number | null
          id?: string
          shipping_cost?: number | null
          subtotal?: number | null
          tax?: number | null
          total_amount?: number | null
          total_items?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_boxes: {
        Row: {
          available_frequencies: string[] | null
          box_name: string
          box_size: string | null
          contents_description: string | null
          created_at: string | null
          current_subscribers: number | null
          description: string | null
          farmer_id: string
          id: string
          image_url: string | null
          is_active: boolean | null
          max_subscribers: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          available_frequencies?: string[] | null
          box_name: string
          box_size?: string | null
          contents_description?: string | null
          created_at?: string | null
          current_subscribers?: number | null
          description?: string | null
          farmer_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_subscribers?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          available_frequencies?: string[] | null
          box_name?: string
          box_size?: string | null
          contents_description?: string | null
          created_at?: string | null
          current_subscribers?: number | null
          description?: string | null
          farmer_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          max_subscribers?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_boxes_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_customizations: {
        Row: {
          allergies: string[] | null
          created_at: string | null
          dietary_restrictions: string[] | null
          exclude_items: string[] | null
          id: string
          include_items: string[] | null
          local_only: boolean | null
          organic_only: boolean | null
          special_requests: string | null
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          exclude_items?: string[] | null
          id?: string
          include_items?: string[] | null
          local_only?: boolean | null
          organic_only?: boolean | null
          special_requests?: string | null
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          exclude_items?: string[] | null
          id?: string
          include_items?: string[] | null
          local_only?: boolean | null
          organic_only?: boolean | null
          special_requests?: string | null
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_customizations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: true
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          box_id: string
          cancellation_reason: string | null
          cancelled_date: string | null
          completed_deliveries: number | null
          created_at: string | null
          frequency: string
          id: string
          next_delivery_date: string | null
          payment_status: string | null
          subscriber_id: string
          subscription_end_date: string | null
          subscription_start_date: string
          subscription_status: string | null
          total_deliveries: number | null
          updated_at: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          box_id: string
          cancellation_reason?: string | null
          cancelled_date?: string | null
          completed_deliveries?: number | null
          created_at?: string | null
          frequency: string
          id?: string
          next_delivery_date?: string | null
          payment_status?: string | null
          subscriber_id: string
          subscription_end_date?: string | null
          subscription_start_date: string
          subscription_status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          box_id?: string
          cancellation_reason?: string | null
          cancelled_date?: string | null
          completed_deliveries?: number | null
          created_at?: string | null
          frequency?: string
          id?: string
          next_delivery_date?: string | null
          payment_status?: string | null
          subscriber_id?: string
          subscription_end_date?: string | null
          subscription_start_date?: string
          subscription_status?: string | null
          total_deliveries?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "subscription_boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_translations: {
        Row: {
          created_at: string
          id: string
          source_language: string
          source_text: string
          target_language: string
          translated_text: string
          translation_service: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          source_language?: string
          source_text: string
          target_language: string
          translated_text: string
          translation_service?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          source_language?: string
          source_text?: string
          target_language?: string
          translated_text?: string
          translation_service?: string
          user_id?: string
        }
        Relationships: []
      }
      warehouses: {
        Row: {
          available_capacity_tons: number
          capacity_tons: number
          contact_person: string | null
          contact_phone: string | null
          county: string
          created_at: string | null
          facilities: string[] | null
          id: string
          is_active: boolean | null
          location: string
          owner_id: string
          price_per_ton_per_day: number | null
          rating: number | null
          storage_types: string[] | null
          updated_at: string | null
          warehouse_name: string
        }
        Insert: {
          available_capacity_tons: number
          capacity_tons: number
          contact_person?: string | null
          contact_phone?: string | null
          county: string
          created_at?: string | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          location: string
          owner_id: string
          price_per_ton_per_day?: number | null
          rating?: number | null
          storage_types?: string[] | null
          updated_at?: string | null
          warehouse_name: string
        }
        Update: {
          available_capacity_tons?: number
          capacity_tons?: number
          contact_person?: string | null
          contact_phone?: string | null
          county?: string
          created_at?: string | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          location?: string
          owner_id?: string
          price_per_ton_per_day?: number | null
          rating?: number | null
          storage_types?: string[] | null
          updated_at?: string | null
          warehouse_name?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          created_at: string | null
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
          created_at?: string | null
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
          created_at?: string | null
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
      weather_impact: {
        Row: {
          created_at: string | null
          date: string
          farm_id: string
          id: string
          impact_score: number | null
          notes: string | null
          rainfall: number
          soil_moisture: number
          temperature: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          farm_id: string
          id?: string
          impact_score?: number | null
          notes?: string | null
          rainfall: number
          soil_moisture: number
          temperature: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          farm_id?: string
          id?: string
          impact_score?: number | null
          notes?: string | null
          rainfall?: number
          soil_moisture?: number
          temperature?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          current_price: number | null
          date_saved: string | null
          id: string
          notes: string | null
          price_at_save: number | null
          product_id: string
          product_image_url: string | null
          product_name: string
          product_type: string
          seller_id: string | null
          wishlist_id: string
        }
        Insert: {
          current_price?: number | null
          date_saved?: string | null
          id?: string
          notes?: string | null
          price_at_save?: number | null
          product_id: string
          product_image_url?: string | null
          product_name: string
          product_type: string
          seller_id?: string | null
          wishlist_id: string
        }
        Update: {
          current_price?: number | null
          date_saved?: string | null
          id?: string
          notes?: string | null
          price_at_save?: number | null
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          product_type?: string
          seller_id?: string | null
          wishlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_wishlist_id_fkey"
            columns: ["wishlist_id"]
            isOneToOne: false
            referencedRelation: "wishlists"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_input_suppliers: {
        Row: {
          business_name: string | null
          coverage_areas: string[] | null
          created_at: string | null
          description: string | null
          id: string | null
          products_offered: string[] | null
          rating: number | null
          total_reviews: number | null
          verification_status: string | null
        }
        Insert: {
          business_name?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          products_offered?: string[] | null
          rating?: number | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Update: {
          business_name?: string | null
          coverage_areas?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          products_offered?: string[] | null
          rating?: number | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Relationships: []
      }
      public_service_providers: {
        Row: {
          base_price: number | null
          coverage_area: string[] | null
          created_at: string | null
          description: string | null
          id: string | null
          pricing_model: string | null
          rating: number | null
          service_name: string | null
          service_type: string | null
          total_reviews: number | null
          verification_status: string | null
        }
        Insert: {
          base_price?: number | null
          coverage_area?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          pricing_model?: string | null
          rating?: number | null
          service_name?: string | null
          service_type?: string | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Update: {
          base_price?: number | null
          coverage_area?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          pricing_model?: string | null
          rating?: number | null
          service_name?: string | null
          service_type?: string | null
          total_reviews?: number | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_roles: { Args: { _user_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "farmer" | "exporter" | "service_provider" | "guest"
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
      app_role: ["admin", "farmer", "exporter", "service_provider", "guest"],
    },
  },
} as const

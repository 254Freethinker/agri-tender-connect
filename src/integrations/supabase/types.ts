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
      food_rescue_listings: {
        Row: {
          created_at: string | null
          description: string | null
          donor_id: string
          expiry_date: string | null
          id: string
          pickup_location: string
          pickup_time_end: string | null
          pickup_time_start: string | null
          product_name: string
          quantity: number
          recipient_id: string | null
          status: string | null
          unit: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          donor_id: string
          expiry_date?: string | null
          id?: string
          pickup_location: string
          pickup_time_end?: string | null
          pickup_time_start?: string | null
          product_name: string
          quantity: number
          recipient_id?: string | null
          status?: string | null
          unit: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          donor_id?: string
          expiry_date?: string | null
          id?: string
          pickup_location?: string
          pickup_time_end?: string | null
          pickup_time_start?: string | null
          product_name?: string
          quantity?: number
          recipient_id?: string | null
          status?: string | null
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string | null
          user_type: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string | null
          user_type?: string | null
          verification_status?: string | null
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
      get_user_roles: {
        Args: { _user_id: string }
        Returns: string[]
      }
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

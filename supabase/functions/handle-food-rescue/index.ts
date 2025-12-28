import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const CreateListingSchema = z.object({
  donor_id: z.string().uuid(),
  product_name: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  quantity: z.number().positive(),
  unit: z.string().min(1).max(50),
  pickup_location: z.string().min(5).max(500),
  pickup_county: z.string().min(2).max(100).optional(),
  expiry_date: z.string().optional(),
  pickup_deadline: z.string().optional(),
  pickup_time_start: z.string().optional(),
  pickup_time_end: z.string().optional(),
  transport_provided: z.boolean().optional(),
  transport_details: z.string().max(500).optional(),
});

const ClaimListingSchema = z.object({
  listing_id: z.string().uuid(),
  claimer_id: z.string().uuid(),
  organization_type: z.enum(['school', 'cbo', 'hospital', 'ngo', 'charity', 'community_kitchen', 'shelter', 'other']),
});

const UpdateStatusSchema = z.object({
  listing_id: z.string().uuid(),
  status: z.enum(['available', 'claimed', 'picked_up', 'delivered', 'expired', 'cancelled']),
  notes: z.string().max(500).optional(),
});

const NotifyTransportersSchema = z.object({
  listing_id: z.string().uuid().optional(),
  pickup_county: z.string().min(2).max(100),
  product_name: z.string().max(255).optional(),
  quantity: z.number().positive().optional(),
});

// Helper to get current authenticated user
async function getAuthenticatedUser(supabaseClient: any) {
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const body = await req.json();
    const { action, data } = body;

    if (!action || !data) {
      throw new Error("Missing action or data");
    }

    switch (action) {
      case "create_listing":
        return await createListing(supabaseClient, data);
      case "claim_listing":
        return await claimListing(supabaseClient, data);
      case "update_status":
        return await updateStatus(supabaseClient, data);
      case "notify_transporters":
        return await notifyTransporters(supabaseClient, data);
      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Handle food rescue error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function createListing(supabaseClient: any, data: any) {
  // Validate input
  const validated = CreateListingSchema.parse(data);
  
  // Ensure user is authenticated
  const user = await getAuthenticatedUser(supabaseClient);
  
  // Ensure donor_id matches authenticated user
  if (validated.donor_id !== user.id) {
    throw new Error("Cannot create listing for another user");
  }

  const { data: listing, error } = await supabaseClient
    .from("food_rescue_listings")
    .insert({
      ...validated,
      status: "available",
    })
    .select()
    .single();

  if (error) {
    console.error("Create listing error:", error);
    throw new Error("Failed to create listing");
  }

  // If transport is needed, notify transporters
  if (!validated.transport_provided && validated.pickup_county) {
    await notifyTransporters(supabaseClient, { 
      listing_id: listing.id, 
      pickup_county: validated.pickup_county,
      product_name: validated.product_name,
      quantity: validated.quantity,
    });
  }

  return new Response(JSON.stringify({ listing }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function claimListing(supabaseClient: any, data: any) {
  // Validate input
  const validated = ClaimListingSchema.parse(data);
  
  // Ensure user is authenticated
  const user = await getAuthenticatedUser(supabaseClient);
  
  // Ensure claimer_id matches authenticated user
  if (validated.claimer_id !== user.id) {
    throw new Error("Cannot claim listing for another user");
  }

  const { data: updated, error } = await supabaseClient
    .from("food_rescue_listings")
    .update({
      claimed_by: validated.claimer_id,
      status: "claimed",
      claimed_at: new Date().toISOString(),
    })
    .eq("id", validated.listing_id)
    .eq("status", "available")
    .select()
    .single();

  if (error) {
    console.error("Claim listing error:", error);
    throw new Error("Failed to claim listing - it may already be claimed");
  }

  console.log("Listing claimed:", { 
    listing_id: validated.listing_id, 
    claimer_id: validated.claimer_id,
    organization_type: validated.organization_type 
  });

  return new Response(JSON.stringify({ listing: updated }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateStatus(supabaseClient: any, data: any) {
  // Validate input
  const validated = UpdateStatusSchema.parse(data);
  
  // Ensure user is authenticated
  const user = await getAuthenticatedUser(supabaseClient);

  // Get the listing to verify ownership
  const { data: existingListing, error: fetchError } = await supabaseClient
    .from("food_rescue_listings")
    .select("donor_id, claimed_by")
    .eq("id", validated.listing_id)
    .single();

  if (fetchError || !existingListing) {
    throw new Error("Listing not found");
  }

  // Only donor or claimer can update status
  if (existingListing.donor_id !== user.id && existingListing.claimed_by !== user.id) {
    throw new Error("Not authorized to update this listing");
  }

  const updateData: Record<string, any> = { status: validated.status };
  if (validated.notes) {
    updateData.notes = validated.notes;
  }

  const { data: updated, error } = await supabaseClient
    .from("food_rescue_listings")
    .update(updateData)
    .eq("id", validated.listing_id)
    .select()
    .single();

  if (error) {
    console.error("Update status error:", error);
    throw new Error("Failed to update listing status");
  }

  return new Response(JSON.stringify({ listing: updated }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function notifyTransporters(supabaseClient: any, data: any) {
  // Validate input
  const validated = NotifyTransportersSchema.parse(data);

  // Get transporters in the pickup county
  const { data: transporters } = await supabaseClient
    .from("delivery_requests")
    .select("requester_id")
    .eq("pickup_county", validated.pickup_county)
    .limit(10);

  // TODO: Send push notifications or SMS to transporters
  console.log("Notifying transporters:", { 
    county: validated.pickup_county,
    transporter_count: transporters?.length || 0 
  });

  return new Response(
    JSON.stringify({ message: "Transporters notified", count: transporters?.length || 0 }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { action, data } = await req.json();

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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function createListing(supabaseClient: any, data: any) {
  const { data: listing, error } = await supabaseClient
    .from("food_rescue_listings")
    .insert({
      ...data,
      status: "available",
    })
    .select()
    .single();

  if (error) throw error;

  // If transport is needed, notify transporters
  if (!data.transport_provided) {
    await notifyTransporters(supabaseClient, { listing_id: listing.id, ...data });
  }

  return new Response(JSON.stringify({ listing }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function claimListing(supabaseClient: any, data: any) {
  const { listing_id, claimer_id, organization_type } = data;

  const { data: updated, error } = await supabaseClient
    .from("food_rescue_listings")
    .update({
      claimed_by: claimer_id,
      status: "claimed",
      claimed_at: new Date().toISOString(),
    })
    .eq("id", listing_id)
    .eq("status", "available")
    .select()
    .single();

  if (error) throw error;

  // Send notification to donor
  // TODO: Implement notification system

  return new Response(JSON.stringify({ listing: updated }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateStatus(supabaseClient: any, data: any) {
  const { listing_id, status, notes } = data;

  const { data: updated, error } = await supabaseClient
    .from("food_rescue_listings")
    .update({ status, notes })
    .eq("id", listing_id)
    .select()
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({ listing: updated }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function notifyTransporters(supabaseClient: any, data: any) {
  // Get transporters in the pickup county
  const { data: transporters } = await supabaseClient
    .from("delivery_requests")
    .select("requester_id")
    .eq("pickup_county", data.pickup_county)
    .limit(10);

  // TODO: Send push notifications or SMS to transporters
  console.log("Notifying transporters:", transporters);

  return new Response(
    JSON.stringify({ message: "Transporters notified", count: transporters?.length || 0 }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

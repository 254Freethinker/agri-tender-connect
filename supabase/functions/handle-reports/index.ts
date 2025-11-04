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
      case "create_report":
        return await createReport(supabaseClient, data);
      case "update_report":
        return await updateReport(supabaseClient, data);
      case "ban_user":
        return await banUser(supabaseClient, data);
      case "verify_organization":
        return await verifyOrganization(supabaseClient, data);
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

async function createReport(supabaseClient: any, data: any) {
  const { reported_by, reported_user_id, reported_post_id, reason, details } = data;

  // Create report record (assuming community_reports table exists or will be created)
  const reportData = {
    reported_by,
    reported_user_id,
    reported_post_id,
    reason,
    details,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  // For now, store in a temporary structure or log
  console.log("Report created:", reportData);

  // TODO: Store in community_reports table when created
  // const { data: report, error } = await supabaseClient
  //   .from("community_reports")
  //   .insert(reportData)
  //   .select()
  //   .single();

  return new Response(
    JSON.stringify({ 
      message: "Report submitted successfully",
      report: reportData 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

async function updateReport(supabaseClient: any, data: any) {
  const { report_id, status, resolution_notes, resolved_by } = data;

  // TODO: Update community_reports table when created
  console.log("Updating report:", { report_id, status, resolution_notes });

  return new Response(
    JSON.stringify({ 
      message: "Report updated successfully",
      report_id,
      status 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

async function banUser(supabaseClient: any, data: any) {
  const { user_id, banned_by, reason, duration_days } = data;

  // Create ban recommendation
  const { data: ban, error } = await supabaseClient
    .from("ban_recommendations")
    .insert({
      user_id,
      market_id: "platform",
      reason,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;

  // TODO: Implement actual user suspension in auth system
  console.log("User banned:", { user_id, reason, duration_days });

  return new Response(JSON.stringify({ ban }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function verifyOrganization(supabaseClient: any, data: any) {
  const { organization_id, verified_by, verification_status, notes } = data;

  // Update carbon credit provider verification
  const { data: provider, error } = await supabaseClient
    .from("carbon_credit_providers")
    .update({
      verification_status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", organization_id)
    .select()
    .single();

  if (error) throw error;

  // Send notification to organization
  console.log("Organization verified:", { organization_id, verification_status });

  return new Response(JSON.stringify({ provider }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

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
      case "apply_contract":
        return await applyContract(supabaseClient, data);
      case "update_milestone":
        return await updateMilestone(supabaseClient, data);
      case "release_payment":
        return await releasePayment(supabaseClient, data);
      case "raise_dispute":
        return await raiseDispute(supabaseClient, data);
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

async function applyContract(supabaseClient: any, data: any) {
  const { contract_id, farmer_id } = data;

  const { data: contract, error } = await supabaseClient
    .from("contract_farming")
    .update({
      farmer_id,
      status: "active",
    })
    .eq("id", contract_id)
    .eq("status", "open")
    .select()
    .single();

  if (error) throw error;

  // Send notification to buyer
  // TODO: Implement notification system

  return new Response(JSON.stringify({ contract }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateMilestone(supabaseClient: any, data: any) {
  const { milestone_id, status, notes, verified_by } = data;

  const { data: milestone, error } = await supabaseClient
    .from("contract_milestones")
    .update({
      status,
      notes,
      verified_by,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", milestone_id)
    .select()
    .single();

  if (error) throw error;

  // If milestone completed, trigger payment release
  if (status === "completed" && milestone.payment_amount) {
    await releasePayment(supabaseClient, {
      milestone_id,
      amount: milestone.payment_amount,
    });
  }

  return new Response(JSON.stringify({ milestone }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function releasePayment(supabaseClient: any, data: any) {
  const { milestone_id, amount } = data;

  // Get milestone and contract details
  const { data: milestone } = await supabaseClient
    .from("contract_milestones")
    .select("*, contract_farming(*)")
    .eq("id", milestone_id)
    .single();

  if (!milestone) throw new Error("Milestone not found");

  // Create payment record
  const { data: payment, error } = await supabaseClient
    .from("contract_payments")
    .insert({
      contract_id: milestone.contract_id,
      milestone_id,
      amount,
      payment_type: "milestone",
      status: "released",
      paid_by: milestone.contract_farming.buyer_id,
      paid_to: milestone.contract_farming.farmer_id,
      released_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Update milestone payment status
  await supabaseClient
    .from("contract_milestones")
    .update({ payment_status: "paid" })
    .eq("id", milestone_id);

  // TODO: Trigger actual M-Pesa payment

  return new Response(JSON.stringify({ payment }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function raiseDispute(supabaseClient: any, data: any) {
  const { contract_id, raised_by, dispute_type, description, evidence_urls } = data;

  const { data: dispute, error } = await supabaseClient
    .from("contract_disputes")
    .insert({
      contract_id,
      raised_by,
      dispute_type,
      description,
      evidence_urls,
      status: "open",
    })
    .select()
    .single();

  if (error) throw error;

  // Notify both parties and admin
  // TODO: Implement notification system

  return new Response(JSON.stringify({ dispute }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

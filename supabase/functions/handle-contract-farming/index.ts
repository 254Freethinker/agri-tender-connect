import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const ApplyContractSchema = z.object({
  contract_id: z.string().uuid(),
  farmer_id: z.string().uuid(),
});

const UpdateMilestoneSchema = z.object({
  milestone_id: z.string().uuid(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  notes: z.string().max(1000).optional(),
  verified_by: z.string().max(255).optional(),
});

const ReleasePaymentSchema = z.object({
  milestone_id: z.string().uuid(),
  amount: z.number().positive(),
});

const RaiseDisputeSchema = z.object({
  contract_id: z.string().uuid(),
  raised_by: z.string().uuid(),
  dispute_type: z.enum(['quality', 'delivery', 'payment', 'breach', 'other']),
  description: z.string().min(20).max(2000),
  evidence_urls: z.array(z.string().url()).max(10).optional(),
});

// Helper to get current authenticated user
async function getAuthenticatedUser(supabaseClient: any) {
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

// Helper to verify user is party to contract
async function requireContractParty(supabaseClient: any, contractId: string) {
  const user = await getAuthenticatedUser(supabaseClient);

  const { data: contract, error } = await supabaseClient
    .from('contract_farming')
    .select('buyer_id, farmer_id')
    .eq('id', contractId)
    .single();

  if (error || !contract) {
    throw new Error('Contract not found');
  }
  
  const isParty = contract.buyer_id === user.id || contract.farmer_id === user.id;
  if (!isParty) {
    throw new Error('Not authorized for this contract');
  }
  
  return { user, contract };
}

// Helper to verify user is buyer of contract
async function requireContractBuyer(supabaseClient: any, contractId: string) {
  const user = await getAuthenticatedUser(supabaseClient);

  const { data: contract, error } = await supabaseClient
    .from('contract_farming')
    .select('buyer_id, farmer_id')
    .eq('id', contractId)
    .single();

  if (error || !contract) {
    throw new Error('Contract not found');
  }
  
  if (contract.buyer_id !== user.id) {
    throw new Error('Only the buyer can perform this action');
  }
  
  return { user, contract };
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
  } catch (error: unknown) {
    console.error("Handle contract farming error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function applyContract(supabaseClient: any, data: any) {
  // Validate input
  const validated = ApplyContractSchema.parse(data);
  
  // Ensure user is authenticated and is the farmer applying
  const user = await getAuthenticatedUser(supabaseClient);
  
  if (validated.farmer_id !== user.id) {
    throw new Error("Cannot apply to contract for another user");
  }

  const { data: contract, error } = await supabaseClient
    .from("contract_farming")
    .update({
      farmer_id: validated.farmer_id,
      status: "active",
    })
    .eq("id", validated.contract_id)
    .eq("status", "open")
    .select()
    .single();

  if (error) {
    console.error("Apply contract error:", error);
    throw new Error("Failed to apply to contract");
  }

  console.log("Farmer applied to contract:", { 
    contract_id: validated.contract_id, 
    farmer_id: validated.farmer_id 
  });

  return new Response(JSON.stringify({ contract }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function updateMilestone(supabaseClient: any, data: any) {
  // Validate input
  const validated = UpdateMilestoneSchema.parse(data);

  // Get milestone to find contract_id
  const { data: milestone, error: fetchError } = await supabaseClient
    .from("contract_milestones")
    .select("contract_id, payment_amount")
    .eq("id", validated.milestone_id)
    .single();

  if (fetchError || !milestone) {
    throw new Error("Milestone not found");
  }

  // Verify user is party to the contract
  await requireContractParty(supabaseClient, milestone.contract_id);

  const updateData: Record<string, any> = {
    status: validated.status,
    completed_at: validated.status === "completed" ? new Date().toISOString() : null,
  };
  
  if (validated.notes) {
    updateData.notes = validated.notes;
  }
  if (validated.verified_by) {
    updateData.verified_by = validated.verified_by;
  }

  const { data: updatedMilestone, error } = await supabaseClient
    .from("contract_milestones")
    .update(updateData)
    .eq("id", validated.milestone_id)
    .select()
    .single();

  if (error) {
    console.error("Update milestone error:", error);
    throw new Error("Failed to update milestone");
  }

  // If milestone completed and has payment amount, trigger payment release
  if (validated.status === "completed" && milestone.payment_amount) {
    await releasePayment(supabaseClient, {
      milestone_id: validated.milestone_id,
      amount: milestone.payment_amount,
    });
  }

  return new Response(JSON.stringify({ milestone: updatedMilestone }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function releasePayment(supabaseClient: any, data: any) {
  // Validate input
  const validated = ReleasePaymentSchema.parse(data);

  // Get milestone and contract details
  const { data: milestone, error: fetchError } = await supabaseClient
    .from("contract_milestones")
    .select("*, contract_farming(*)")
    .eq("id", validated.milestone_id)
    .single();

  if (fetchError || !milestone) {
    throw new Error("Milestone not found");
  }

  // Verify user is the buyer (only buyer can release payments)
  await requireContractBuyer(supabaseClient, milestone.contract_id);

  // Create payment record
  const { data: payment, error } = await supabaseClient
    .from("contract_payments")
    .insert({
      contract_id: milestone.contract_id,
      milestone_id: validated.milestone_id,
      amount: validated.amount,
      payment_type: "milestone",
      status: "released",
      paid_by: milestone.contract_farming.buyer_id,
      paid_to: milestone.contract_farming.farmer_id,
      released_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Release payment error:", error);
    throw new Error("Failed to release payment");
  }

  // Update milestone payment status
  await supabaseClient
    .from("contract_milestones")
    .update({ payment_status: "paid" })
    .eq("id", validated.milestone_id);

  console.log("Payment released:", { 
    milestone_id: validated.milestone_id, 
    amount: validated.amount 
  });

  return new Response(JSON.stringify({ payment }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function raiseDispute(supabaseClient: any, data: any) {
  // Validate input
  const validated = RaiseDisputeSchema.parse(data);
  
  // Ensure user is authenticated and is the one raising the dispute
  const user = await getAuthenticatedUser(supabaseClient);
  
  if (validated.raised_by !== user.id) {
    throw new Error("Cannot raise dispute for another user");
  }

  // Verify user is party to the contract
  await requireContractParty(supabaseClient, validated.contract_id);

  const { data: dispute, error } = await supabaseClient
    .from("contract_disputes")
    .insert({
      contract_id: validated.contract_id,
      raised_by: validated.raised_by,
      dispute_type: validated.dispute_type,
      description: validated.description,
      evidence_urls: validated.evidence_urls || [],
      status: "open",
    })
    .select()
    .single();

  if (error) {
    console.error("Raise dispute error:", error);
    throw new Error("Failed to raise dispute");
  }

  console.log("Dispute raised:", { 
    contract_id: validated.contract_id, 
    raised_by: validated.raised_by,
    dispute_type: validated.dispute_type 
  });

  return new Response(JSON.stringify({ dispute }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

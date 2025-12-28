import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const CreateReportSchema = z.object({
  reported_by: z.string().uuid(),
  reported_user_id: z.string().uuid().optional(),
  reported_post_id: z.string().uuid().optional(),
  reason: z.string().min(5).max(500),
  details: z.string().max(2000).optional(),
});

const UpdateReportSchema = z.object({
  report_id: z.string().uuid(),
  status: z.enum(['pending', 'under_review', 'resolved', 'dismissed']),
  resolution_notes: z.string().max(2000).optional(),
  resolved_by: z.string().uuid().optional(),
});

const BanUserSchema = z.object({
  user_id: z.string().uuid(),
  banned_by: z.string().uuid().optional(),
  reason: z.string().min(5).max(500),
  duration_days: z.number().int().positive().max(365).optional(),
});

const VerifyOrgSchema = z.object({
  organization_id: z.string().uuid(),
  verified_by: z.string().uuid().optional(),
  verification_status: z.enum(['pending', 'verified', 'rejected']),
  notes: z.string().max(1000).optional(),
});

// Helper to require admin role
async function requireAdmin(supabaseClient: any) {
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
  
  if (authError || !user) {
    throw new Error('Authentication required');
  }

  // Check user_roles table for admin role
  const { data: roles, error: roleError } = await supabaseClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (roleError) {
    console.error('Role check error:', roleError);
    throw new Error('Failed to verify permissions');
  }

  if (!roles) {
    throw new Error('Admin access required');
  }
  
  return user;
}

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
    console.error("Handle reports error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function createReport(supabaseClient: any, data: any) {
  // Validate input
  const validated = CreateReportSchema.parse(data);
  
  // Ensure user is authenticated
  const user = await getAuthenticatedUser(supabaseClient);
  
  // Ensure reporter is the authenticated user
  if (validated.reported_by !== user.id) {
    throw new Error("Cannot create report for another user");
  }

  const reportData = {
    reported_by: validated.reported_by,
    reported_user_id: validated.reported_user_id,
    reported_post_id: validated.reported_post_id,
    reason: validated.reason,
    details: validated.details,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  const { data: report, error } = await supabaseClient
    .from("community_reports")
    .insert(reportData)
    .select()
    .single();

  if (error) {
    console.error("Create report error:", error);
    throw new Error("Failed to create report");
  }

  return new Response(
    JSON.stringify({ 
      message: "Report submitted successfully",
      report 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

async function updateReport(supabaseClient: any, data: any) {
  // Validate input
  const validated = UpdateReportSchema.parse(data);
  
  // Require admin role for updating reports
  const admin = await requireAdmin(supabaseClient);

  const updateData: Record<string, any> = {
    status: validated.status,
  };
  
  if (validated.resolution_notes) {
    updateData.resolution_notes = validated.resolution_notes;
  }
  
  if (validated.status === 'resolved' || validated.status === 'dismissed') {
    updateData.resolved_by = admin.id;
    updateData.resolved_at = new Date().toISOString();
  }

  const { data: report, error } = await supabaseClient
    .from("community_reports")
    .update(updateData)
    .eq("id", validated.report_id)
    .select()
    .single();

  if (error) {
    console.error("Update report error:", error);
    throw new Error("Failed to update report");
  }

  return new Response(
    JSON.stringify({ 
      message: "Report updated successfully",
      report 
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

async function banUser(supabaseClient: any, data: any) {
  // Validate input
  const validated = BanUserSchema.parse(data);
  
  // Require admin role
  const admin = await requireAdmin(supabaseClient);

  // Create ban recommendation
  const { data: ban, error } = await supabaseClient
    .from("ban_recommendations")
    .insert({
      user_id: validated.user_id,
      market_id: "platform",
      reason: validated.reason,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Ban user error:", error);
    throw new Error("Failed to ban user");
  }

  console.log("User banned by admin:", { 
    banned_user: validated.user_id, 
    admin_id: admin.id,
    reason: validated.reason, 
    duration_days: validated.duration_days 
  });

  return new Response(JSON.stringify({ ban }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

async function verifyOrganization(supabaseClient: any, data: any) {
  // Validate input
  const validated = VerifyOrgSchema.parse(data);
  
  // Require admin role
  const admin = await requireAdmin(supabaseClient);

  // Update carbon credit provider verification
  const { data: provider, error } = await supabaseClient
    .from("carbon_credit_providers")
    .update({
      verification_status: validated.verification_status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", validated.organization_id)
    .select()
    .single();

  if (error) {
    console.error("Verify org error:", error);
    throw new Error("Failed to verify organization");
  }

  console.log("Organization verified by admin:", { 
    organization_id: validated.organization_id, 
    admin_id: admin.id,
    status: validated.verification_status 
  });

  return new Response(JSON.stringify({ provider }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}

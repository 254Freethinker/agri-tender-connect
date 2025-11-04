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
    const { notification_type, user_id, title, body, data } = await req.json();

    // TODO: Implement push notification service (Firebase, OneSignal, etc.)
    console.log("Sending notification:", {
      notification_type,
      user_id,
      title,
      body,
      data,
    });

    // For now, log notifications
    const notification = {
      notification_type,
      user_id,
      title,
      body,
      data,
      sent_at: new Date().toISOString(),
      status: "sent",
    };

    return new Response(JSON.stringify({ notification }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

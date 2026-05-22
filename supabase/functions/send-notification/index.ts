import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildMessage(template: string, data: Record<string, unknown>) {
  if (template === "new_message") {
    const senderName = String(data.senderName || "Someone");
    const listingName = data.listingName ? ` about ${data.listingName}` : "";
    return {
      title: "New message",
      message: `${senderName} sent you a message${listingName}.`,
    };
  }

  return {
    title: "InviteGenie notification",
    message: `New ${template.replaceAll("_", " ")} update.`,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase function environment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { userId, channel = "in_app", template = "general", data = {} } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const content = buildMessage(String(template), data);
    const { error } = await admin.from("notifications").insert({
      user_id: String(userId),
      type: String(template),
      title: content.title,
      message: content.message,
      channel: String(channel),
      status: channel === "in_app" ? "sent" : "queued_demo",
      data,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

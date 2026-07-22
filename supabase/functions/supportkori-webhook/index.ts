import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const body = await req.json();
    console.log("RECEIVED WEBHOOK PAYLOAD:", JSON.stringify(body, null, 2));
    
    // Check if it's a SupportKori payload
    if (body.data && body.data.buyerName !== undefined) {
      const donorName = body.data.buyerName;
      
      // Format the amount (e.g. 0 -> ৳0)
      const amountValue = body.data.amount;
      const currency = body.data.currency === "BDT" ? "৳" : (body.data.currency + " ");
      const amount = `${currency}${amountValue}`;
      
      const userMessage = body.data.message || "";

      // Insert into Supabase
      const { error } = await supabase.from('donations').insert([
        {
          donor_name: donorName,
          amount: amount,
          message: userMessage,
        }
      ]);

      if (error) {
        console.error("Error inserting donation:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      console.log(`Successfully saved donation from ${donorName}`);
    } else {
      console.log("Ignored payload - not a valid donation object");
    }

    // Always return 200 so the provider doesn't retry
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Error", { status: 400 });
  }
});

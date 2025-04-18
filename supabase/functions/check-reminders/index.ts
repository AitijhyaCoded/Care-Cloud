
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get unsent reminders for today
    const { data: reminders, error: fetchError } = await supabaseClient
      .from('reminders')
      .select('*')
      .eq('date', new Date().toISOString().split('T')[0])
      .eq('sent', false)

    if (fetchError) throw fetchError

    for (const reminder of reminders || []) {
      // In a real implementation, send email here
      console.log(`Would send reminder for: ${reminder.title} to ${reminder.email}`)
      
      // Mark reminder as sent
      const { error: updateError } = await supabaseClient
        .from('reminders')
        .update({ sent: true })
        .eq('id', reminder.id)

      if (updateError) throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, processedCount: reminders?.length || 0 }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
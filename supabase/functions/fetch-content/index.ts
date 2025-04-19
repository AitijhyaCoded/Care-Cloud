
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY') || "AIzaSyBOVifXaYYsv78ZUcoFEZ0_9SvfycvMd8s";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contentType, mood } = await req.json();
    
    // Use Gemini to find free resources
    const generativeAI = async (prompt: string) => {
      try {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          }
        );
        
        const data = await response.json();
        const result = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return result;
      } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
      }
    };
    
    let moodDescription;
    switch (Number(mood) || 2) {
      case 0: moodDescription = "very low/depressed"; break;
      case 1: moodDescription = "down/sad"; break;
      case 2: moodDescription = "neutral"; break;
      case 3: moodDescription = "good/happy"; break;
      case 4: moodDescription = "great/excellent"; break;
      default: moodDescription = "neutral";
    }
    
    let results;
    let tableName;
    
    if (contentType === 'meditation') {
      tableName = 'meditations';
      const prompt = `
        Find 5 free meditation resources available online. For each, provide:
        1. A title
        2. A short description (max 100 characters)
        3. An estimate of duration (e.g., "10 min")
        4. A category (e.g., "Sleep", "Mindfulness", "Anxiety")
        
        These should be particularly helpful for someone feeling ${moodDescription}.
        Format your response as JSON ONLY with no other text, in this exact structure:
        [
          {
            "title": "Meditation Name",
            "description": "Brief description",
            "duration": "X min",
            "category": "Category name"
          }
        ]
      `;
      
      const jsonString = await generativeAI(prompt);
      try {
        results = JSON.parse(jsonString);
      } catch (e) {
        // If parsing fails, extract JSON portion
        const jsonMatch = jsonString.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      }
    } else if (contentType === 'book') {
      tableName = 'books';
      const prompt = `
        Find 5 free books available in the public domain or legally free online. For each, provide:
        1. A title
        2. A short description (max 100 characters)
        3. An estimated reading time (e.g., "2 hours")
        
        These should be particularly helpful for someone feeling ${moodDescription}.
        Format your response as JSON ONLY with no other text, in this exact structure:
        [
          {
            "title": "Book Title",
            "description": "Brief description",
            "duration": "X hours"
          }
        ]
      `;
      
      const jsonString = await generativeAI(prompt);
      try {
        results = JSON.parse(jsonString);
      } catch (e) {
        // If parsing fails, extract JSON portion
        const jsonMatch = jsonString.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      }
    } else if (contentType === 'podcast') {
      tableName = 'podcasts';
      const prompt = `
        Find 5 free podcasts available online. For each, provide:
        1. A title
        2. A short description (max 100 characters)
        3. The typical episode duration (e.g., "30 min episodes")
        
        These should be particularly helpful for someone feeling ${moodDescription}.
        Format your response as JSON ONLY with no other text, in this exact structure:
        [
          {
            "title": "Podcast Title",
            "description": "Brief description",
            "duration": "X min episodes"
          }
        ]
      `;
      
      const jsonString = await generativeAI(prompt);
      try {
        results = JSON.parse(jsonString);
      } catch (e) {
        // If parsing fails, extract JSON portion
        const jsonMatch = jsonString.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      }
    } else if (contentType === 'game') {
      tableName = 'games';
      const prompt = `
        Find 5 free online games that don't require app install. For each, provide:
        1. A title
        2. A short description (max 100 characters)
        3. The typical game duration (e.g., "10-15 min")
        
        These should be particularly helpful for someone feeling ${moodDescription}.
        Format your response as JSON ONLY with no other text, in this exact structure:
        [
          {
            "title": "Game Title",
            "description": "Brief description",
            "duration": "X min"
          }
        ]
      `;
      
      const jsonString = await generativeAI(prompt);
      try {
        results = JSON.parse(jsonString);
      } catch (e) {
        // If parsing fails, extract JSON portion
        const jsonMatch = jsonString.match(/\[\s*\{.*\}\s*\]/s);
        if (jsonMatch) {
          results = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse Gemini response as JSON');
        }
      }
    } else {
      throw new Error(`Invalid content type: ${contentType}`);
    }
    
    // Add the for_mood field to each item
    const resultsWithMood = results.map((item: any) => ({
      ...item,
      for_mood: [Number(mood) || 2]
    }));
    
    // Delete existing items for this mood in the table
    await supabaseClient
      .from(tableName)
      .delete()
      .filter('for_mood', 'cs', `{${Number(mood) || 2}}`);
    
    // Store results in the appropriate Supabase table
    const { error } = await supabaseClient
      .from(tableName)
      .insert(resultsWithMood);
    
    if (error) throw error;
    
    return new Response(
      JSON.stringify({ success: true, results: resultsWithMood }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in fetch-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
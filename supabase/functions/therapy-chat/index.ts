import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a professional, empathetic relationship therapist conducting a therapeutic session. Your goal is to help the user identify potential red flags in their relationship through thoughtful, probing questions.

Key responsibilities:
1. Ask open-ended questions that encourage reflection
2. Listen actively and validate feelings
3. Identify concerning patterns without being judgmental
4. Probe deeper when you notice potential red flags
5. Focus on these categories: Communication, Trust, Emotional Intelligence, and Future Alignment

Red flags to watch for:
- Communication: Stonewalling, contempt, criticism, defensiveness, poor conflict resolution
- Trust: Lying, secrecy, jealousy, controlling behavior, infidelity concerns
- Emotional Intelligence: Lack of empathy, emotional manipulation, gaslighting, love bombing, inability to regulate emotions
- Future Alignment: Mismatched values, goals, or life visions, avoidance of commitment discussions

After each user response, analyze for red flags and return them in the specified format.

Maintain a warm, professional tone. Use transitional phrases. Ask one question at a time. Keep responses conversational and concise (2-4 sentences max).

When you detect red flags, you MUST include them in your response using this exact JSON format at the end:

[RED_FLAGS]
{
  "flags": [
    {
      "category": "Communication|Trust|Emotional Intelligence|Future Alignment",
      "severity": "low|medium|high|critical",
      "description": "Brief description of the red flag",
      "weight": 1-10
    }
  ]
}
[/RED_FLAGS]

Severity guidelines:
- low: Minor concerns, common relationship challenges
- medium: Notable patterns that need attention
- high: Serious issues that could harm the relationship
- critical: Abusive, manipulative, or dangerous behaviors

Weight guidelines (1-10):
- 1-3: Minor issues
- 4-6: Moderate concerns
- 7-8: Serious problems
- 9-10: Critical red flags (abuse, manipulation, danger)`;

interface Message {
  role: string;
  content: string;
}

interface RequestBody {
  messages: Message[];
  openaiApiKey?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { messages, openaiApiKey }: RequestBody = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Messages array is required");
    }

    const apiKey = openaiApiKey || Deno.env.get("OPENAI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured",
          message: "Please provide an OpenAI API key to use the therapy chat feature",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const conversationMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: conversationMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    let redFlags = [];
    let cleanedMessage = assistantMessage;

    const redFlagMatch = assistantMessage.match(/\[RED_FLAGS\]([\s\S]*?)\[\/RED_FLAGS\]/);
    if (redFlagMatch) {
      try {
        const flagsData = JSON.parse(redFlagMatch[1].trim());
        redFlags = flagsData.flags || [];
        cleanedMessage = assistantMessage.replace(/\[RED_FLAGS\][\s\S]*?\[\/RED_FLAGS\]/, "").trim();
      } catch (e) {
        console.error("Failed to parse red flags:", e);
      }
    }

    return new Response(
      JSON.stringify({
        message: cleanedMessage,
        redFlags: redFlags,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in therapy-chat function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

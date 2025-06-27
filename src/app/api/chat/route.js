export async function POST(req) {
  const { message } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                 text: `You are an intelligent assistant. Analyze the following input carefully and respond appropriately based on its context.

If it's a question, answer it accurately and clearly.

If it's content, summarize or explain it as needed.

If it's a greeting or command, respond naturally as a human-like assistant would.
Avoid markdown or unnecessary formatting. Keep your output clean, helpful, and context-aware.
Here is the content:
${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data?.error) {
      console.error("Gemini API Error:", data.error);
      return Response.json({ reply: `⚠️ ${data.error.message}` });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return Response.json({ reply: reply || "⚠️ No response from Gemini." });
  } catch (error) {
    console.error("Network Error:", error);
    return Response.json({ reply: "⚠️ Network error or API failure." });
  }
}
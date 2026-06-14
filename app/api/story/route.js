export async function POST(req) {
  console.log("API HIT");

  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Missing API key" }, { status: 500 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini response:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "EMPTY RESPONSE";

    return Response.json({ story: text });
  } catch (e) {
    console.log("ERROR:", e);
    return Response.json({ error: e.message }, { status: 500 });
  }
}

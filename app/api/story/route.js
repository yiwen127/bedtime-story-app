export async function POST(req) {
  try {
    console.log("API HIT");

    let body;

    try {
      body = await req.json();
    } catch (e) {
      console.log("JSON PARSE ERROR:", e);
      return Response.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const prompt = body?.prompt;

    if (!prompt) {
      return Response.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", JSON.stringify(data));

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    return Response.json({ story: text });

  } catch (e) {
    console.log("FATAL ERROR:", e);

    return Response.json(
      {
        error: e.message,
      },
      { status: 500 }
    );
  }
}

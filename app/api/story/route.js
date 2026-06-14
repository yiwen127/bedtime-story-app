export async function POST(req) {
  try {
    console.log("API HIT");

    // 1. Safely parse request body
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

    // 2. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    // 3. Critical safety check (prevents silent failures)
    if (!response.ok) {
      const errText = await response.text();

      console.log("GEMINI ERROR:", errText);

      return Response.json(
        {
          error: "Gemini API failed",
          status: response.status,
          detail: errText,
        },
        { status: 500 }
      );
    }

    // 4. Parse response safely
    const data = await response.json();

    console.log("GEMINI RAW:", JSON.stringify(data));

    const story =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    if (!story) {
      return Response.json(
        {
          error: "Empty story returned",
          raw: data,
        },
        { status: 500 }
      );
    }

    // 5. Return clean response to frontend
    return Response.json({ story });

  } catch (e) {
    console.log("FATAL ERROR:", e);

    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  console.log("API HIT");

  try {
    let bodyText;

    try {
      bodyText = await req.text();
      console.log("RAW BODY:", bodyText);
    } catch (e) {
      return Response.json(
        { error: "Cannot read request body" },
        { status: 400 }
      );
    }

    let body;

    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      return Response.json(
        {
          error: "Invalid JSON",
          raw: bodyText,
        },
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

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      { error: e.message },
      { status: 500 }
    );
  }
}

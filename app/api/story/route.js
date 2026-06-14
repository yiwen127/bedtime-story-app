export async function POST(req) {
  try {
    console.log("API HIT");

    const body = await req.json().catch(() => null);

    console.log("BODY:", body);

    if (!body?.prompt) {
      return Response.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: body.prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI:", JSON.stringify(data));

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    return Response.json({ story: text });

  } catch (e) {
    console.log("ERROR:", e);

    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}

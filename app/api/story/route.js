export async function POST(req) {
  try {
    const { prompt } = await req.json();

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
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔴 关键：打印出来方便你在 Vercel 看日志
    console.log("Gemini full response:", JSON.stringify(data, null, 2));

    const text =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";

    return Response.json({ story: text });

  } catch (e) {
    return Response.json(
      { error: e.message },
      { status: 500 }
    );
  }
}

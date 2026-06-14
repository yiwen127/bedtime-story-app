"use client";

import { useState } from "react";

function buildPrompt(name, age, theme) {
  return `
Write a bedtime story.

Child: ${name}
Age: ${age}
Theme: ${theme}

Rules:
- 400–600 words
- Calm tone
- Child is main character
- No scary content
- End with sleep ending
`;
}

export default function Page() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("magic");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);

    const prompt = buildPrompt(name, age, theme);

    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    setStory(data.story || "No story returned");
    setLoading(false);
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>🌙 Bedtime Story</h1>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Age" onChange={e => setAge(e.target.value)} />
      <br /><br />

      <select onChange={e => setTheme(e.target.value)}>
        <option value="magic">Magic</option>
        <option value="animals">Animals</option>
        <option value="space">Space</option>
      </select>

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Create Story"}
      </button>

      <hr />

      <pre style={{ whiteSpace: "pre-wrap" }}>{story}</pre>
    </div>
  );
}

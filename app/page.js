"use client";

import { useState } from "react";

const THEMES = [
  { value: "magic", label: "Magic ✨", emoji: "✨" },
  { value: "animals", label: "Animals 🐾", emoji: "🐾" },
  { value: "space", label: "Space 🚀", emoji: "🚀" },
  { value: "pikachu", label: "Pikachu ⚡", emoji: "⚡" },
  { value: "hellokitty", label: "Hello Kitty 🎀", emoji: "🎀" },
  { value: "beyblade", label: "Beyblade 🌀", emoji: "🌀" },
];

function buildPrompt(name, age, theme) {
  return `
Write a bedtime story.

Child name: ${name}
Age: ${age}
Theme: ${theme}

Rules:
- 450–600 words
- Warm, calm, bedtime tone
- Include child's name multiple times
- No scary content
- End with peaceful sleep ending

Theme guidance:
- pikachu: friendly Pikachu companion
- hellokitty: soft pastel friendship world
- beyblade: magical spinning top adventure
`;
}

export default function Page() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("magic");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateStory() {
    if (!name || !age) {
      setError("Please enter name and age");
      return;
    }

    setError("");
    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: buildPrompt(name, age, theme),
        }),
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      // ✅ ultra-safe parsing (关键修复点)
      const text =
        data?.story ||
        data?.text ||
        data?.response ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "";

      if (!text) {
        setStory("No story returned (check API response)");
      } else {
        setStory(text);
      }
    } catch (e) {
      setError("Error: " + e.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "Arial",
        background: "#07102a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h1>🌙 Bedtime Story Generator</h1>

      <input
        placeholder="Child name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      >
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.emoji} {t.label}
          </option>
        ))}
      </select>

      <button onClick={generateStory} disabled={loading}>
        {loading ? "Generating..." : "Create Story"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr style={{ margin: "20px 0" }} />

      <pre style={{ whiteSpace: "pre-wrap" }}>{story}</pre>
    </div>
  );
}

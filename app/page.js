"use client";

import { useState, useRef } from "react";

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
- 450 to 600 words
- Calm, warm, gentle tone
- Include child's name multiple times
- No scary content
- End with a peaceful sleep ending

If theme is:
- pikachu: include Pikachu as a friendly companion
- hellokitty: soft pastel world, friendship focus
- beyblade: magical spinning top adventure
`;
}

export default function Page() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("magic");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateStory() {
    if (!name || !age) {
      alert("Please enter name and age");
      return;
    }

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

      setStory(data.story || "No story returned");
    } catch (e) {
      setStory("Error generating story: " + e.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        padding: 30,
        fontFamily: "Arial",
        minHeight: "100vh",
        background: "#07102a",
        color: "white",
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

      <hr style={{ margin: "20px 0" }} />

      <pre style={{ whiteSpace: "pre-wrap" }}>{story}</pre>
    </div>
  );
}

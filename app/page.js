"use client";

import { useState, useRef, useEffect } from "react";

const THEMES = [
  { value: "magic", label: "Magic", emoji: "✨" },
  { value: "animals", label: "Animals", emoji: "🐾" },
  { value: "space", label: "Space", emoji: "🚀" },
  { value: "pikachu", label: "Pikachu", emoji: "⚡" },
  { value: "hellokitty", label: "Hello Kitty", emoji: "🎀" },
  { value: "beyblade", label: "Beyblade", emoji: "🌀" },
];

const SLEEP_ENDING =
  "Now it is time to close your eyes… you are safe… you are loved… drift softly into your sweetest dreams…";

const STAR_COUNT = 60;

function Stars() {
  const stars = useRef(
    Array.from({ length: STAR_COUNT }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: Math.random() * 3 + 2,
    }))
  );

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
      {stars.current.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: 0.7,
            animation: `twinkle ${s.duration}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function Moon() {
  return (
    <div
      style={{
        position: "fixed",
        top: 40,
        right: 40,
        width: 70,
        height: 70,
        borderRadius: "50%",
        background: "radial-gradient(circle, #fff6c0, #f5d87a)",
        boxShadow: "0 0 40px rgba(245,216,122,0.3)",
      }}
    />
  );
}

export default function Page() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [theme, setTheme] = useState("magic");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(false);

  function buildPrompt() {
    return `
Write a bedtime story.

Child: ${name}
Age: ${age}
Theme: ${theme}

Rules:
- 450–600 words
- Calm, warm tone
- Include child's name multiple times
- No scary content
- End with sleep ending

If theme is:
- pikachu → include friendly Pikachu companion
- hellokitty → pastel cute world, friendship focus
- beyblade → magical spinning top adventure
`;
  }

  async function generate() {
    if (!name || !age) return alert("Fill all fields");

    setLoading(true);
    setStory("");

    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt() }),
      });

      const data = await res.json();
      setStory(data.story || "No story returned");
      setUsed(true);
    } catch (e) {
      setStory("Error generating story");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 30, color: "white", background: "#07102a", minHeight: "100vh" }}>
      <Stars />
      <Moon />

      <h1>🌙 Bedtime Stories</h1>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <br /><br />

      <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <br /><br />

      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        {THEMES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.emoji} {t.label}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Create Story"}
      </button>

      <hr />

      <pre style={{ whiteSpace: "pre-wrap" }}>{story}</pre>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

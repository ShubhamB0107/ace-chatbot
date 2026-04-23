// ============================================================
// Ace Chatbot - React Frontend
// File: frontend/src/App.jsx
// Run: npm start (after npm install)
// ============================================================

import { useState, useRef, useEffect } from "react";

// ── Config ───────────────────────────────────────────────────
const API_URL = "http://localhost:8000"; // Your FastAPI backend URL

// ── Helper: call the backend ─────────────────────────────────
async function sendMessageToAPI(message, history) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Something went wrong");
  }

  return response.json(); // Returns { reply, tokens_used }
}

// ── Main App Component ────────────────────────────────────────
export default function App() {
  const [messages, setMessages]   = useState([
    { role: "assistant", content: "Hi! I am your Ace AI assistant. Ask me anything!" }
  ]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const bottomRef                 = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send Message ──────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);

    // Add user message to chat immediately (optimistic update)
    const updatedMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build history (exclude the welcome message at index 0)
      const history = updatedMessages.slice(1).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const data = await sendMessageToAPI(userMessage, history);

      // Add AI reply to chat
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>AI</div>
        <div>
          <h2 style={styles.title}>Ace Chatbot</h2>
          <p style={styles.subtitle}>Powered by GPT-4o-mini + FastAPI</p>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.role === "user" ? styles.userRow : styles.botRow}>
            <div style={msg.role === "user" ? styles.userBubble : styles.botBubble}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {loading && (
          <div style={styles.botRow}>
            <div style={styles.botBubble}>Thinking...</div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={styles.error}>Error: {error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          disabled={loading}
        />
        <button
          style={loading ? styles.btnDisabled : styles.btn}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

// ── Styles (inline CSS — easy to understand for beginners) ───
const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    height: "85vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #ddd",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  header: {
    background: "#1a3a6e",
    color: "white",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#378ADD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: { margin: 0, fontSize: 16 },
  subtitle: { margin: 0, fontSize: 12, opacity: 0.7 },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    background: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  botRow:  { display: "flex", justifyContent: "flex-start" },
  userRow: { display: "flex", justifyContent: "flex-end" },
  botBubble: {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "14px 14px 14px 4px",
    padding: "10px 14px",
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.6,
    color: "#222",
  },
  userBubble: {
    background: "#1a3a6e",
    color: "white",
    borderRadius: "14px 14px 4px 14px",
    padding: "10px 14px",
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.6,
  },
  error: {
    color: "#c0392b",
    background: "#fdecea",
    padding: "8px 14px",
    borderRadius: 8,
    fontSize: 13,
  },
  inputArea: {
    display: "flex",
    gap: 8,
    padding: "12px 16px",
    borderTop: "1px solid #ddd",
    background: "white",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 14,
    resize: "none",
    fontFamily: "Arial, sans-serif",
    outline: "none",
  },
  btn: {
    padding: "10px 20px",
    background: "#1a3a6e",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: 14,
  },
  btnDisabled: {
    padding: "10px 20px",
    background: "#aaa",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "not-allowed",
    fontSize: 14,
  },
};
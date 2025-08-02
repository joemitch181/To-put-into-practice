import { useState } from "react";
import axios from "axios";

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiReply = response.data.choices[0].message.content;
      setMessages([...newMessages, { role: "assistant", content: aiReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Sorry, I couldn't respond." }]);
      console.error("AI request failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Talk to the AI</h1>

      {messages.map((m, i) => (
        <div key={i}>
          <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
        </div>
      ))}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask the AI anything..."
        className="border p-2 mr-2"
      />
      <button onClick={handleSend} className="px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </div>
  );
}

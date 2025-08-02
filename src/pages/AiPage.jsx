import React from "react";
import AiChat from "../components/AiChat";

export default function AiPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Talk to the AI</h1>
      <AiChat />
    </div>
  );
}

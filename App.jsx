
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ulaxmqgdwrtsbxdjimwa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Truncated for clarity

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const uploadFile = async () => {
    if (!file) return;
    const filePath = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from("uploads").upload(filePath, file);
    if (error) {
      alert("File upload failed.");
      return;
    }
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
    saveContent(fileUrl);
  };

  const saveContent = async (fileUrl = null) => {
    const { error } = await supabase.from("content").insert([
      {
        title,
        description,
        type: file ? file.type : "text",
        file_url: fileUrl,
        tags: [],
      },
    ]);
    if (error) alert("Failed to save content.");
    setTitle("");
    setDescription("");
    setFile(null);
    loadContent();
  };

  const loadContent = async () => {
    const { data } = await supabase.from("content").select("*").order("created_at", { ascending: false });
    setContentList(data || []);
  };

  const handleAskAI = async () => {
    const results = contentList
      .filter(item =>
        (item.title + item.description).toLowerCase().includes(query.toLowerCase())
      )
      .map(item => `• ${item.title}: ${item.description}`)
      .join("\n");

    setAiResponse(results || "I couldn't find anything directly related. Try rephrasing your question.");
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">To Put Into Practice</h1>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border mb-2" />
      <textarea placeholder="Description or Note" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border mb-2" />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
      <div className="flex gap-2">
        <button onClick={uploadFile} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
        <button onClick={() => saveContent(null)} className="bg-green-500 text-white px-4 py-2 rounded">Save Text Only</button>
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Ask AI About Your Notes</h2>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask something..." className="w-full p-2 border mb-2" />
      <button onClick={handleAskAI} className="bg-purple-600 text-white px-4 py-2 rounded mb-4">Ask</button>
      <pre className="bg-gray-100 p-2 whitespace-pre-wrap">{aiResponse}</pre>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Saved Content</h2>
      <div>
        {contentList.map((item) => (
          <div key={item.id} className="border p-2 mb-2">
            <h3 className="font-bold">{item.title}</h3>
            <p>{item.description}</p>
            {item.file_url && (
              item.type.startsWith("image") ? (
                <img src={item.file_url} alt="uploaded" className="mt-2 max-w-full" />
              ) : (
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open File</a>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

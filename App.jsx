
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ulaxmqgdwrtsbxdjimwa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Truncated for brevity

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
    const { error } = await supabase.storage.from("uploads").upload(filePath, file);
    if (error) return alert("Upload failed.");
    const fileUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
    saveContent(fileUrl);
  };

  const saveContent = async (fileUrl = null) => {
    const { error } = await supabase.from("content").insert([{
      title, description, type: file ? file.type : "text", file_url: fileUrl, tags: []
    }]);
    if (error) alert("Failed to save content.");
    setTitle(""); setDescription(""); setFile(null); loadContent();
  };

  const loadContent = async () => {
    const { data } = await supabase.from("content").select("*").order("created_at", { ascending: false });
    setContentList(data || []);
  };

  const handleAskAI = () => {
    const results = contentList
      .filter(item => (item.title + item.description).toLowerCase().includes(query.toLowerCase()))
      .map(item => `• ${item.title}: ${item.description}`)
      .join("\n");
    setAiResponse(results || "No matching content found.");
  };

  useEffect(() => { loadContent(); }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">To Put Into Practice</h1>

      <div className="space-y-4 mb-8">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description or Note"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])}
          className="text-white file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
        <div className="flex gap-4">
          <button onClick={uploadFile} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Upload</button>
          <button onClick={() => saveContent(null)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Save Text Only</button>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Ask AI About Your Notes</h2>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask something..."
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2" />
        <button onClick={handleAskAI} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mb-3">Ask</button>
        <pre className="whitespace-pre-wrap bg-gray-900 border border-gray-700 p-3 rounded text-sm">{aiResponse}</pre>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Saved Content</h2>
      <div className="grid gap-4">
        {contentList.map((item) => (
          <div key={item.id} className="bg-gray-800 p-4 rounded shadow border border-gray-700">
            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
            <p className="text-sm mb-2">{item.description}</p>
            {item.file_url && (
              item.type.startsWith("image") ? (
                <img src={item.file_url} alt="uploaded" className="mt-2 max-w-full rounded" />
              ) : (
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Open File</a>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

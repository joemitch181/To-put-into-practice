
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ulaxmqgdwrtsbxdjimwa.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYXhtcWdkd3J0c2J4ZGppbXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjQ1MTMsImV4cCI6MjA2ODYwMDUxM30.nSunUhvMq6kn3JVKRBdb_HjB8HzbIVhIP0QzqZ1THlc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [contentList, setContentList] = useState([]);

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
    setContentList(data);
  };

  useEffect(() => {
    loadContent();
  }, []);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">To Put Into Practice</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <textarea
        placeholder="Description or Note"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
      <div className="flex gap-2">
        <button onClick={uploadFile} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
        <button onClick={() => saveContent(null)} className="bg-green-500 text-white px-4 py-2 rounded">Save Text Only</button>
      </div>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold mb-2">Your Saved Content</h2>
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

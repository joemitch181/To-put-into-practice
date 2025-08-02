import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function UploadComponent({ onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from Supabase
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*').order('created_at');
      if (!error) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleUpload = async () => {
    let fileUrl = '';
    if (file) {
      const filePath = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('user-content').upload(filePath, file);
      if (error) {
        console.error('Upload failed:', error.message);
        return;
      }
      const { data: urlData } = await supabase.storage.from('user-content').getPublicUrl(filePath);
      fileUrl = urlData.publicUrl;
    }

    const content = `${title}\n${description}${fileUrl ? `\nFile: ${fileUrl}` : ''}`;
    const { error: insertError } = await supabase.from('notes').insert([
      {
        type: 'mixed',
        content,
        category,
        tags,
      },
    ]);

    if (insertError) {
      console.error('Note insert failed:', insertError.message);
    } else {
      setTitle('');
      setDescription('');
      setTags('');
      setCategory('');
      setFile(null);
      if (onSave) onSave();
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-2">Upload New Note</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block border px-2 py-1 mb-2 w-full"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block border px-2 py-1 mb-2 w-full"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-2"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="block border px-2 py-1 mb-2 w-full"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="block border px-2 py-1 mb-2 w-full"
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}

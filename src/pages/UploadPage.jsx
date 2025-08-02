import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import axios from 'axios';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const categoryOptions = ['Rug', 'Jitz', 'Coaching', 'Planning'];

  const handleUpload = async () => {
    if (!title || !category || !file) {
      setMessage('Please provide a title, category, and file.');
      return;
    }

    setUploading(true);
    setMessage('');

    const filePath = `${category}/${file.name}`;
    const bucket = 'your-bucket-name'; // replace with your bucket name

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage('Upload failed.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const fileUrl = urlData.publicUrl;
    let transcript = null;

    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', 'whisper-1');

        const response = await axios.post(
          'https://api.openai.com/v1/audio/transcriptions',
          formData,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        transcript = response.data.text;
      } catch (err) {
        console.error('Transcription failed', err);
        transcript = '⚠️ Transcription failed.';
      }
    }

    const { error: insertError } = await supabase.from('notes').insert([
      {
        title,
        description,
        file_url: fileUrl,
        file_type: file.type,
        category,
        tags,
        transcript,
      },
    ]);

    if (insertError) {
      console.error(insertError.message);
      setMessage('Failed to save to database.');
    } else {
      setMessage('✅ Upload successful!');
      setTitle('');
      setDescription('');
      setFile(null);
      setCategory('');
      setTags('');
    }

    setUploading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold mb-4">Upload Note</h2>

      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select category</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        className="w-full border p-2 rounded"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <input
        className="w-full border p-2 rounded"
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {message && <p className="text-center mt-2">{message}</p>}
    </div>
  );
}

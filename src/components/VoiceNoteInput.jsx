import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function VoiceNoteInput({ onSave }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  async function handleUpload() {
    if (!file) return;
    const filePath = `voice/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from('notes').insert([
      {
        type: 'voice',
        content: filePath,
        category,
        tags
      }
    ]);

    if (insertError) {
      console.error(insertError.message);
    } else {
      setFile(null);
      setCategory('');
      setTags('');
      onSave?.();
    }
  }

  return (
    <div className="my-4">
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <input
        className="w-full p-2 border mt-2 rounded"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        className="w-full p-2 border mt-2 rounded"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded" onClick={handleUpload}>
        Upload Voice Note
      </button>
    </div>
  );
}

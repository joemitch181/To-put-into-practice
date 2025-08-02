import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function TextNoteInput({ onSave }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  async function handleSave() {
    const { data, error } = await supabase.from('notes').insert([
      {
        type: 'text',
        content: text,
        category,
        tags
      }
    ]);

    if (error) {
      console.error('Save failed:', error.message);
    } else {
      setText('');
      setCategory('');
      setTags('');
      onSave?.(data[0]);
    }
  }

  return (
    <div className="my-4">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write your note here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
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
      <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded" onClick={handleSave}>
        Save Note
      </button>
    </div>
  );
}

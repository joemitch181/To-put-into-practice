
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function StoragePage() {
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchNotes();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      const categoryName = categories.find(c => c.id === activeCategory)?.name;
      if (categoryName) {
        setFilteredNotes(notes.filter(note => note.category === categoryName));
      } else {
        setFilteredNotes(notes);
      }
    } else {
      setFilteredNotes(notes);
    }
  }, [activeCategory, categories, notes]);

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('created_at');
    if (!error) setCategories(data);
  }

  async function fetchNotes() {
    const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    if (!error) setNotes(data);
  }

  async function addCategory() {
    const name = prompt('Enter new category name:');
    if (!name) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select();

    if (!error && data?.length) {
      setCategories((prev) => [...prev, ...data]);
      setActiveCategory(data[0].id);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filter Stored Notes</h1>

      <div className="flex items-center space-x-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center space-x-1">
            {cat.editing ? (
              <>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) =>
                    setCategories((prev) =>
                      prev.map((c) => (c.id === cat.id ? { ...c, name: e.target.value } : c))
                    )
                  }
                  className="border px-2 py-1 rounded"
                />
                <button
                  className="text-green-600 font-bold"
                  onClick={async () => {
                    const { error } = await supabase
                      .from('categories')
                      .update({ name: cat.name })
                      .eq('id', cat.id);
                    if (!error) {
                      setCategories((prev) =>
                        prev.map((c) =>
                          c.id === cat.id ? { ...c, editing: false } : c
                        )
                      );
                    }
                  }}
                >
                  ✔
                </button>
                <button
                  className="text-gray-500 font-bold"
                  onClick={() =>
                    setCategories((prev) =>
                      prev.map((c) =>
                        c.id === cat.id ? { ...c, editing: false } : c
                      )
                    )
                  }
                >
                  ✖
                </button>
              </>
            ) : (
              <>
                <button
                  className={`px-3 py-2 rounded ${
                    activeCategory === cat.id ? 'bg-purple-600 text-white' : 'bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </button>
                <button
                  className="text-sm text-yellow-600"
                  onClick={() =>
                    setCategories((prev) =>
                      prev.map((c) =>
                        c.id === cat.id ? { ...c, editing: true } : c
                      )
                    )
                  }
                >
                  ✎
                </button>
                <button
                  className="text-sm text-red-500"
                  onClick={async () => {
                    if (!confirm(`Delete category "${cat.name}"?`)) return;
                    const { error } = await supabase
                      .from('categories')
                      .delete()
                      .eq('id', cat.id);
                    if (!error) {
                      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
                      if (activeCategory === cat.id) setActiveCategory(null);
                    }
                  }}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        ))}

        <button
          className="px-3 py-2 bg-green-500 text-white rounded"
          onClick={addCategory}
        >
          +
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredNotes.map(note => (
          <div key={note.id} className="border rounded p-4 shadow bg-white">
            <h2 className="font-bold text-lg">{note.title}</h2>
            <p className="text-sm text-gray-600 mb-1">{note.category}</p>
            <p className="mb-2">{note.description}</p>

            {note.file_url?.includes('image') && (
              <img src={note.file_url} alt="Note visual" className="w-full rounded mb-2" />
            )}
            {note.file_url?.includes('video') && (
              <video src={note.file_url} controls className="w-full rounded mb-2" />
            )}
            {note.file_url?.includes('audio') && (
              <audio src={note.file_url} controls className="w-full mb-2" />
            )}

            {note.transcript && (
              <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                <strong>Transcript:</strong> {note.transcript}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-2">Tags: {note.tags}</p>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-center text-gray-500">No notes found.</p>
      )}
    </div>
  );
}

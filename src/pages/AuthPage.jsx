import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import UploadPage from './UploadPage';
import StoragePage from './StoragePage';
import AiPage from './AiPage';

export default function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('upload');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Login/Register</h1>
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="mb-4 space-x-2">
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => setView('upload')}
        >
          Upload
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setView('storage')}
        >
          Storage
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setView('ai')}
        >
          AI Assistant
        </button>
      </div>

      {view === 'upload' && <UploadPage />}
      {view === 'storage' && <StoragePage />}
      {view === 'ai' && <AiPage />}
    </div>
  );
}

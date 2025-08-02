import React, { useState } from 'react';
import UploadPage from './UploadPage';
import StoragePage from './StoragePage';
import AiPage from './AiPage';

export default function App() {
  const [view, setView] = useState('upload');

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView('upload')}
          className={`px-4 py-2 rounded ${
            view === 'upload' ? 'bg-purple-700 text-white' : 'bg-purple-200'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setView('storage')}
          className={`px-4 py-2 rounded ${
            view === 'storage' ? 'bg-blue-700 text-white' : 'bg-blue-200'
          }`}
        >
          Storage
        </button>
        <button
          onClick={() => setView('ai')}
          className={`px-4 py-2 rounded ${
            view === 'ai' ? 'bg-green-700 text-white' : 'bg-green-200'
          }`}
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

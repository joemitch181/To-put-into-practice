import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App'; // <-- Make sure this path is correct
import './index.css'; // Tailwind styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

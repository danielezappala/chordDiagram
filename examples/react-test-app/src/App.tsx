import ChordTestPage from './ChordTestPage';
import React from 'react';


import { VersionBadge } from './components/VersionBadge';

function App() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      {/* Banner TEST APP */}
      <div className="w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white text-center py-3 shadow-lg z-50">
        <span className="font-bold text-lg tracking-wide">TEST APP &mdash; ChordTestPage</span>
        <VersionBadge />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6">
          <ChordTestPage />
        </div>
      </div>
    </div>
  );
}

export default App;

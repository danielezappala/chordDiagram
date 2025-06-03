import ChordTestPage from './ChordTestPage';
import React from 'react';


function App() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6">
          <ChordTestPage />
        </div>
      </div>
    </div>
  );
}

export default App;

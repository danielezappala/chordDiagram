import ChordTestPage from './ChordTestPage';

function App() {
  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6">
          <ChordTestPage />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .dark ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark ::-webkit-scrollbar-thumb {
          background: #4b5563;
        }`
      }} />
    </div>
  );
}

export default App;

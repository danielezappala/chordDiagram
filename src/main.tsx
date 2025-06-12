import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence } from 'framer-motion';
import './index.css';
import App from './App';

// Helper component to handle dark mode
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Check for dark mode preference
    if (
      localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}

// Main app container with providers
export function Root() {
  return (
    <StrictMode>
      <ThemeProvider>
        <AnimatePresence mode="wait" initial={false}>
          <App />
        </AnimatePresence>
      </ThemeProvider>
    </StrictMode>
  );
}

// Render the app
createRoot(document.getElementById('root')!).render(<Root />);
